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
    const body = await request.json();
    const { name, email, phone, company, message, siteUrl, formType, recaptchaToken } = body;

    // Validation des champs requis
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis' },
        { status: 400 }
      );
    }

    // Validation stricte de l'email (protection contre injection d'en-têtes)
    if (!isValidEmail(email)) {
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

    // La validation reCAPTCHA est faite côté frontend via /api/recaptcha/verify
    // On vérifie juste que le token était présent (preuve que le frontend a fait la validation)
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Token reCAPTCHA manquant. Veuillez compléter la vérification.' },
        { status: 400 }
      );
    }

    // Protection anti-spam : limitation par IP et par email
    const clientIP = getClientIP(request);
    const ipIdentifier = `ip:${clientIP}`;
    const emailIdentifier = `email:${email.toLowerCase()}`;

    // Vérifier la limitation par IP
    const ipLimit = checkRateLimit(ipIdentifier);
    if (!ipLimit.allowed) {
      const remainingMinutes = Math.ceil((ipLimit.remainingTime || 0) / (60 * 1000));
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
      return NextResponse.json(
        {
          error: `Trop de messages envoyés avec cette adresse email. Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`,
          rateLimited: true,
          remainingTime: emailLimit.remainingTime
        },
        { status: 429 }
      );
    }

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

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('[Email] Variables d\'environnement manquantes');
      return NextResponse.json(
        { error: 'Configuration email manquante. Vérifiez les variables d\'environnement.' },
        { status: 500 }
      );
    }

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
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

    // Version texte de l'email
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
    const mailOptions = {
      from: `"${safeName.replace(/"/g, '')}" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'contact@jvnr.fr',
      replyTo: email,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

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
    };

    console.error('[Email] Erreur lors de l\'envoi:', errorObj.message, errorObj.code);

    // Gestion spécifique des erreurs Gmail
    let errorMessage = 'Erreur lors de l\'envoi de l\'email';

    if (errorObj.code === 'EAUTH') {
      errorMessage = 'Erreur d\'authentification Gmail. Vérifiez que vous utilisez un mot de passe d\'application et que l\'A2F est activée.';
    } else if (errorObj.code === 'ECONNECTION') {
      errorMessage = 'Impossible de se connecter au serveur Gmail. Vérifiez votre connexion internet.';
    } else if (errorObj.responseCode === 535) {
      errorMessage = 'Identifiants Gmail invalides. Vérifiez votre email et votre mot de passe d\'application.';
    } else if (errorObj.code === 'ETIMEDOUT') {
      errorMessage = 'Timeout de connexion. Votre FAI bloque peut-être les connexions SMTP.';
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
