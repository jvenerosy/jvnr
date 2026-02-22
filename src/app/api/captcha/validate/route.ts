import { NextRequest, NextResponse } from 'next/server';

// Cache pour les tokens de captcha valides (expire après 10 minutes)
const captchaTokenCache = new Map<string, { timestamp: number; answer: number; used: boolean }>();
const CAPTCHA_TOKEN_EXPIRY = 10 * 60 * 1000; // 10 minutes en millisecondes

// Fonction pour nettoyer les tokens expirés
function cleanupCaptchaTokens() {
  const now = Date.now();
  for (const [token, data] of captchaTokenCache.entries()) {
    if (now - data.timestamp > CAPTCHA_TOKEN_EXPIRY) {
      captchaTokenCache.delete(token);
    }
  }
}

// Fonction pour enregistrer un token de captcha avec sa réponse
function registerCaptchaToken(token: string, num1: number, num2: number): void {
  cleanupCaptchaTokens();
  captchaTokenCache.set(token, {
    timestamp: Date.now(),
    answer: num1 + num2,
    used: false
  });
}

// Fonction pour valider le token de captcha avec la réponse
function validateCaptchaToken(token: string, userAnswer: number): boolean {
  if (!token || !token.startsWith('captcha_')) {
    return false;
  }

  const tokenData = captchaTokenCache.get(token);
  if (!tokenData) {
    return false;
  }

  const now = Date.now();
  
  // Vérifier si le token a expiré
  if (now - tokenData.timestamp > CAPTCHA_TOKEN_EXPIRY) {
    captchaTokenCache.delete(token);
    return false;
  }

  // Vérifier si le token a déjà été utilisé
  if (tokenData.used) {
    return false;
  }

  // Vérifier si la réponse est correcte
  if (userAnswer !== tokenData.answer) {
    return false;
  }

  // Marquer le token comme utilisé
  tokenData.used = true;
  return true;
}

// Endpoint pour enregistrer un nouveau captcha
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, token, num1, num2, userAnswer } = body;

    if (action === 'register') {
      // Enregistrer un nouveau token de captcha
      if (!token || !num1 || !num2) {
        return NextResponse.json(
          { error: 'Paramètres manquants pour l\'enregistrement du captcha' },
          { status: 400 }
        );
      }

      registerCaptchaToken(token, num1, num2);
      
      return NextResponse.json({
        success: true,
        message: 'Token de captcha enregistré'
      });
    }

    if (action === 'validate') {
      // Valider un token de captcha
      if (!token || userAnswer === undefined) {
        return NextResponse.json(
          { error: 'Paramètres manquants pour la validation du captcha' },
          { status: 400 }
        );
      }

      const isValid = validateCaptchaToken(token, parseInt(userAnswer, 10));
      
      return NextResponse.json({
        success: true,
        valid: isValid
      });
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erreur lors de la validation du captcha:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}