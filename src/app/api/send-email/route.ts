import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Cache en mémoire pour la limitation d'envoi (en production, utilisez Redis)
const emailLimitCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes en millisecondes
const MAX_EMAILS_PER_WINDOW = 2; // Maximum 2 emails par fenêtre de 15 minutes

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
    console.log('🔍 [DEBUG] Début de la requête d\'envoi d\'email');
    
    const body = await request.json();
    const { name, email, phone, company, message, siteUrl, formType } = body;

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
            subtitle: 'Formule Site One Page (690€ HT)'
          };
        case 'vitrine':
          return {
            subject: 'Nouvelle demande de devis - Site Vitrine',
            subtitle: 'Formule Site Vitrine (1 990€ HT)'
          };
        case 'eshop':
          return {
            subject: 'Nouvelle demande de devis - Site E-shop',
            subtitle: 'Formule Site E-shop (4 000€ HT)'
          };
        case 'custom':
          return {
            subject: 'Nouvelle demande de devis - Site Sur Mesure',
            subtitle: 'Solution personnalisée'
          };
        case 'maintenance':
          return {
            subject: 'Nouvelle demande de devis - Forfait Maintenance',
            subtitle: 'À partir de 99€/mois HT'
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
                <span class="label">Nom :</span> ${name}
              </div>
              <div class="info-row">
                <span class="label">Email :</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">Téléphone :</span> ${phone || 'Non renseigné'}
              </div>
              <div class="info-row">
                <span class="label">Entreprise :</span> ${company || 'Non renseignée'}
              </div>
              ${siteUrl ? `
              <div class="info-row">
                <span class="label">URL du site :</span> ${siteUrl}
              </div>
              ` : ''}
              
              ${message ? `
              <div class="message-box">
                <h4>Message :</h4>
                <p>${message.replace(/\n/g, '<br>')}</p>
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
- Nom : ${name}
- Email : ${email}
- Téléphone : ${phone || 'Non renseigné'}
- Entreprise : ${company || 'Non renseignée'}
${siteUrl ? `- URL du site : ${siteUrl}` : ''}

${message ? `Message :\n${message}` : ''}

---
Envoyé depuis le formulaire de contact du site JVNR
Date : ${new Date().toLocaleString('fr-FR')}
    `.trim();

    // Configuration de l'email
    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'contact@jvnr.fr',
      replyTo: email,
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