#!/bin/bash

echo "🧪 Test du mode hybride Next.js..."

echo "🏗️ Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    
    echo "📊 Analyse du build :"
    echo "- Pages statiques : $(grep -c "○" <<< "$(npm run build 2>&1)" || echo "N/A")"
    echo "- API routes dynamiques : $(grep -c "ƒ" <<< "$(npm run build 2>&1)" || echo "N/A")"
    
    echo "📁 Vérification des fichiers générés :"
    if [ -f ".next/standalone/server.js" ]; then
        echo "✅ Serveur standalone généré"
    else
        echo "❌ Serveur standalone manquant"
    fi
    
    if [ -d ".next/static" ]; then
        echo "✅ Assets statiques générés"
    else
        echo "❌ Assets statiques manquants"
    fi
    
    echo "🚀 Test du serveur (5 secondes)..."
    cd .next/standalone
    timeout 5s node server.js &
    SERVER_PID=$!
    sleep 2
    
    echo "🧪 Test de l'API email..."
    curl -s -X POST http://localhost:3000/api/send-email \
         -H "Content-Type: application/json" \
         -d '{"name":"Test","email":"test@example.com","service":"consultation","message":"Test message"}' \
         > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ API accessible"
    else
        echo "⚠️ API non accessible (normal sans variables d'environnement)"
    fi
    
    kill $SERVER_PID 2>/dev/null
    cd ../..
    
else
    echo "❌ Échec du build"
    exit 1
fi

echo "✅ Test du mode hybride terminé !"