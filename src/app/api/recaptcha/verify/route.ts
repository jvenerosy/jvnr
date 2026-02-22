import { NextRequest, NextResponse } from 'next/server';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token reCAPTCHA manquant' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('[reCAPTCHA] Clé secrète manquante');
      return NextResponse.json(
        { error: 'Configuration reCAPTCHA manquante côté serveur' },
        { status: 500 }
      );
    }

    // Vérifier le token auprès de Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: getClientIP(request),
      }),
    });

    const verifyData: RecaptchaResponse = await verifyResponse.json();

    if (!verifyData.success) {
      console.error('[reCAPTCHA] Échec de la vérification:', verifyData['error-codes']);
      return NextResponse.json(
        {
          error: 'Échec de la vérification reCAPTCHA',
          valid: false,
          details: verifyData['error-codes']
        },
        { status: 400 }
      );
    }

    // Pour reCAPTCHA v3, vérifier le score (optionnel)
    const minScore = 0.5; // Score minimum acceptable (0.0 = bot, 1.0 = humain)
    if (verifyData.score !== undefined && verifyData.score < minScore) {
      return NextResponse.json(
        {
          error: 'Score reCAPTCHA insuffisant',
          valid: false,
          score: verifyData.score
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      score: verifyData.score,
      action: verifyData.action
    });

  } catch (error) {
    console.error('[reCAPTCHA] Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de la vérification reCAPTCHA' },
      { status: 500 }
    );
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
