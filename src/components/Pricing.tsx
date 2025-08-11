'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import ContactForm from './ContactForm';
import pricingData from '../data/pricing.json';

const Pricing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'vitrine' | 'eshop' | 'custom' | 'maintenance' | 'general'>('general');

  const openForm = (type: 'vitrine' | 'eshop' | 'custom' | 'maintenance' | 'general') => {
    setFormType(type);
    setIsFormOpen(true);
  };

  const { plans, maintenance } = pricingData;

  return (
    <section
      id="pricing"
      className="py-20 bg-white"
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Des solutions adaptées à tous les budgets, avec un accompagnement personnalisé
          </p>
        </header>

        {/* Plans principaux */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.popular 
                  ? 'border-black shadow-2xl transform scale-105' 
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8" role="list">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openForm(plan.type as 'vitrine' | 'eshop' | 'custom')}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${plan.buttonStyle}`}
                aria-label={`${plan.buttonText} - ${plan.name}`}
                type="button"
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Forfait maintenance */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-black mb-4">
                {maintenance.name}
              </h3>
              <p className="text-xl text-gray-600">
                {maintenance.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-black">{maintenance.price}</span>
                  <span className="text-gray-600 ml-2">{maintenance.period}</span>
                </div>

                <ul className="space-y-3" role="list">
                  {maintenance.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={() => openForm('maintenance')}
                  className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                  type="button"
                >
                  {maintenance.buttonText}
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  {maintenance.note}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
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