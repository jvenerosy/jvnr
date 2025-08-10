# JVNR - Site Personnel

Site personnel professionnel présentant l'expertise de JVNR en création de solutions digitales, avec plus de 15 ans d'expérience.

## 🎯 Aperçu

Site minimaliste en page unique (single page) mettant en avant :
- **Expertise** : 15+ années d'expérience en création de solutions digitales
- **Services** : Développement, SEO, Performance, Accessibilité
- **Design** : Épuré noir et blanc avec typographie Inter
- **Contact** : Email et LinkedIn

## 🚀 Technologies

- **Framework** : Next.js 15 (App Router)
- **Styling** : Tailwind CSS v4
- **Typographie** : Inter (Google Fonts)
- **Déploiement** : Génération statique (SSG)
- **Optimisations** : SEO, Performance, Accessibilité

## 📱 Fonctionnalités

### Design
- Design épuré noir et blanc
- Typographie Inter Black pour le logo
- Dégradés subtils sur les titres
- Navigation fluide entre sections
- Responsive design (mobile/desktop)

### Sections
1. **Hero** - Logo JVNR et présentation
2. **À propos** - Expertise et statistiques
3. **Services** - 4 domaines de compétence
4. **Contact** - Email et LinkedIn

### Optimisations
- ✅ SEO optimisé (métadonnées complètes)
- ✅ Génération statique (SSG)
- ✅ Performance web optimisée
- ✅ Accessibilité (WCAG)
- ✅ Navigation clavier
- ✅ Responsive design

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
│   │   ├── layout.tsx      # Layout principal avec métadonnées SEO
│   │   ├── page.tsx        # Page d'accueil
│   │   └── globals.css     # Styles globaux et variables CSS
│   └── components/
│       ├── Header.tsx      # Navigation fixe
│       ├── Hero.tsx        # Section hero avec logo
│       ├── About.tsx       # Section à propos
│       ├── Services.tsx    # Section services
│       ├── Contact.tsx     # Section contact
│       └── Footer.tsx      # Footer
├── public/                 # Assets statiques
├── out/                    # Build de production (après npm run build)
└── next.config.ts          # Configuration Next.js
```

## 🎨 Design System

### Couleurs
- **Fond** : Blanc (#FFFFFF)
- **Texte** : Noir (#000000)
- **Dégradés** : Noir vers gris pour les titres

### Typographie
- **Logo** : Inter Black (900)
- **Titres** : Inter Bold (700) avec dégradés
- **Corps** : Inter Regular (400)

### Composants
- Navigation fluide avec scroll smooth
- Boutons avec transitions hover
- Cards avec bordures subtiles
- Indicateurs visuels (puces, icônes)

## 📊 Performance

- **First Load JS** : ~103 kB
- **Page principale** : 2.83 kB
- **Génération** : Statique (SSG)
- **Optimisations** : Images, CSS, JavaScript

## 🌐 Déploiement

Le site est configuré pour la génération statique et peut être déployé sur :
- Vercel
- Netlify
- GitHub Pages
- Tout hébergeur de fichiers statiques

Les fichiers de production se trouvent dans le dossier `out/` après `npm run build`.

## 📧 Contact

- **Email** : contact@jvnr.fr
- **LinkedIn** : linkedin.com/in/julien-venerosy/

---

*Développé avec ❤️ en France - Next.js & Tailwind CSS*
