# JVNR - Site Personnel

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-green?style=flat-square&logo=google)](https://developers.google.com/search)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/A11Y-WCAG_2.1-blue?style=flat-square&logo=accessibility)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=flat-square&logo=lighthouse)](https://web.dev/performance/)

Site personnel professionnel présentant l'expertise de JVNR en création de solutions digitales, avec plus de 15 ans d'expérience.

## 🎯 Aperçu

Site minimaliste en page unique (single page) mettant en avant :
- **Expertise** : 15+ années d'expérience en création de solutions digitales
- **Services** : Développement, SEO, Performance, Accessibilité
- **Design** : Épuré noir et blanc avec typographie Inter
- **Contact** : Email et LinkedIn avec formulaire de contact

## 🚀 Technologies

- **Framework** : Next.js 15.4.6 (App Router)
- **React** : 19.1.0
- **Styling** : Tailwind CSS 3.4.17
- **Typographie** : Inter (Google Fonts)
- **Icons** : Lucide React 0.539.0
- **Email** : Nodemailer 7.0.5
- **TypeScript** : 5.x
- **Déploiement** : Configuration hybride (standalone + API routes)

## 📱 Fonctionnalités

### Design
- Design épuré noir et blanc
- Typographie Inter (Regular 400, Bold 700, Black 900)
- Dégradés subtils sur les titres
- Navigation fluide entre sections avec scroll smooth
- Responsive design optimisé (mobile/desktop)
- Animations et transitions fluides

### Sections
1. **Hero** - Logo JVNR et présentation
2. **À propos** - Expertise et statistiques
3. **Services** - 4 domaines de compétence
4. **Tarifs** - Grille tarifaire avec données JSON
5. **Contact** - Formulaire de contact avec API route

### Optimisations Avancées
- ✅ **SEO complet** : Métadonnées, Open Graph, Twitter Cards, Schema.org
- ✅ **Performance** : Images WebP/AVIF, optimisations Next.js
- ✅ **Accessibilité** : WCAG 2.1, navigation clavier, ARIA labels
- ✅ **PWA Ready** : Manifest, favicons, theme-color
- ✅ **Core Web Vitals** : Optimisations LCP, FID, CLS
- ✅ **Sécurité** : Headers de sécurité configurés

## 🛠️ Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd jvnr-site

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Générer la version de production
npm run build
```

## 📂 Structure du projet

```
jvnr-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout principal avec métadonnées SEO complètes
│   │   ├── page.tsx             # Page d'accueil
│   │   ├── globals.css          # Styles globaux et variables CSS
│   │   └── api/
│   │       └── send-email/
│   │           └── route.ts     # API route pour l'envoi d'emails
│   ├── components/
│   │   ├── Header.tsx           # Navigation fixe avec scroll actif
│   │   ├── Hero.tsx             # Section hero avec logo
│   │   ├── About.tsx            # Section à propos
│   │   ├── Services.tsx         # Section services
│   │   ├── Pricing.tsx          # Section tarifs
│   │   ├── Contact.tsx          # Section contact
│   │   ├── ContactForm.tsx      # Formulaire de contact
│   │   ├── Footer.tsx           # Footer
│   │   ├── AnimatedSection.tsx  # Composant d'animation
│   │   └── StructuredData.tsx   # Données structurées Schema.org
│   ├── data/
│   │   └── pricing.json         # Données des tarifs
│   └── hooks/
│       └── useActiveSection.ts  # Hook pour la navigation active
├── public/                      # Assets statiques et PWA
│   ├── manifest.json           # Manifest PWA
│   ├── robots.txt              # Directives robots
│   ├── sitemap.xml             # Plan du site
│   └── [favicons...]           # Ensemble complet de favicons
└── next.config.ts              # Configuration Next.js optimisée
```

## 🎨 Design System

### Couleurs
- **Fond** : Blanc (#FFFFFF)
- **Texte** : Noir (#000000)
- **Dégradés** : Noir vers gris pour les titres
- **Theme Color** : #000000 (PWA)

### Typographie
- **Logo** : Inter Black (900)
- **Titres** : Inter Bold (700) avec dégradés
- **Corps** : Inter Regular (400)
- **Variable CSS** : --font-inter

### Composants
- Navigation fluide avec scroll smooth et section active
- Boutons avec transitions hover
- Cards avec bordures subtiles
- Formulaires avec validation
- Animations et micro-interactions
- Icônes Lucide React

## 📊 Performance & SEO

### Optimisations Techniques
- **Images** : Formats WebP/AVIF, tailles adaptatives
- **Fonts** : Inter optimisé avec font-display
- **JavaScript** : Tree-shaking, code splitting
- **CSS** : Tailwind CSS optimisé
- **Compression** : Gzip/Brotli activée

### Métadonnées SEO
- **Title Template** : Dynamique avec mots-clés
- **Description** : 160 caractères optimisés
- **Keywords** : 15 mots-clés stratégiques
- **Open Graph** : Images 1200x630px
- **Twitter Cards** : Summary large image
- **Schema.org** : Données structurées complètes

### Core Web Vitals
- **LCP** : Optimisé avec images adaptatives
- **FID** : JavaScript minimal et optimisé
- **CLS** : Layout stable, pas de décalage

## 🌐 Déploiement

### Configuration
- **Mode** : Standalone (hybride statique + API)
- **Trailing Slash** : Activé pour la compatibilité
- **Compression** : Gzip/Brotli
- **Headers de sécurité** : Configurés (commentés pour export statique)

### Plateformes supportées
- **Vercel** : Déploiement optimal avec API routes
- **Netlify** : Compatible avec fonctions serverless
- **Docker** : Configuration standalone
- **Serveurs traditionnels** : Avec Node.js

### Scripts disponibles
```bash
npm run dev          # Développement avec Turbopack
npm run build        # Build de production
npm run build:fast   # Build rapide
npm run seo:check    # Vérification SEO
npm run analyze      # Analyse du bundle
npm run clean        # Nettoyage des caches
```

## 📧 Contact

- **Email** : contact@jvnr.fr
- **LinkedIn** : linkedin.com/in/julien-venerosy/

---

*Développé avec ❤️ en France - Next.js & Tailwind CSS*
