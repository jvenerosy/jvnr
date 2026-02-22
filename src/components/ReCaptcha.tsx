'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  className?: string;
}

export interface ReCaptchaRef {
  reset: () => void;
  execute: () => void;
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ onVerify, className = '' }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
      },
      execute: () => {
        recaptchaRef.current?.execute();
      }
    }));

    const handleChange = (token: string | null) => {
      onVerify(token);
    };

    const handleExpired = () => {
      onVerify(null);
    };

    const handleError = () => {
      onVerify(null);
    };

    // Vérifier que la clé publique reCAPTCHA est configurée
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vérification anti-spam *
        </label>
        
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={handleChange}
            onExpired={handleExpired}
            onError={handleError}
            theme="light" // Vous pouvez changer en "dark" si nécessaire
            size="normal"
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Protégé par reCAPTCHA - 
          <a 
            href="https://policies.google.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            Confidentialité
          </a>
          {' '}-{' '}
          <a 
            href="https://policies.google.com/terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Conditions
          </a>
        </p>
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;