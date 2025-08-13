'use client';

const StructuredData = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "JVNR",
    "jobTitle": "Créateur de solutions digitales performantes",
    "description": "Créateur de solutions digitales avec plus de 15 ans d'expérience, spécialisé en SEO, performance web et accessibilité",
    "url": "https://jvnr.fr",
    "email": "contact@jvnr.fr",
    "sameAs": [
      "https://www.linkedin.com/in/julien-venerosy/"
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
    "@type": ["Organization", "LocalBusiness"],
    "name": "JVNR",
    "alternateName": "JVNR - Créateur de solutions digitales",
    "url": "https://jvnr.fr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://jvnr.fr/logo.png",
      "width": "200",
      "height": "200"
    },
    "image": "https://jvnr.fr/og.png",
    "description": "Expert en création de solutions digitales performantes avec plus de 15 ans d'expérience. Spécialisé en développement web, optimisation SEO, performance et accessibilité.",
    "slogan": "Des solutions digitales qui performent",
    "foundingDate": "2008",
    "founder": {
      "@type": "Person",
      "name": "JVNR",
      "jobTitle": "Créateur de solutions digitales"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "contact@jvnr.fr",
        "contactType": "customer service",
        "availableLanguage": ["French", "English"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "France"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "France"
      },
      {
        "@type": "Place",
        "name": "Europe"
      }
    ],
    "serviceType": [
      "Développement Web",
      "Optimisation SEO",
      "Performance Web",
      "Accessibilité Web",
      "E-commerce",
      "Progressive Web Apps",
      "Audit technique",
      "Consulting digital"
    ],
    "knowsAbout": [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "SEO technique",
      "Core Web Vitals",
      "WCAG",
      "Performance web",
      "Accessibilité numérique"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/julien-venerosy/"
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
            "description": "Création de sites modernes et performants avec React, Next.js et TypeScript"
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
            "description": "Optimisation de la vitesse et des performances des sites"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Accessibilité Web",
            "description": "Création de sites accessibles conformes aux standards WCAG"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JVNR - Créateur de solutions digitales performantes",
    "url": "https://jvnr.fr",
    "description": "Site officiel de JVNR, créateur de solutions digitales performantes avec plus de 15 ans d'expérience",
    "inLanguage": "fr-FR",
    "author": {
      "@type": "Person",
      "name": "JVNR"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://jvnr.fr/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ContactAction",
        "target": "https://jvnr.fr/#contact"
      }
    ],
    "mainEntity": {
      "@type": "Organization",
      "name": "JVNR"
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
        "item": "https://jvnr.fr"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "À propos",
        "item": "https://jvnr.fr#about"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Services",
        "item": "https://jvnr.fr#services"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Tarifs",
        "item": "https://jvnr.fr#pricing"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Contact",
        "item": "https://jvnr.fr#contact"
      }
    ]
  };

  // Schema pour les offres de prix
  const priceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Offres de développement web JVNR",
    "description": "Plans tarifaires pour la création de sites web performants",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Site One Page",
        "description": "Site web d'une page optimisé pour présenter votre activité",
        "price": "890",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "itemOffered": {
          "@type": "Service",
          "name": "Création de site One Page",
          "category": "Développement Web"
        },
        "seller": {
          "@type": "Person",
          "name": "JVNR"
        }
      },
      {
        "@type": "Offer",
        "name": "Site Vitrine",
        "description": "Site web multi-pages pour présenter votre entreprise et vos services",
        "price": "1490",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "itemOffered": {
          "@type": "Service",
          "name": "Création de site vitrine",
          "category": "Développement Web"
        },
        "seller": {
          "@type": "Person",
          "name": "JVNR"
        }
      },
      {
        "@type": "Offer",
        "name": "Site E-shop",
        "description": "Boutique en ligne complète avec gestion des commandes et paiements",
        "price": "2990",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "itemOffered": {
          "@type": "Service",
          "name": "Création de boutique en ligne",
          "category": "E-commerce"
        },
        "seller": {
          "@type": "Person",
          "name": "JVNR"
        }
      }
    ]
  };

  // Schema pour les FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quels sont les délais de création d'un site web ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les délais varient selon la complexité : 1-2 semaines pour un site One Page, 2-4 semaines pour un site vitrine, et 4-8 semaines pour un e-shop complet."
        }
      },
      {
        "@type": "Question",
        "name": "Proposez-vous un service de maintenance ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, nous proposons un forfait maintenance à partir de 89€/mois incluant les mises à jour, la sécurité, les sauvegardes et le support technique."
        }
      },
      {
        "@type": "Question",
        "name": "Les sites sont-ils optimisés pour le SEO ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolument ! Tous nos sites sont optimisés pour le référencement naturel avec une structure technique SEO-friendly, des métadonnées optimisées et des performances web excellentes."
        }
      },
      {
        "@type": "Question",
        "name": "Travaillez-vous avec des entreprises de toute taille ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, nous accompagnons aussi bien les startups que les PME et grandes entreprises, avec des solutions adaptées à chaque budget et besoin."
        }
      }
    ]
  };

  // Schema pour les avis clients
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JVNR",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Client Satisfait"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent travail sur notre site e-commerce. Performance et SEO au top !",
        "datePublished": "2024-12-15"
      }
    ]
  };

  // Schema pour les compétences professionnelles
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "JVNR - Services de Développement Web",
    "description": "Expert en création de sites web performants, optimisation SEO et accessibilité",
    "url": "https://jvnr.fr",
    "telephone": "+33-XXX-XXX-XXX",
    "email": "contact@jvnr.fr",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "France"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.603354",
      "longitude": "1.888334"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "€€",
    "serviceType": [
      "Développement Web",
      "Optimisation SEO",
      "Performance Web",
      "Accessibilité Web",
      "E-commerce",
      "Progressive Web Apps"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "France"
    }
  };

  // Schema pour les articles/blog (si applicable)
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog JVNR - Développement Web",
    "description": "Articles sur le développement web, SEO, performance et accessibilité",
    "url": "https://jvnr.fr/blog",
    "author": {
      "@type": "Person",
      "name": "JVNR"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JVNR",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jvnr.fr/logo.png"
      }
    }
  };

  // Schema pour les actions et événements
  const actionSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "JVNR - Créateur de solutions digitales",
    "url": "https://jvnr.fr",
    "potentialAction": [
      {
        "@type": "ContactAction",
        "name": "Demander un devis",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jvnr.fr/#contact",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        }
      },
      {
        "@type": "ViewAction",
        "name": "Voir les services",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jvnr.fr/#services",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        }
      },
      {
        "@type": "ViewAction",
        "name": "Consulter les tarifs",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jvnr.fr/#pricing",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        }
      }
    ]
  };

  // Schema pour les compétences techniques
  const skillSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "JVNR",
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Expert SEO",
        "description": "Plus de 15 ans d'expérience en optimisation pour les moteurs de recherche",
        "credentialCategory": "Professional Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Spécialiste Performance Web",
        "description": "Expert en optimisation Core Web Vitals et performance web",
        "credentialCategory": "Professional Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Expert Accessibilité WCAG",
        "description": "Spécialiste en accessibilité web et conformité WCAG 2.1",
        "credentialCategory": "Professional Certification"
      }
    ],
    "hasSkill": [
      {
        "@type": "DefinedTerm",
        "name": "React Development",
        "description": "Développement d'applications React modernes et performantes"
      },
      {
        "@type": "DefinedTerm",
        "name": "Next.js Framework",
        "description": "Création d'applications web avec Next.js pour des performances optimales"
      },
      {
        "@type": "DefinedTerm",
        "name": "TypeScript Programming",
        "description": "Développement avec TypeScript pour un code robuste et maintenable"
      },
      {
        "@type": "DefinedTerm",
        "name": "SEO Technique",
        "description": "Optimisation technique pour les moteurs de recherche"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(actionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillSchema) }}
      />
    </>
  );
};

export default StructuredData;