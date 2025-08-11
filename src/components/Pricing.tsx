import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Site Vitrine",
      price: "1 200€",
      period: "HT",
      description: "Parfait pour présenter votre activité",
      features: [
        "Design responsive moderne",
        "5 à 8 pages optimisées",
        "Optimisation SEO de base",
        "Formulaire de contact",
        "Hébergement 1 an inclus",
        "Formation à la gestion",
        "Support 3 mois"
      ],
      popular: false,
      buttonText: "Choisir cette formule",
      buttonStyle: "bg-white text-black border-2 border-black hover:bg-gray-100"
    },
    {
      name: "Site E-shop",
      price: "4 000€",
      period: "HT",
      description: "Solution complète pour vendre en ligne",
      features: [
        "Boutique en ligne complète",
        "Gestion des produits illimitée",
        "Système de paiement sécurisé",
        "Gestion des stocks",
        "Tableau de bord admin",
        "Optimisation SEO avancée",
        "Formation complète",
        "Support 6 mois"
      ],
      popular: true,
      buttonText: "Choisir cette formule",
      buttonStyle: "bg-black text-white hover:bg-gray-800"
    },
    {
      name: "Site Sur Mesure",
      price: "Sur devis",
      period: "",
      description: "Solution personnalisée selon vos besoins",
      features: [
        "Développement 100% personnalisé",
        "Fonctionnalités spécifiques",
        "Intégrations sur mesure",
        "Architecture scalable",
        "Performance optimisée",
        "Support technique dédié",
        "Formation personnalisée",
        "Maintenance incluse"
      ],
      popular: false,
      buttonText: "Demander un devis",
      buttonStyle: "bg-white text-black border-2 border-black hover:bg-gray-100"
    }
  ];

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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                  <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
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

              <a
                href={
                  plan.name === "Site Vitrine"
                    ? "mailto:contact@jvnr.fr?subject=Demande de devis - Site Vitrine (1200€ HT)&body=Bonjour,%0D%0A%0D%0AJe suis intéressé(e) par votre formule Site Vitrine à 1200€ HT.%0D%0A%0D%0APouvez-vous me contacter pour discuter de mon projet ?%0D%0A%0D%0AMerci,%0D%0A"
                    : plan.name === "Site E-shop"
                    ? "mailto:contact@jvnr.fr?subject=Demande de devis - Site E-shop (4000€ HT)&body=Bonjour,%0D%0A%0D%0AJe suis intéressé(e) par votre formule Site E-shop à 4000€ HT.%0D%0A%0D%0APouvez-vous me contacter pour discuter de mon projet e-commerce ?%0D%0A%0D%0AMerci,%0D%0A"
                    : "mailto:contact@jvnr.fr?subject=Demande de devis - Site Sur Mesure&body=Bonjour,%0D%0A%0D%0AJe souhaiterais obtenir un devis pour un site sur mesure.%0D%0A%0D%0ADescription de mon projet :%0D%0A[Décrivez votre projet ici]%0D%0A%0D%0APouvez-vous me contacter pour en discuter ?%0D%0A%0D%0AMerci,%0D%0A"
                }
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${plan.buttonStyle} block text-center`}
                aria-label={`${plan.buttonText} - ${plan.name}`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Forfait maintenance */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-black mb-4">
                Forfait Maintenance
              </h3>
              <p className="text-xl text-gray-600">
                Gardez votre site performant et sécurisé
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-black">À partir de 99€</span>
                  <span className="text-gray-600 ml-2">/mois HT</span>
                </div>

                <ul className="space-y-3" role="list">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">Mises à jour de sécurité</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">Sauvegardes automatiques</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">Monitoring de performance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">Support technique prioritaire</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">Modifications mineures incluses</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <a
                  href="mailto:contact@jvnr.fr?subject=Demande de devis - Forfait Maintenance (à partir de 99€/mois)&body=Bonjour,%0D%0A%0D%0AJe suis intéressé(e) par votre forfait maintenance à partir de 99€/mois HT.%0D%0A%0D%0AInformations sur mon site :%0D%0A- URL du site : %0D%0A- Plateforme utilisée : %0D%0A- Besoins spécifiques : %0D%0A%0D%0APouvez-vous me contacter pour établir un devis personnalisé ?%0D%0A%0D%0AMerci,%0D%0A"
                  className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 inline-block"
                >
                  Demander un devis maintenance
                </a>
                <p className="text-sm text-gray-600 mt-4">
                  Tarif adapté selon la complexité de votre site
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
    </section>
  );
};

export default Pricing;