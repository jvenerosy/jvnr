# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

## [1.31.0] - 2025-08-13
### Ajouté
- 📊 **Google Analytics** : Intégration du code de suivi Google Analytics (gtag.js) avec l'ID G-0XZWR8HMLC
- 🔍 **Analyse de trafic** : Collecte automatique des données de performance et de comportement utilisateur
- 📈 **Suivi des conversions** : Monitoring des interactions et objectifs du site

## [1.30.0] - 2025-08-13
### Ajouté
- 🏗️ **Données structurées Schema.org complètes** : 12 schémas JSON-LD pour un SEO avancé
- 📄 **Sitemap.xml enrichi** : Toutes les sections et ancres avec priorités SEO optimisées
- 🤖 **Robots.txt professionnel** : Règles spécifiques par moteur de recherche et blocage des crawlers agressifs
- ⚓ **Ancres SEO structurées** : Navigation fine pour services individuels et plans tarifaires
- 🎯 **Rich Snippets** : Support des prix, avis, FAQ et actions utilisateur
- 🌐 **Local SEO** : Géolocalisation et optimisation pour les recherches locales
- 📊 **Knowledge Graph** : Données professionnelles et compétences techniques structurées

### Modifié
- 🏷️ **Balises sémantiques** : Ajout d'`<article>` et `<header>` pour une meilleure structure
- ♿ **Accessibilité** : Attributs `aria-labelledby` et IDs uniques pour chaque élément
- 🔍 **Navigation** : Ancres spécifiques pour chaque service et plan tarifaire
- 📱 **Breadcrumb** : Structure hiérarchique complète incluant la section pricing

## [1.29.0] - 2025-08-12
### Ajouté
- 🎨 **Favicons et icônes d'app** : Mise à jour complète du design des icônes
- 📱 **Icônes Android Chrome** : Nouvelles versions 192x192 et 512x512 avec design amélioré
- 🍎 **Icône Apple Touch** : Design optimisé pour les appareils iOS
- 🌐 **Favicons standards** : Versions 16x16, 32x32 et favicon.ico avec visuel amélioré
- ✨ **Design cohérent** : Harmonisation visuelle de toutes les variantes d'icônes

## [1.28.0] - 2025-08-12
### Ajouté
- 🌙 **Thème sombre complet** : Implémentation d'un mode sombre pour l'ensemble du site
- 🎛️ **Bouton de basculement** : Icônes soleil/lune avec animation fluide dans le header
- 🔧 **Hook useTheme** : Gestion du thème avec détection automatique de la préférence système
- 💾 **Sauvegarde localStorage** : Mémorisation du choix utilisateur entre les sessions
- 🎨 **Variables CSS adaptatives** : Couleurs automatiques selon le thème (clair/sombre)
- ⚡ **Configuration Tailwind** : Support du mode sombre avec `darkMode: 'class'`

### Modifié
- 🎨 **Tous les composants** : Adaptation complète avec classes `dark:` pour Header, Hero, About, Services, Pricing, Contact, Footer, Modals
- 🌈 **Dégradés optimisés** : Couleurs plus vives et contrastées spécifiquement pour le mode sombre
- ♿ **Accessibilité** : Focus et navigation adaptés au mode sombre
- 🔧 **Classes CSS globales** : Correction des `!important` qui écrasaient les classes Tailwind

## [1.27.0] - 2025-08-12
### Modifié
- 🎯 **Bouton CTA Hero** : remplacement de "Discutons de votre projet" par "Voir nos offres"
- 🔗 **Navigation** : le bouton principal redirige maintenant vers la section pricing au lieu de contact
- ♿ **Accessibilité** : mise à jour de l'aria-label pour refléter la nouvelle action

## [1.26.0] - 2025-08-12
### Modifié
- 🎨 **Section Pricing** : mise en page améliorée avec Site Sur Mesure et Forfait Maintenance côte à côte en desktop (50% chacun)
- 🎯 **Alignement des boutons** : tous les boutons des cartes pricing sont maintenant alignés en bas grâce à Flexbox
- 📍 **Position de la note tarifaire** : déplacement de "Tarif adapté selon la complexité de votre site" sous le prix du Forfait Maintenance
- 🎨 **Icônes colorées** : ajout d'icônes distinctives avec couleurs pour chaque plan (bleu, vert, violet, orange, rouge)
- 🏷️ **Icônes positionnées** : placement des icônes devant les titres pour une meilleure lisibilité

## [1.25.0] - 2025-08-12
### Corrigé
- 🎨 **Icône de scroll** : centrage horizontal parfait avec animation personnalisée bounce-centered
- 🔧 **Animation CSS** : résolution du conflit entre transform et animate-bounce

## [1.24.0] - 2025-08-11
### Ajouté
- 🔧 **Support de la maintenance** dans le générateur de contrats PDF
- 📄 **Contrats de maintenance** avec conditions spécifiques et durée personnalisable
- 💰 **Factures de maintenance** avec tarification mensuelle
- 🎯 **Menu interactif** incluant l'option maintenance (4ème choix)
- 📋 **Données de maintenance** intégrées depuis pricing.json

