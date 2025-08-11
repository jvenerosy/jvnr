'use client';

import { useActiveSection } from '@/hooks/useActiveSection';

const Header = () => {
  const activeSection = useActiveSection();

  const getNavItemClasses = (sectionId: string) => {
    const baseClasses = "text-sm font-medium transition-all duration-200 relative";
    const activeClasses = "text-blue-600";
    const inactiveClasses = "hover:opacity-70 hover:text-blue-500";
    
    return activeSection === sectionId
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const getActiveIndicator = (sectionId: string) => {
    return activeSection === sectionId ? (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
    ) : null;
  };
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-200"
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-6 py-4"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className={`text-2xl font-black tracking-tight transition-all duration-200 gradient-h1 relative ${
              activeSection === 'hero'
                ? ''
                : 'hover:opacity-70'
            }`}
            aria-label="JVNR - Retour à l'accueil"
            type="button"
          >
            JVNR
            {getActiveIndicator('hero')}
          </button>

          {/* Navigation */}
          <ul className="hidden md:flex items-center space-x-8" role="menubar">
            <li role="none">
              <button
                onClick={() => scrollToSection('about')}
                className={getNavItemClasses('about')}
                role="menuitem"
                aria-label="Aller à la section À propos"
                type="button"
              >
                À propos
                {getActiveIndicator('about')}
              </button>
            </li>
            <li role="none">
              <button
                onClick={() => scrollToSection('services')}
                className={getNavItemClasses('services')}
                role="menuitem"
                aria-label="Aller à la section Services"
                type="button"
              >
                Services
                {getActiveIndicator('services')}
              </button>
            </li>
            <li role="none">
              <button
                onClick={() => scrollToSection('pricing')}
                className={getNavItemClasses('pricing')}
                role="menuitem"
                aria-label="Aller à la section Tarifs"
                type="button"
              >
                Tarifs
                {getActiveIndicator('pricing')}
              </button>
            </li>
            <li role="none">
              <button
                onClick={() => scrollToSection('contact')}
                className={getNavItemClasses('contact')}
                role="menuitem"
                aria-label="Aller à la section Contact"
                type="button"
              >
                Contact
                {getActiveIndicator('contact')}
              </button>
            </li>
          </ul>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              className="text-sm font-medium"
              onClick={() => scrollToSection('contact')}
              aria-label="Aller au contact (menu mobile)"
              type="button"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;