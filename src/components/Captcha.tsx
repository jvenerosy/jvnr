'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onValidate: (isValid: boolean, token: string) => void;
  className?: string;
}

const Captcha = ({ onValidate, className = '' }: CaptchaProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [token, setToken] = useState('');

  // Générer une nouvelle question de captcha
  const generateCaptcha = async () => {
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setIsValid(false);
    
    // Générer un token unique pour cette session de captcha
    const newToken = `captcha_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setToken(newToken);
    
    // Enregistrer le token côté serveur
    try {
      await fetch('/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          token: newToken,
          num1: newNum1,
          num2: newNum2
        }),
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du captcha:', error);
    }
    
    onValidate(false, newToken);
  };

  // Initialiser le captcha au montage du composant
  useEffect(() => {
    generateCaptcha();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Vérifier la réponse de l'utilisateur
  const handleAnswerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value;
    setUserAnswer(answer);
    
    if (!answer || isNaN(parseInt(answer, 10))) {
      setIsValid(false);
      onValidate(false, token);
      return;
    }

    // Validation côté serveur
    try {
      const response = await fetch('/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate',
          token: token,
          userAnswer: parseInt(answer, 10)
        }),
      });

      const result = await response.json();
      const valid = result.success && result.valid;
      
      setIsValid(valid);
      onValidate(valid, token);
    } catch (error) {
      console.error('Erreur lors de la validation du captcha:', error);
      setIsValid(false);
      onValidate(false, token);
    }
  };

  return (
    <div className={`captcha-container ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Vérification anti-spam *
      </label>
      
      <div className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
        {/* Question mathématique */}
        <div className="flex items-center space-x-2 text-lg font-mono">
          <span className="text-black dark:text-white">{num1}</span>
          <span className="text-gray-600 dark:text-gray-400">+</span>
          <span className="text-black dark:text-white">{num2}</span>
          <span className="text-gray-600 dark:text-gray-400">=</span>
        </div>
        
        {/* Champ de réponse */}
        <input
          type="number"
          value={userAnswer}
          onChange={handleAnswerChange}
          placeholder="?"
          className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-600 text-black dark:text-white"
          required
        />
        
        {/* Bouton de régénération */}
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          title="Générer une nouvelle question"
        >
          <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        
        {/* Indicateur de validation */}
        <div className="ml-2">
          {userAnswer && (
            <div className={`w-4 h-4 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
          )}
        </div>
      </div>
      
      {/* Message d'aide */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Résolvez cette simple addition pour prouver que vous n'êtes pas un robot
      </p>
    </div>
  );
};

export default Captcha;