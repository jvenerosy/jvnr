'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface ReCaptchaV3Props {
  onVerify: (token: string | null) => void;
  className?: string;
  action?: string;
}

export interface ReCaptchaV3Ref {
  execute: () => Promise<string | null>;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const ReCaptchaV3 = forwardRef<ReCaptchaV3Ref, ReCaptchaV3Props>(
  ({ onVerify, className = '', action = 'submit' }, ref) => {
    const scriptLoaded = useRef(false);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useImperativeHandle(ref, () => ({
      execute: async () => {
        if (!siteKey || !window.grecaptcha) {
          return null;
        }

        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          onVerify(token);
          return token;
        } catch (error) {
          console.error('Erreur lors de l\'exécution du reCAPTCHA v3:', error);
          onVerify(null);
          return null;
        }
      }
    }));

    useEffect(() => {
      if (!siteKey) {
        console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY manquante');
        return;
      }

      if (scriptLoaded.current) {
        return;
      }

      // Charger le script reCAPTCHA v3
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
        
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            console.log('reCAPTCHA v3 prêt');
          });
        }
      };

      script.onerror = () => {
        console.error('Erreur lors du chargement du script reCAPTCHA v3');
      };

      document.head.appendChild(script);

      return () => {
        // Nettoyer le script si le composant est démonté
        const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }, [siteKey]);

    if (!siteKey) {
      return (
        <div className={`recaptcha-container ${className}`}>
          <div className="p-4 border border-orange-300 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <p className="text-orange-700 dark:text-orange-300 text-sm">
              ⚠️ Configuration reCAPTCHA manquante
            </p>
            <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">
              Veuillez configurer NEXT_PUBLIC_RECAPTCHA_SITE_KEY dans vos variables d'environnement.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`recaptcha-container ${className}`}>
        <div className="flex items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Protégé par reCAPTCHA v3
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vérification automatique en arrière-plan
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Ce site est protégé par reCAPTCHA et les{' '}
          <a 
            href="https://policies.google.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Règles de confidentialité
          </a>
          {' '}et{' '}
          <a 
            href="https://policies.google.com/terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Conditions d'utilisation
          </a>
          {' '}de Google s'appliquent.
        </p>
      </div>
    );
  }
);

ReCaptchaV3.displayName = 'ReCaptchaV3';

export default ReCaptchaV3;