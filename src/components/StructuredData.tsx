'use client';

import pricingData from '@/data/pricing.json';

const sanitizePrice = (price: string) => {
  const normalized = price
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  return normalized.length > 0 ? normalized : null;
};

const buildOffers = () => {
  const offers: Record<string, unknown>[] = [];

  pricingData.plans.forEach((plan) => {
    const cleanPrice = sanitizePrice(plan.price);

    if (!cleanPrice) {
      return;
    }

    offers.push({
      '@type': 'Offer',
      name: plan.name,
      description: plan.description,
      price: cleanPrice,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Service',
        name: plan.name,
        description: plan.description,
      },
      seller: {
        '@type': 'Person',
        name: 'JVNR',
        url: 'https://jvnr.fr',
      },
    });
  });

  if (pricingData.maintenance) {
    const maintenancePrice = sanitizePrice(pricingData.maintenance.price);

    if (maintenancePrice) {
      offers.push({
        '@type': 'Offer',
        name: pricingData.maintenance.name,
        description: pricingData.maintenance.description,
        price: maintenancePrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: pricingData.maintenance.name,
          description: pricingData.maintenance.description,
        },
        seller: {
          '@type': 'Person',
          name: 'JVNR',
          url: 'https://jvnr.fr',
        },
      });
    }
  }

  return offers;
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'JVNR',
  jobTitle: 'Créateur de solutions digitales',
  description:
    "Développeur web avec plus de 15 ans d'expérience, spécialisé en Next.js, SEO, performance et accessibilité.",
  url: 'https://jvnr.fr',
  email: 'contact@jvnr.fr',
  sameAs: ['https://www.linkedin.com/in/julien-venerosy/'],
  knowsAbout: [
    'Développement Web',
    'SEO technique',
    'Performance Web',
    'Accessibilité numérique',
    'React',
    'Next.js',
    'TypeScript',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Développeur Web',
    occupationLocation: {
      '@type': 'Country',
      name: 'France',
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JVNR',
  alternateName: 'JVNR - Créateur de solutions digitales',
  url: 'https://jvnr.fr',
  logo: 'https://jvnr.fr/og.png',
  image: 'https://jvnr.fr/og.png',
  description:
    "JVNR conçoit et maintient des expériences web performantes, accessibles et optimisées pour le référencement naturel.",
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'contact@jvnr.fr',
      contactType: 'sales',
      availableLanguage: ['French'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
  },
  sameAs: ['https://www.linkedin.com/in/julien-venerosy/'],
};

const StructuredData = () => {
  const offers = buildOffers();

  const offerListItems = offers.map((offer, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: offer,
  }));

  const serviceCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Services de développement web et d’optimisation',
    description:
      'Création de sites web sur mesure, optimisation SEO, amélioration des performances et mise en conformité accessibilité.',
    provider: {
      '@type': 'Person',
      name: 'JVNR',
      url: 'https://jvnr.fr',
    },
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Offres JVNR',
      itemListElement: offers,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JVNR - Créateur de solutions digitales',
    url: 'https://jvnr.fr',
    description:
      'Site officiel de JVNR, expert en développement web, SEO, performance et accessibilité.',
    inLanguage: 'fr-FR',
    publisher: {
      '@type': 'Organization',
      name: 'JVNR',
    },
    potentialAction: [
      {
        '@type': 'ContactAction',
        target: 'https://jvnr.fr/#contact',
        name: 'Contacter JVNR',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://jvnr.fr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'À propos',
        item: 'https://jvnr.fr#about',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Services',
        item: 'https://jvnr.fr#services',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Tarifs',
        item: 'https://jvnr.fr#pricing',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: 'https://jvnr.fr#contact',
      },
    ],
  };

  const priceSchema =
    offerListItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Offres de services JVNR',
          itemListElement: offerListItems,
        }
      : null;

  const structuredData = [
    personSchema,
    organizationSchema,
    serviceCatalogSchema,
    websiteSchema,
    breadcrumbSchema,
    priceSchema,
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
