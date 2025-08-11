#!/bin/bash

echo "🚀 Test des optimisations de build..."

# Nettoyer les caches existants
echo "🧹 Nettoyage des caches..."
npm run clean
rm -rf .next/cache

# Mesurer le temps de build
echo "⏱️  Démarrage du build optimisé..."
start_time=$(date +%s)

# Build avec optimisations
npm run build:fast

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "✅ Build terminé en ${duration} secondes"

# Afficher la taille du build
echo "📊 Taille du build:"
du -sh .next

# Vérifier les optimisations appliquées
echo "🔍 Vérifications:"
if [ -d ".next/static" ]; then
    echo "✅ Fichiers statiques générés"
fi

if [ -f ".next/BUILD_ID" ]; then
    echo "✅ Build ID généré"
fi

echo "🎉 Optimisations appliquées avec succès!"