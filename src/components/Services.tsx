'use client';

import { Code, Search, Zap, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Développement Web",
      description: "Création de sites web modernes et performants avec les dernières technologies (React, Next.js, TypeScript). Applications web sur mesure adaptées à vos besoins spécifiques.",
      features: [
        "Sites web responsives",
        "Applications React/Next.js",
        "E-commerce personnalisé",
        "Progressive Web Apps"
      ]
    },
    {
      icon: Search,
      title: "Optimisation SEO",
      description: "Amélioration de votre visibilité en ligne grâce à des techniques SEO éprouvées. Audit complet et stratégie personnalisée pour maximiser votre référencement naturel.",
      features: [
        "Audit SEO complet",
        "Optimisation technique",
        "Stratégie de contenu",
        "Suivi des performances"
      ]
    },
    {
      icon: Zap,
      title: "Performance Web",
      description: "Optimisation de la vitesse et des performances de vos sites web. Amélioration de l'expérience utilisateur et du taux de conversion grâce à des temps de chargement optimaux.",
      features: [
        "Audit de performance",
        "Optimisation des images",
        "Mise en cache avancée",
        "Core Web Vitals"
      ]
    },
    {
      icon: Users,
      title: "Accessibilité",
      description: "Création de sites web accessibles à tous, conformes aux standards WCAG. Garantie d'une expérience utilisateur inclusive pour tous vos visiteurs.",
      features: [
        "Audit d'accessibilité",
        "Conformité WCAG 2.1",
        "Tests utilisateurs",
        "Formation équipes"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-h2">
            Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Des solutions complètes pour votre présence en ligne, 
            de la conception au déploiement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4 group-hover:bg-gray-800 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-black font-medium hover:opacity-70 transition-opacity inline-flex items-center"
                    aria-label={`Discuter du service ${service.title}`}
                  >
                    En savoir plus
                    <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-black text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Prêt à démarrer votre projet ?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Discutons de vos besoins et créons ensemble une solution 
              qui dépasse vos attentes.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Aller à la section contact"
            >
              Contactez-moi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;