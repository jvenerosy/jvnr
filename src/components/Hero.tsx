'use client';

import { ChevronsDown } from 'lucide-react';

const Hero = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-white"
      role="banner"
      aria-labelledby="hero-title"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Logo principal */}
        <h1
          id="hero-title"
          className="text-8xl md:text-9xl font-black tracking-tight mb-8 gradient-h1"
        >
          JVNR
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl font-medium text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
          <strong>Créateur de solutions digitales</strong>
        </p>
        
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Plus de <strong>15 ans d&apos;expérience</strong> dans la création de sites performants,
          optimisés pour le <strong>SEO</strong> et l&apos;<strong>accessibilité</strong>
        </p>

        {/* CTA */}
        <nav className="flex flex-col sm:flex-row gap-4 justify-center items-center" aria-label="Actions principales">
          <button
            onClick={scrollToPricing}
            className="bg-black text-white border-2 border-transparent px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="Voir nos offres et tarifs"
            type="button"
          >
            Voir nos offres
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById('about');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-black border-2 border-black px-8 py-4 text-lg font-medium hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="En savoir plus sur mes compétences et mon expérience"
            type="button"
          >
            En savoir plus
          </button>
        </nav>

        {/* Indicateur de scroll */}
        <div
          className="absolute bottom-8 left-1/2 animate-bounce-centered"
          aria-hidden="true"
        >
          <ChevronsDown className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    </section>
  );
};

export default Hero;