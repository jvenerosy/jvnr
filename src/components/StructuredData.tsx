'use client';

const StructuredData = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "JVNR",
    "jobTitle": "Créateur de solutions digitales performantes",
    "description": "Développeur web expert avec plus de 15 ans d'expérience, spécialisé en SEO, performance web et accessibilité",
    "url": "https://jvnr.com",
    "email": "contact@jvnr.com",
    "sameAs": [
      "https://linkedin.com/in/jvnr"
    ],
    "knowsAbout": [
      "Développement Web",
      "SEO",
      "Performance Web",
      "Accessibilité",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Développeur Web",
      "occupationLocation": {
        "@type": "Country",
        "name": "France"
      },
      "skills": [
        "React",
        "Next.js",
        "TypeScript",
        "SEO",
        "Performance Web",
        "Accessibilité Web",
        "Progressive Web Apps",
        "E-commerce"
      ]
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JVNR",
    "url": "https://jvnr.com",
    "logo": "https://jvnr.com/logo.png",
    "description": "Services de création de solutions digitales performantes, optimisation SEO et amélioration des performances",
    "founder": {
      "@type": "Person",
      "name": "JVNR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@jvnr.com",
      "contactType": "customer service",
      "availableLanguage": "French"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": [
      "Développement Web",
      "Optimisation SEO",
      "Performance Web",
      "Accessibilité Web"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Services de Développement Web Expert",
    "description": "Services complets de développement web, optimisation SEO, amélioration des performances et accessibilité",
    "provider": {
      "@type": "Person",
      "name": "JVNR"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de Développement Web",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Développement Web",
            "description": "Création de sites web modernes et performants avec React, Next.js et TypeScript"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Optimisation SEO",
            "description": "Amélioration du référencement naturel et de la visibilité en ligne"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Performance Web",
            "description": "Optimisation de la vitesse et des performances des sites web"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Accessibilité Web",
            "description": "Création de sites web accessibles conformes aux standards WCAG"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JVNR - Créateur de solutions digitales performantes",
    "url": "https://jvnr.com",
    "description": "Site officiel de JVNR, créateur de solutions digitales performantes avec plus de 15 ans d'expérience",
    "inLanguage": "fr-FR",
    "author": {
      "@type": "Person",
      "name": "JVNR"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jvnr.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://jvnr.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "À propos",
        "item": "https://jvnr.com#about"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Services",
        "item": "https://jvnr.com#services"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact",
        "item": "https://jvnr.com#contact"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default StructuredData;