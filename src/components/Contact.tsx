'use client';

import { Mail, Linkedin, CheckCircle, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-h2">
            Contact
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Prêt à donner vie à votre projet ? 
            Contactez-moi pour discuter de vos besoins
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
                je suis là pour vous accompagner.
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
                    href="mailto:contact@jvnr.com"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Envoyer un email à contact@jvnr.com"
                  >
                    contact@jvnr.com
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
                    href="https://linkedin.com/in/jvnr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Voir le profil LinkedIn de JVNR"
                  >
                    linkedin.com/in/jvnr
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
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Consultation gratuite
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Devis personnalisé
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Accompagnement complet
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="mailto:contact@jvnr.com?subject=Demande de projet&body=Bonjour,%0D%0A%0D%0AJe souhaiterais discuter d'un projet avec vous.%0D%0A%0D%0ACordialement"
                className="w-full bg-black text-white py-4 px-6 text-center font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 inline-flex items-center justify-center"
                aria-label="Envoyer un email pour démarrer un projet"
              >
                <span className="text-white">Envoyer un message</span>
                <ArrowRight className="w-4 h-4 ml-2 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;