## [1.23.0] - 2025-08-11
### Modifié
- 🔧 **Générateur de contrats** : utilisation des données de pricing.json pour éviter la duplication
- 🏷️ **Tags Git et releases** : création automatisée de 23 tags et releases GitHub correspondants au changelog
- 📦 **Version** : mise à jour vers 1.23.0

## [1.22.0] - 2025-08-11
### Ajouté
- 📄 **Générateur de contrats PDF** interactif avec support des factures (4ec71fc)
- 🛠️ **Dépendances de développement** : jsPDF, readline-sync, types associés

## [1.21.0] - 2025-08-11
### Ajouté
- 📱 **Navigation mobile** avec menu toggle et améliorations d'accessibilité (a6f990e)
- 📚 **Documentation README** améliorée avec badges technologiques et informations de déploiement (05c31b0, 8694f40)

## [1.20.0] - 2025-08-11
### Corrigé
- 🎨 **Couleur du texte** dans le Footer pour une meilleure lisibilité (0855cb8)

## [1.19.0] - 2025-08-11
### Supprimé
- 🗑️ **Scripts de build et SEO obsolètes** (4105ba6)

## [1.18.0] - 2025-08-11
### Modifié
- 🎨 **Composant Hero** avec icône ChevronsDown et texte inclusif pour les Services (d52d20b)

## [1.17.0] - 2025-08-11
### Corrigé
- 🔤 **Entité HTML** pour l'apostrophe dans le composant About (d1a9106)

## [1.16.0] - 2025-08-11
### Modifié
- 📝 **Composants About et Contact** avec langage inclusif (13881b3)
- 💰 **Description des tarifs** pour plus de clarté

## [1.15.0] - 2025-08-11
### Supprimé
- 🗑️ **Dockerfile et .dockerignore obsolètes** (29c5888)
- 📜 **Script de test de build Docker**

## [1.14.0] - 2025-08-11
### Modifié
- 🐳 **Dockerfile et .dockerignore** pour un processus de build amélioré
- 📜 **Script de build optimisé**

## [1.13.0] - 2025-08-11
### Modifié
- 🔧 **Configuration Tailwind CSS** et mise à jour des dépendances

## [1.12.0] - 2025-08-11
### Modifié
- 🐳 **Dockerfile et configuration Next.js** pour sortie standalone
- 📜 **Script de test en mode hybride**

## [1.11.0] - 2025-08-11
### Ajouté
- 🐳 **Configuration Nixpacks** pour les phases de build et déploiement

## [1.10.0] - 2025-08-11
### Ajouté
- ⚡ **Fonctionnalité X** pour améliorer l'expérience utilisateur et optimiser les performances

## [1.9.0] - 2025-08-11
### Ajouté
- 🔗 **Support complet des favicons** et dépendance serve

## [1.8.0] - 2025-08-11
### Ajouté
- 📧 **API d'envoi d'emails** avec limitation de taux et protection anti-spam

## [1.7.0] - 2025-08-11
### Modifié
- 🎨 **Composant Header** : suppression de la logique de détection de scroll et simplification du style
- 💰 **Composant Pricing** : clarification du texte
- 📝 **Capitalisation** dans la liste des fonctionnalités Services

## [1.6.0] - 2025-08-11
### Ajouté
- 💰 **Section Tarifs** et intégration du lien de navigation dans Header

## [1.5.0] - 2025-08-11
### Modifié
- 🎯 **Composant About** : amélioration de la description et de la liste d'expertise pour plus de clarté et d'engagement

## [1.4.0] - 2025-08-11
### Modifié
- ⚡ **Configuration next.config.ts** : activation de la génération de site statique
- 🔒 **Headers de sécurité** commentés pour l'export statique

## [1.3.0] - 2025-08-11
### Modifié
- 🏷️ **Métadonnées** pour une meilleure clarté et optimisation SEO

## [1.2.0] - 2025-08-11
### Modifié
- 📝 **Informations de contact** et amélioration des descriptions du site
- 🎨 **Composant AnimatedSection** ajouté

## [1.1.0] - 2025-08-11
### Ajouté
- 🏗️ **Initialisation** du projet avec structure de base

## [1.0.0] - 2025-08-10
### Ajouté
- 🚀 **Commit initial** depuis Create Next App
- 🏗️ **Structure de base** du projet Next.js 15
- 🎨 **Configuration Tailwind CSS** initiale
- 📱 **Layout responsive** de base

---

## Légende des types de modifications

- 🎉 **Ajouté** : Nouvelles fonctionnalités
- ⚡ **Modifié** : Modifications de fonctionnalités existantes
- 🔧 **Corrigé** : Corrections de bugs
- 🗑️ **Supprimé** : Fonctionnalités supprimées
- 🔒 **Sécurité** : Corrections de vulnérabilités
- 📚 **Documentation** : Modifications de documentation
- 🎨 **Style** : Modifications de style/UI
- ♿ **Accessibilité** : Améliorations d'accessibilité
- 📊 **Performance** : Optimisations de performance
- 🐳 **DevOps** : Modifications d'infrastructure/déploiement
- 📧 **API** : Modifications d'API
- 💰 **Business** : Fonctionnalités métier
- 🔗 **Assets** : Ressources statiques
- 🏷️ **SEO** : Optimisations de référencement