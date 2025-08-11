'use client';

import { useState } from 'react';
import { Mail, Linkedin, MessageCircle, Calculator, Users, ArrowRight } from 'lucide-react';
import ContactForm from './ContactForm';

const Contact = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
  };
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-h2">
            Contact
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Prêt à donner vie à votre projet ?
            Contactez-nous pour discuter de vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">
                Parlons de votre projet
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Que vous ayez besoin d&apos;un nouveau site web, d&apos;une optimisation SEO,
                ou d&apos;améliorer les performances de votre site existant,
                nous sommes là pour vous accompagner.
              </p>
              <p className="text-gray-600">
                Réponse garantie sous 24h
              </p>
            </div>

            {/* Méthodes de contact */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">Email</h4>
                  <a
                    href="mailto:contact@jvnr.fr"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Envoyer un email à contact@jvnr.fr"
                  >
                    contact@jvnr.fr
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">LinkedIn</h4>
                  <a
                    href="https://www.linkedin.com/in/julien-venerosy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Voir le profil LinkedIn de JVNR"
                  >
                    linkedin.com/in/julien-venerosy/
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">
              Démarrons votre projet
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chaque projet est unique. Parlons de vos objectifs, 
              de votre audience et de vos contraintes pour créer 
              une solution parfaitement adaptée.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                Consultation gratuite
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calculator className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                Devis personnalisé
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Accompagnement complet
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={openForm}
                className="w-full bg-black text-white py-4 px-6 text-center font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 flex items-center justify-center"
                aria-label="Ouvrir le formulaire de contact"
                type="button"
              >
                Envoyer un message
                <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formType="general"
      />
    </section>
  );
};

export default Contact;