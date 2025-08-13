# JVNR - Site Personnel

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Coolify](https://img.shields.io/badge/Deploy-Coolify-6366f1?style=flat-square&logo=docker)](https://coolify.io/)

[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-green?style=flat-square&logo=google)](https://developers.google.com/search)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/A11Y-WCAG_2.1-blue?style=flat-square&logo=accessibility)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=flat-square&logo=lighthouse)](https://web.dev/performance/)

Site personnel professionnel présentant l'expertise de JVNR en création de solutions digitales, avec plus de 15 ans d'expérience.

## 🎯 Aperçu

Site minimaliste en page unique (single page) mettant en avant :
- **Expertise** : 15+ années d'expérience en création de solutions digitales
- **Services** : Développement, SEO, Performance, Accessibilité
- **Design** : Épuré noir et blanc avec typographie Inter et thème sombre
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
- **Outils** : Générateur de contrats PDF avec jsPDF

## 🛠️ Outils Inclus

### Générateur de Contrats PDF
- **Script interactif** : [`generate-contract-interactive.js`](generate-contract-interactive.js)
- **Données synchronisées** : Utilise [`src/data/pricing.json`](src/data/pricing.json)
- **Fonctionnalités** :
  - Génération de contrats PDF personnalisés
  - Support des factures correspondantes
  - Plans tarifaires avec remises
  - **Contrats de maintenance** avec conditions spécifiques
  - **Factures de maintenance** avec tarification mensuelle
  - Informations client complètes
  - Conditions générales automatiques
  - Durée de contrat personnalisable

### Gestion des Versions
- **Tags Git automatisés** : Correspondance avec le changelog
- **Releases GitHub** : Génération automatique via GitHub CLI
- **Versioning sémantique** : Suivi des versions selon SemVer

## 📱 Fonctionnalités

### Design
- Design épuré noir et blanc avec **thème sombre complet**
- **Bouton de basculement** soleil/lune avec animation fluide
- **Détection automatique** de la préférence système utilisateur
- **Sauvegarde** du choix de thème dans localStorage
- Typographie Inter (Regular 400, Bold 700, Black 900)
- Dégradés subtils sur les titres adaptés au mode sombre
- Navigation fluide entre sections avec scroll smooth
- Responsive design optimisé (mobile/desktop)
- Animations et transitions fluides

### Sections
1. **Hero** - Logo JVNR, présentation et bouton "Voir nos offres"
2. **À propos** - Expertise et statistiques
3. **Services** - 4 domaines de compétence
4. **Tarifs** - Grille tarifaire avec données JSON, icônes colorées et mise en page optimisée
5. **Contact** - Formulaire de contact avec API route

### Optimisations Avancées
- ✅ **SEO complet** : Métadonnées, Open Graph, Twitter Cards, 12 schémas Schema.org
- ✅ **Rich Snippets** : Prix, avis, FAQ, actions utilisateur pour Google
- ✅ **Local SEO** : Géolocalisation et optimisation recherches locales
- ✅ **Sitemap enrichi** : Toutes sections et ancres avec priorités SEO
- ✅ **Robots.txt professionnel** : Règles par moteur, blocage crawlers agressifs
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
- **Mode clair** : Fond blanc (#FFFFFF), texte noir (#000000)
- **Mode sombre** : Fond gris foncé (#0f0f0f), texte blanc (#ffffff)
- **Variables CSS** : Adaptation automatique selon le thème
- **Dégradés** : Optimisés pour chaque mode (noir/gris en clair, couleurs vives en sombre)
- **Theme Color** : #000000 (PWA)

### Typographie
- **Logo** : Inter Black (900)
- **Titres** : Inter Bold (700) avec dégradés
- **Corps** : Inter Regular (400)
- **Variable CSS** : --font-inter

### Composants
- **Thème sombre** : Tous les composants adaptés avec classes `dark:`
- **ThemeToggle** : Bouton de basculement avec icônes soleil/lune animées
- Navigation fluide avec scroll smooth et section active
- Boutons avec transitions hover et alignement Flexbox
- Cards avec bordures subtiles et icônes colorées distinctives
- Formulaires avec validation et support du mode sombre
- Animations et micro-interactions
- Icônes Lucide React avec couleurs thématiques (bleu, vert, violet, orange, rouge)
- Mise en page responsive optimisée (Site Sur Mesure et Forfait Maintenance côte à côte en desktop)

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
- **Schema.org** : 12 schémas JSON-LD (Person, Organization, Service, FAQ, Review, etc.)
- **Sitemap.xml** : Navigation complète avec ancres spécifiques
- **Robots.txt** : Optimisé pour tous les moteurs de recherche
- **Rich Snippets** : Support prix, avis, FAQ, actions
- **Local SEO** : Données géographiques et professionnelles

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
- **Coolify** : Déploiement optimal avec Docker et API routes
- **Vercel** : Compatible avec déploiement Next.js
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
