'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import pricingData from '../data/pricing.json';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'vitrine' | 'eshop' | 'custom' | 'maintenance' | 'general';
}

const ContactForm = ({ isOpen, onClose, formType }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    siteUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const getFormConfig = () => {
    const vitrinePlan = pricingData.plans.find(plan => plan.type === 'vitrine');
    const eshopPlan = pricingData.plans.find(plan => plan.type === 'eshop');
    const customPlan = pricingData.plans.find(plan => plan.type === 'custom');
    const maintenance = pricingData.maintenance;

    switch (formType) {
      case 'vitrine':
        return {
          title: `Demande de devis - ${vitrinePlan?.name}`,
          subtitle: `Formule ${vitrinePlan?.name} (${vitrinePlan?.price} ${vitrinePlan?.period})`,
          defaultMessage: `Bonjour,\n\nNous sommes intéressés par votre formule ${vitrinePlan?.name} à ${vitrinePlan?.price} ${vitrinePlan?.period}. Cette offre correspond parfaitement à nos besoins pour créer une présence en ligne professionnelle.\n\nPourriez-vous nous contacter pour discuter de notre projet et planifier un rendez-vous ?\n\nMerci d'avance pour votre retour.`
        };
      case 'eshop':
        return {
          title: `Demande de devis - ${eshopPlan?.name}`,
          subtitle: `Formule ${eshopPlan?.name} (${eshopPlan?.price} ${eshopPlan?.period})`,
          defaultMessage: `Bonjour,\n\nNous souhaitons développer une boutique en ligne et votre formule ${eshopPlan?.name} à ${eshopPlan?.price} ${eshopPlan?.period} nous intéresse vivement.\n\nNous aimerions discuter avec vous de notre projet e-commerce, des fonctionnalités nécessaires et des délais de réalisation.\n\nPouvez-vous nous recontacter pour organiser un échange ?\n\nCordialement.`
        };
      case 'custom':
        return {
          title: `Demande de devis - ${customPlan?.name}`,
          subtitle: 'Solution personnalisée',
          defaultMessage: `Bonjour,\n\nNous avons un projet de site web spécifique qui nécessite une solution sur mesure. Voici une première description de nos besoins :\n\n[Décrivez votre projet, vos objectifs, fonctionnalités souhaitées, public cible, etc.]\n\nNous aimerions échanger avec vous pour étudier la faisabilité et obtenir un devis personnalisé.\n\nMerci pour votre expertise.`
        };
      case 'maintenance':
        return {
          title: `Demande de devis - ${maintenance.name}`,
          subtitle: `${maintenance.price} ${maintenance.period}`,
          defaultMessage: `Bonjour,\n\nNous possédons déjà un site web et nous recherchons un partenaire fiable pour assurer sa maintenance technique.\n\nVotre ${maintenance.name} à ${maintenance.price} ${maintenance.period} nous intéresse. Nous aimerions connaître les détails des prestations incluses et obtenir un devis adapté à notre site.\n\nPouvez-vous nous recontacter pour en discuter ?\n\nMerci d'avance.`
        };
      default:
        return {
          title: 'Contact',
          subtitle: 'Parlons de votre projet',
          defaultMessage: `Bonjour,\n\nNous souhaiterions échanger avec vous concernant un projet web. Votre expertise et vos réalisations nous intéressent.\n\nPourriez-vous nous recontacter pour que nous puissions discuter de nos besoins ?\n\nMerci pour votre temps.`
        };
    }
  };

  const config = getFormConfig();

  // Initialiser et mettre à jour le message par défaut selon le type de formulaire
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      message: config.defaultMessage
    }));
  }, [config.defaultMessage, formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Envoi via l'API
      const response = await fetch('/api/send-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message || config.defaultMessage,
          siteUrl: formData.siteUrl,
          formType: formType
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            message: '',
            siteUrl: ''
          });
        }, 2000);
      } else if (response.status === 429 && result.rateLimited) {
        // Limitation de débit détectée
        setSubmitStatus('rate-limited');
        setErrorMessage(result.error);
        setRemainingTime(result.remainingTime || 0);
        
        // Décompte automatique
        if (result.remainingTime) {
          const interval = setInterval(() => {
            setRemainingTime(prev => {
              if (prev <= 1000) {
                clearInterval(interval);
                setSubmitStatus('idle');
                setErrorMessage('');
                return 0;
              }
              return prev - 1000;
            });
          }, 1000);
        }
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error: unknown) {
      const errorObj = error as Error;
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
      setErrorMessage(errorObj.message || 'Une erreur est survenue lors de l\'envoi de votre message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-black">{config.title}</h3>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fermer le formulaire"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            {/* Champs spécifiques selon le type */}
            {formType === 'maintenance' && (
              <div>
                <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL de votre site actuel
                </label>
                <input
                  type="url"
                  id="siteUrl"
                  name="siteUrl"
                  value={formData.siteUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://votre-site.com"
                />
              </div>
            )}


            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600">
                * Champs obligatoires
              </p>
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success' || submitStatus === 'rate-limited'}
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : submitStatus === 'success' ? (
                  'Message envoyé !'
                ) : submitStatus === 'rate-limited' ? (
                  `Veuillez patienter ${Math.ceil(remainingTime / (60 * 1000))} min`
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2 flex-shrink-0" />
                    Envoyer le message
                  </>
                )}
              </button>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium mb-2">
                  Erreur lors de l&apos;envoi
                </p>
                <p className="text-red-600 text-sm">
                  {errorMessage || 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer ou nous contacter directement à contact@jvnr.fr'}
                </p>
              </div>
            )}

            {submitStatus === 'rate-limited' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-700 font-medium mb-2">
                  🛡️ Protection anti-spam activée
                </p>
                <p className="text-orange-600 text-sm">
                  {errorMessage}
                </p>
                {remainingTime > 0 && (
                  <p className="text-orange-500 text-xs mt-2">
                    Temps restant : {Math.ceil(remainingTime / (60 * 1000))} minute(s)
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;