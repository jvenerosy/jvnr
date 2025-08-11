#!/bin/bash

echo "🔍 Diagnostic du problème de build..."

echo "📦 Vérification des dépendances lightningcss..."
if [ -d "node_modules/lightningcss" ]; then
    echo "✅ lightningcss trouvé dans node_modules"
    ls -la node_modules/lightningcss/
    echo ""
    echo "🔍 Contenu du dossier lightningcss:"
    find node_modules/lightningcss -name "*.node" 2>/dev/null || echo "❌ Aucun fichier .node trouvé"
else
    echo "❌ lightningcss non trouvé dans node_modules"
fi

echo ""
echo "🏗️ Tentative de rebuild des modules natifs..."
npm rebuild lightningcss

echo ""
echo "🔍 Vérification après rebuild:"
find node_modules/lightningcss -name "*.node" 2>/dev/null || echo "❌ Aucun fichier .node trouvé après rebuild"

echo ""
echo "🧪 Test de build Next.js..."
npm run build