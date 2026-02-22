import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import pricingData from '@/data/pricing.json';

// ============================================================================
// FONCTIONS DE SÉCURITÉ - Protection contre XSS et injections
// ============================================================================

/**
 * Échappe les caractères HTML pour prévenir les attaques XSS
 * Doit être utilisé pour TOUS les inputs utilisateur avant insertion dans du HTML
 */
function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Valide le format d'une adresse email
 * Empêche les injections d'en-têtes email (CRLF injection)
 */
function isValidEmail(email: string): boolean {
  // Vérifie les caractères dangereux pour l'injection d'en-têtes
  if (/[\r\n\0]/.test(email)) {
    return false;
  }
  // Regex stricte pour les emails valides
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valide et nettoie une URL
 * Empêche les URL javascript: et autres protocoles dangereux
 */
function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  // Bloque les protocoles dangereux
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(trimmed)) {
    return '';
  }
  // Échappe le HTML dans l'URL
  return escapeHtml(trimmed);
}

/**
 * Valide et nettoie un numéro de téléphone
 */
function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  // Garde uniquement les caractères valides pour un téléphone
  const cleaned = phone.replace(/[^\d+\-.()\s]/g, '');
  return escapeHtml(cleaned.slice(0, 20));
}

/**
 * Nettoie un texte général (nom, entreprise, message)
 * Limite la longueur et échappe le HTML
 */
function sanitizeText(text: string | null | undefined, maxLength: number = 1000): string {
  if (!text) return '';
  return escapeHtml(String(text).slice(0, maxLength));
}

// ============================================================================

// Cache en mémoire pour la limitation d'envoi (en production, utilisez Redis)
const emailLimitCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes en millisecondes
const MAX_EMAILS_PER_WINDOW = 2; // Maximum 2 emails par fenêtre de 15 minutes

const pricingLookup: Record<string, { name: string; summary: string }> = (() => {
  const lookup: Record<string, { name: string; summary: string }> = {};

  pricingData.plans.forEach((plan) => {
    lookup[plan.type] = {
      name: plan.name,
      summary: `${plan.name} (${plan.price}${plan.period ? ` ${plan.period}` : ''})`,
    };
  });

  if (pricingData.maintenance) {
    lookup.maintenance = {
      name: pricingData.maintenance.name,
      summary: `${pricingData.maintenance.name} (${pricingData.maintenance.price} ${pricingData.maintenance.period})`,
    };
  }

  return lookup;
})();

const getPlanSummary = (planType: string) =>
  pricingLookup[planType] ?? { name: 'Offre personnalisée', summary: 'Offre personnalisée' };

// Fonction pour nettoyer le cache périodiquement
function cleanupCache() {
  const now = Date.now();
  for (const [key, data] of emailLimitCache.entries()) {
    if (now - data.lastReset > RATE_LIMIT_WINDOW) {
      emailLimitCache.delete(key);
    }
  }
}

// Fonction pour vérifier et mettre à jour la limitation
function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  cleanupCache();
  
  const now = Date.now();
  const existing = emailLimitCache.get(identifier);
  
  if (!existing) {
    // Première tentative
    emailLimitCache.set(identifier, { count: 1, lastReset: now });
    return { allowed: true };
  }
  
  // Vérifier si la fenêtre a expiré
  if (now - existing.lastReset > RATE_LIMIT_WINDOW) {
    // Réinitialiser le compteur
    emailLimitCache.set(identifier, { count: 1, lastReset: now });
    return { allowed: true };
  }
  
  // Vérifier si la limite est atteinte
  if (existing.count >= MAX_EMAILS_PER_WINDOW) {
    const remainingTime = RATE_LIMIT_WINDOW - (now - existing.lastReset);
    return { allowed: false, remainingTime };
  }
  
  // Incrémenter le compteur
  existing.count++;
  return { allowed: true };
}

// Fonction pour valider le token reCAPTCHA
async function validateRecaptchaToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/recaptcha/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return response.ok && result.valid;
  } catch (error) {
    console.error('Erreur lors de la validation reCAPTCHA:', error);
    return false;
  }
}

