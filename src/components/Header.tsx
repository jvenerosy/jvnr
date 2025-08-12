'use client';

import { useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const activeSection = useActiveSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItemClasses = (sectionId: string) => {
    const baseClasses = "text-sm font-medium transition-all duration-200 relative";
    const activeClasses = "text-blue-600";
    const inactiveClasses = "hover:opacity-70 hover:text-blue-500";
    
    return activeSection === sectionId
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const getMobileNavItemClasses = (sectionId: string) => {
    const baseClasses = "block w-full text-left px-6 py-4 text-lg font-medium transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0";
    const activeClasses = "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
    const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800";
    
    return activeSection === sectionId
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Fermer le menu mobile après navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
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
          </button>

          {/* Navigation Desktop */}
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
              </button>
            </li>
          </ul>

          {/* Theme Toggle et Burger Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Burger Menu Button */}
            <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 group"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              <span
                className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'opacity-100 visible transform translate-y-0'
              : 'opacity-0 invisible transform -translate-y-4'
          }`}
        >
          <nav role="navigation" aria-label="Menu mobile">
            <button
              onClick={() => scrollToSection('about')}
              className={getMobileNavItemClasses('about')}
              role="menuitem"
              aria-label="Aller à la section À propos"
              type="button"
            >
              À propos
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={getMobileNavItemClasses('services')}
              role="menuitem"
              aria-label="Aller à la section Services"
              type="button"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className={getMobileNavItemClasses('pricing')}
              role="menuitem"
              aria-label="Aller à la section Tarifs"
              type="button"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={getMobileNavItemClasses('contact')}
              role="menuitem"
              aria-label="Aller à la section Contact"
              type="button"
            >
              Contact
            </button>
          </nav>
        </div>
      </nav>
    </header>
  );
};

export default Header;