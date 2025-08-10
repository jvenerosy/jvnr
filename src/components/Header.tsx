'use client';

import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-lg border-b border-gray-200'
          : 'bg-transparent'
      }`}
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
            className="text-2xl font-black tracking-tight hover:opacity-70 transition-opacity gradient-h1"
            aria-label="JVNR - Retour à l'accueil"
            type="button"
          >
            JVNR
          </button>

          {/* Navigation */}
          <ul className="hidden md:flex items-center space-x-8" role="menubar">
            <li role="none">
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
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
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                role="menuitem"
                aria-label="Aller à la section Services"
                type="button"
              >
                Services
              </button>
            </li>
            <li role="none">
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                role="menuitem"
                aria-label="Aller à la section Contact"
                type="button"
              >
                Contact
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