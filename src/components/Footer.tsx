const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="bg-black dark:bg-white text-white dark:text-black py-16"
      role="contentinfo"
      aria-label="Informations du site"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            © {currentYear} <strong>JVNR</strong> - Créateur de solutions digitales. Tous droits réservés.
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400 dark:text-gray-600">
            <span>Fait avec ❤️ en <strong>France</strong></span>
            <span aria-hidden="true">•</span>
            <span><strong>Next.js</strong> & <strong>Tailwind CSS</strong></span>
          </div>
        </div>
        
        {/* Informations supplémentaires pour le SEO */}
        <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-200 text-center">
          <p className="text-gray-300 dark:text-gray-700 text-xs">
            Développeur web freelance spécialisé en <strong>SEO</strong>, <strong>performance web</strong> et <strong>accessibilité</strong>.
            Services de création de sites sur mesure pour entreprises et startups en France.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;