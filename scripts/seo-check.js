#!/usr/bin/env node

/**
 * Script de validation SEO pour le site JVNR
 * Vérifie que toutes les optimisations SEO sont correctement implémentées
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des optimisations SEO...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description} - Fichier manquant: ${filePath}`);
    checks.failed++;
    return false;
  }
}

function checkFileContent(filePath, searchText, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      checks.passed++;
      return true;
    } else {
      console.log(`❌ ${description} - Contenu manquant dans: ${filePath}`);
      checks.failed++;
      return false;
    }
  } else {
    console.log(`❌ ${description} - Fichier manquant: ${filePath}`);
    checks.failed++;
    return false;
  }
}

function warning(message) {
  console.log(`⚠️  ${message}`);
  checks.warnings++;
}

// Vérification des fichiers essentiels
console.log('📁 Fichiers de configuration SEO:');
checkFile('public/robots.txt', 'robots.txt présent');
checkFile('public/sitemap.xml', 'sitemap.xml présent');
checkFile('public/manifest.json', 'manifest.json présent');

console.log('\n📄 Métadonnées et structure:');
checkFileContent('src/app/layout.tsx', 'metadataBase', 'metadataBase configuré');
checkFileContent('src/app/layout.tsx', 'openGraph', 'Open Graph configuré');
checkFileContent('src/app/layout.tsx', 'twitter', 'Twitter Cards configurées');
checkFileContent('src/app/layout.tsx', 'robots', 'Directives robots configurées');

console.log('\n🏗️  Données structurées:');
checkFileContent('src/components/StructuredData.tsx', '@type": "Person"', 'Schema Person');
checkFileContent('src/components/StructuredData.tsx', '@type": "Organization"', 'Schema Organization');
checkFileContent('src/components/StructuredData.tsx', '@type": "Service"', 'Schema Service');
checkFileContent('src/components/StructuredData.tsx', '@type": "WebSite"', 'Schema WebSite');

console.log('\n🎨 Optimisations CSS:');
checkFileContent('src/app/globals.css', 'font-display: swap', 'Font display swap');
checkFileContent('src/app/globals.css', 'prefers-reduced-motion', 'Respect des préférences de mouvement');
checkFileContent('src/app/globals.css', '.sr-only', 'Classe screen reader only');

console.log('\n♿ Accessibilité:');
checkFileContent('src/components/Header.tsx', 'aria-label', 'ARIA labels dans Header');
checkFileContent('src/components/Hero.tsx', 'role="banner"', 'Rôles ARIA dans Hero');
checkFileContent('src/components/About.tsx', 'aria-labelledby', 'ARIA labelledby dans About');

console.log('\n⚡ Performance:');
checkFileContent('next.config.ts', 'compress: true', 'Compression activée');
checkFileContent('next.config.ts', 'swcMinify: true', 'Minification SWC');
checkFileContent('next.config.ts', 'optimizeCss: true', 'Optimisation CSS');

// Vérifications supplémentaires
console.log('\n🔍 Vérifications supplémentaires:');

// Vérifier la présence de mots-clés dans le contenu
const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (layoutContent.includes('développeur web') && layoutContent.includes('SEO') && layoutContent.includes('performance')) {
  console.log('✅ Mots-clés principaux présents dans les métadonnées');
  checks.passed++;
} else {
  console.log('❌ Mots-clés principaux manquants dans les métadonnées');
  checks.failed++;
}

// Vérifier la structure HTML sémantique
const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
if (pageContent.includes('<main') && pageContent.includes('<Header')) {
  console.log('✅ Structure HTML sémantique correcte');
  checks.passed++;
} else {
  console.log('❌ Structure HTML sémantique incorrecte');
  checks.failed++;
}

// Avertissements pour les éléments à vérifier manuellement
console.log('\n⚠️  À vérifier manuellement:');
warning('Images: Vérifier que toutes les images ont un alt text approprié');
warning('Liens: Vérifier que tous les liens externes ont rel="noopener"');
warning('Performance: Tester les Core Web Vitals avec Lighthouse');
warning('Mobile: Tester la responsivité sur différents appareils');
warning('Contenu: Vérifier la densité et la pertinence des mots-clés');

// Résumé
console.log('\n📊 Résumé de la vérification SEO:');
console.log(`✅ Tests réussis: ${checks.passed}`);
console.log(`❌ Tests échoués: ${checks.failed}`);
console.log(`⚠️  Avertissements: ${checks.warnings}`);

const score = Math.round((checks.passed / (checks.passed + checks.failed)) * 100);
console.log(`\n🎯 Score SEO: ${score}%`);

if (score >= 90) {
  console.log('🎉 Excellent ! Votre site est très bien optimisé pour le SEO.');
} else if (score >= 75) {
  console.log('👍 Bon travail ! Quelques améliorations mineures possibles.');
} else if (score >= 60) {
  console.log('⚠️  Des améliorations sont nécessaires pour optimiser le SEO.');
} else {
  console.log('❌ Des optimisations importantes sont requises.');
}

console.log('\n📚 Pour plus d\'informations, consultez le fichier SEO-OPTIMIZATIONS.md');

// Code de sortie
process.exit(checks.failed > 0 ? 1 : 0);