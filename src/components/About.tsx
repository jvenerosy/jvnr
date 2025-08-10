import { Code, Search, Zap, Users } from 'lucide-react';

const About = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gray-50"
      aria-labelledby="about-title"
    >
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2
            id="about-title"
            className="text-4xl md:text-5xl font-bold mb-6 gradient-h2"
          >
            À propos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Passionné par le <strong>développement</strong> depuis plus de <strong>15 ans</strong>,
            je crée des expériences numériques exceptionnelles
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <article className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-4">
              Une expertise forgée par l&apos;expérience
            </h3>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Avec plus de <strong>15 ans d&apos;expérience</strong>, je crée des sites performants,
              optimisés pour le <strong>référencement</strong> et <strong>accessibles</strong> à tous. Mon approche allie précision
              technique et vision stratégique pour offrir des solutions sur mesure à fort impact.
            </p>
            <div className="pt-4">
              <h4 className="text-lg font-semibold text-black mb-3">
                Mes domaines d&apos;expertise :
              </h4>
              <ul className="space-y-3 text-gray-700" role="list">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 flex-shrink-0" aria-hidden="true">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <strong>Développement moderne</strong> (React, Next.js, TypeScript...)
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 flex-shrink-0" aria-hidden="true">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <strong>Optimisation SEO</strong> et performance web
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 flex-shrink-0" aria-hidden="true">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <strong>Accessibilité</strong> et expérience utilisateur
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 flex-shrink-0" aria-hidden="true">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <strong>Architecture</strong> et scalabilité des applications
                </li>
              </ul>
            </div>
          </article>

          {/* Statistiques */}
          <aside aria-labelledby="stats-title">
            <h3 id="stats-title" className="sr-only">Statistiques et chiffres clés</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-3xl font-black text-black mb-2" aria-label="15 années d'expérience">15+</div>
                <div className="text-sm font-medium text-gray-600">Années d&apos;expérience</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-3xl font-black text-black mb-2" aria-label="Plus de 100 projets réalisés">100+</div>
                <div className="text-sm font-medium text-gray-600">Projets réalisés</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-3xl font-black text-black mb-2" aria-label="Expert SEO certifié">SEO</div>
                <div className="text-sm font-medium text-gray-600">Expert certifié</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-3xl font-black text-black mb-2" aria-label="Spécialiste accessibilité web">A11Y</div>
                <div className="text-sm font-medium text-gray-600">Accessibilité</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;