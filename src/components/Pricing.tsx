'use client';

import { useState } from 'react';
import { Check, FileText, Globe, ShoppingCart, Code, Wrench } from 'lucide-react';
import ContactForm from './ContactForm';
import pricingData from '../data/pricing.json';

const Pricing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'onepage' | 'vitrine' | 'eshop' | 'custom' | 'maintenance' | 'general'>('general');

  const openForm = (type: 'onepage' | 'vitrine' | 'eshop' | 'custom' | 'maintenance' | 'general') => {
    setFormType(type);
    setIsFormOpen(true);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'onepage':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'vitrine':
        return <Globe className="w-8 h-8 text-green-600" />;
      case 'eshop':
        return <ShoppingCart className="w-8 h-8 text-purple-600" />;
      case 'custom':
        return <Code className="w-8 h-8 text-orange-600" />;
      default:
        return <FileText className="w-8 h-8 text-blue-600" />;
    }
  };

  const { plans, maintenance } = pricingData;

  return (
    <section
      id="pricing"
      className="py-20 bg-white dark:bg-gray-900"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2
            id="pricing-title"
            className="text-4xl md:text-5xl font-bold mb-6 gradient-h2"
          >
            Nos Tarifs
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Des solutions adaptées à tous les budgets, avec un accompagnement personnalisé
          </p>
        </header>

        {/* Plans principaux (sans Site Sur Mesure) */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {plans.filter(plan => plan.type !== 'custom').map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 flex flex-col ${
                plan.popular
                  ? 'border-black dark:border-white shadow-2xl transform scale-105'
                  : 'border-gray-200 dark:border-gray-700 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  {getPlanIcon(plan.type)}
                  <h3 className="text-2xl font-bold text-black dark:text-white ml-3">{plan.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-black dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow" role="list">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white dark:text-black" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openForm(plan.type as 'onepage' | 'vitrine' | 'eshop' | 'custom')}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${plan.buttonStyle}`}
                aria-label={`${plan.buttonText} - ${plan.name}`}
                type="button"
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Site Sur Mesure et Forfait Maintenance sur la même ligne */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Site Sur Mesure */}
          {(() => {
            const customPlan = plans.find(plan => plan.type === 'custom');
            return customPlan ? (
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-8 flex flex-col">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-2">
                    {getPlanIcon(customPlan.type)}
                    <h3 className="text-2xl font-bold text-black dark:text-white ml-3">{customPlan.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{customPlan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-black dark:text-white">{customPlan.price}</span>
                    {customPlan.period && <span className="text-gray-600 dark:text-gray-400 ml-2">{customPlan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow" role="list">
                  {customPlan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-white dark:text-black" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openForm('custom')}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${customPlan.buttonStyle}`}
                  aria-label={`${customPlan.buttonText} - ${customPlan.name}`}
                  type="button"
                >
                  {customPlan.buttonText}
                </button>
              </div>
            ) : null;
          })()}

          {/* Forfait Maintenance */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-black dark:text-white ml-3">
                  {maintenance.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {maintenance.description}
              </p>
              <div className="mb-2">
                <span className="text-3xl font-black text-black dark:text-white">{maintenance.price}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">{maintenance.period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {maintenance.note}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow" role="list">
              {maintenance.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-3 h-3 text-white dark:text-black" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <button
                onClick={() => openForm('maintenance')}
                className="w-full bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
                type="button"
              >
                {maintenance.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            <strong>Tous nos tarifs sont transparents</strong> et incluent un accompagnement personnalisé.
            Chaque projet est unique, n&apos;hésitez pas à nous contacter pour discuter de vos besoins spécifiques.
          </p>
        </div>
      </div>

      {/* Formulaire de contact */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formType={formType}
      />
    </section>
  );
};

export default Pricing;