// Fonction pour obtenir l'IP du client
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Début de la requête d\'envoi d\'email');
    
    const body = await request.json();
    const { name, email, phone, company, message, siteUrl, formType, recaptchaToken } = body;

    console.log('📧 [DEBUG] Données reçues:', {
      name: !!name,
      email: !!email,
      formType,
      hasMessage: !!message
    });

    // Validation des champs requis
    if (!name || !email) {
      console.log('❌ [DEBUG] Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis' },
        { status: 400 }
      );
    }

    // Validation stricte de l'email (protection contre injection d'en-têtes)
    if (!isValidEmail(email)) {
      console.log('❌ [DEBUG] Format email invalide ou tentative d\'injection');
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Nettoyage et validation de tous les inputs
    const safeName = sanitizeText(name, 100);
    const safeEmail = escapeHtml(email); // Déjà validé, juste échapper pour HTML
    const safePhone = sanitizePhone(phone);
    const safeCompany = sanitizeText(company, 100);
    const safeMessage = sanitizeText(message, 5000);
    const safeSiteUrl = sanitizeUrl(siteUrl);

    // Vérifier que les champs requis ne sont pas vides après nettoyage
    if (!safeName.trim()) {
      return NextResponse.json(
        { error: 'Le nom contient des caractères invalides' },
        { status: 400 }
      );
    }

    // Validation du reCAPTCHA
    if (!recaptchaToken) {
      console.log('❌ [DEBUG] Token reCAPTCHA manquant');
      return NextResponse.json(
        { error: 'Token reCAPTCHA manquant. Veuillez compléter la vérification.' },
        { status: 400 }
      );
    }

    // Valider le token reCAPTCHA
    const isRecaptchaValid = await validateRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
      console.log('❌ [DEBUG] Token reCAPTCHA invalide:', { recaptchaToken: recaptchaToken.substring(0, 20) + '...' });
      return NextResponse.json(
        { error: 'Échec de la vérification reCAPTCHA. Veuillez réessayer.' },
        { status: 400 }
      );
    }

    console.log('✅ [DEBUG] Token reCAPTCHA valide');

    // Protection anti-spam : limitation par IP et par email
    const clientIP = getClientIP(request);
    const ipIdentifier = `ip:${clientIP}`;
    const emailIdentifier = `email:${email.toLowerCase()}`;
    
    console.log('🛡️ [DEBUG] Vérification anti-spam:', {
      clientIP,
      email: email.toLowerCase()
    });

    // Vérifier la limitation par IP
    const ipLimit = checkRateLimit(ipIdentifier);
    if (!ipLimit.allowed) {
      const remainingMinutes = Math.ceil((ipLimit.remainingTime || 0) / (60 * 1000));
      console.log('🚫 [DEBUG] Limite IP atteinte:', { clientIP, remainingMinutes });
      return NextResponse.json(
        {
          error: `Trop de tentatives d'envoi depuis cette adresse IP. Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`,
          rateLimited: true,
          remainingTime: ipLimit.remainingTime
        },
        { status: 429 }
      );
    }

    // Vérifier la limitation par email
    const emailLimit = checkRateLimit(emailIdentifier);
    if (!emailLimit.allowed) {
      const remainingMinutes = Math.ceil((emailLimit.remainingTime || 0) / (60 * 1000));
      console.log('🚫 [DEBUG] Limite email atteinte:', { email: email.toLowerCase(), remainingMinutes });
      return NextResponse.json(
        {
          error: `Trop de messages envoyés avec cette adresse email. Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`,
          rateLimited: true,
          remainingTime: emailLimit.remainingTime
        },
        { status: 429 }
      );
    }

    console.log('✅ [DEBUG] Protection anti-spam : autorisé');

    // Configuration du sujet selon le type de formulaire
    const getSubjectAndContent = () => {
      switch (formType) {
        case 'onepage':
          return {
            subject: 'Nouvelle demande de devis - Site One Page',
            subtitle: pricingLookup.onepage?.summary ?? 'Formule Site One Page',
          };
        case 'vitrine':
          return {
            subject: 'Nouvelle demande de devis - Site Vitrine',
            subtitle: pricingLookup.vitrine?.summary ?? 'Formule Site Vitrine',
          };
        case 'eshop':
          return {
            subject: 'Nouvelle demande de devis - Site E-shop',
            subtitle: pricingLookup.eshop?.summary ?? 'Formule Site E-shop',
          };
        case 'custom':
          return {
            subject: 'Nouvelle demande de devis - Site Sur Mesure',
            subtitle: 'Solution personnalisée'
          };
        case 'maintenance':
          return {
            subject: 'Nouvelle demande de devis - Forfait Maintenance',
            subtitle: pricingLookup.maintenance?.summary ?? 'Forfait Maintenance',
          };
        default:
          return {
            subject: 'Nouveau message de contact',
            subtitle: 'Contact général'
          };
      }
    };

    const { subject, subtitle } = getSubjectAndContent();

    // Vérification des variables d'environnement
    console.log('🔧 [DEBUG] Vérification des variables d\'environnement:', {
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
      CONTACT_EMAIL: !!process.env.CONTACT_EMAIL,
      NODE_ENV: process.env.NODE_ENV
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ [DEBUG] Variables d\'environnement manquantes:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
        GMAIL_USER_VALUE: process.env.GMAIL_USER ? 'définie' : 'non définie',
        GMAIL_APP_PASSWORD_LENGTH: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0
      });
      return NextResponse.json(
        { error: 'Configuration email manquante. Vérifiez les variables d\'environnement.' },
        { status: 500 }
      );
    }

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Utilise la configuration Gmail optimisée de Nodemailer
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Mot de passe d'application Gmail
      },
      debug: true, // Active les logs de débogage
      logger: true, // Active les logs détaillés
    });

    // Template HTML pour l'email
    const planSummary = getPlanSummary(formType);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #000; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>JVNR</h1>
              <h2>${subject}</h2>
              <p>${subtitle}</p>
            </div>
            <div class="content">
              <h3>Informations du contact :</h3>
              <div class="info-row">
                <span class="label">Nom :</span> ${safeName}
              </div>
              <div class="info-row">
                <span class="label">Email :</span> ${safeEmail}
              </div>
              <div class="info-row">
                <span class="label">Téléphone :</span> ${safePhone || 'Non renseigné'}
              </div>
              <div class="info-row">
                <span class="label">Entreprise :</span> ${safeCompany || 'Non renseignée'}
              </div>
              <div class="info-row">
                <span class="label">Offre :</span> ${escapeHtml(planSummary.summary)}
              </div>
              ${safeSiteUrl ? `
              <div class="info-row">
                <span class="label">URL du site :</span> ${safeSiteUrl}
              </div>
              ` : ''}

              ${safeMessage ? `
              <div class="message-box">
                <h4>Message :</h4>
                <p>${safeMessage.replace(/\n/g, '<br>')}</p>
              </div>
              ` : ''}
              
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                Envoyé depuis le formulaire de contact du site JVNR<br>
                Date : ${new Date().toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Version texte de l'email (pas besoin d'échappement HTML, mais on utilise les valeurs nettoyées)
    const textContent = `
${subject}
${subtitle}

Informations du contact :
- Nom : ${safeName}
- Email : ${email}
- Téléphone : ${safePhone || 'Non renseigné'}
- Entreprise : ${safeCompany || 'Non renseignée'}
- Offre : ${planSummary.summary}
${safeSiteUrl ? `- URL du site : ${safeSiteUrl}` : ''}

${safeMessage ? `Message :\n${safeMessage}` : ''}

---
Envoyé depuis le formulaire de contact du site JVNR
Date : ${new Date().toLocaleString('fr-FR')}
    `.trim();

    // Configuration de l'email
    // Note: safeName est utilisé pour le nom d'affichage (échappé pour prévenir injection)
    // L'email de réponse utilise l'email validé (pas d'injection possible après isValidEmail)
    const mailOptions = {
      from: `"${safeName.replace(/"/g, '')}" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'contact@jvnr.fr',
      replyTo: email, // Déjà validé par isValidEmail() - pas d'injection CRLF possible
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    // Envoi de l'email
    console.log('📤 [DEBUG] Tentative d\'envoi de l\'email...');
    console.log('📧 [DEBUG] Options d\'email:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html,
      hasText: !!mailOptions.text
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ [DEBUG] Email envoyé avec succès:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      messageId: info.messageId
    });

  } catch (error: unknown) {
    const errorObj = error as Error & {
      code?: string;
      command?: string;
      response?: string;
      responseCode?: number;
      message: string;
      stack?: string;
    };

    console.error('❌ [DEBUG] Erreur lors de l\'envoi de l\'email:', {
      message: errorObj.message,
      code: errorObj.code,
      command: errorObj.command,
      response: errorObj.response,
      responseCode: errorObj.responseCode,
      stack: errorObj.stack
    });
    
    // Gestion spécifique des erreurs Gmail
    let errorMessage = 'Erreur lors de l\'envoi de l\'email';
    
    if (errorObj.code === 'EAUTH') {
      errorMessage = 'Erreur d\'authentification Gmail. Vérifiez que vous utilisez un mot de passe d\'application et que l\'A2F est activée.';
      console.error('🔐 [DEBUG] Erreur d\'authentification - Vérifiez le mot de passe d\'application');
    } else if (errorObj.code === 'ECONNECTION') {
      errorMessage = 'Impossible de se connecter au serveur Gmail. Vérifiez votre connexion internet.';
      console.error('🌐 [DEBUG] Erreur de connexion - Problème réseau ou firewall');
    } else if (errorObj.responseCode === 535) {
      errorMessage = 'Identifiants Gmail invalides. Vérifiez votre email et votre mot de passe d\'application.';
      console.error('🔑 [DEBUG] Identifiants invalides - Code 535');
    } else if (errorObj.code === 'ETIMEDOUT') {
      errorMessage = 'Timeout de connexion. Votre FAI bloque peut-être les connexions SMTP.';
      console.error('⏱️ [DEBUG] Timeout - Possible blocage FAI');
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorObj.message : undefined,
        debugCode: errorObj.code
      },
      { status: 500 }
    );
  }
}
