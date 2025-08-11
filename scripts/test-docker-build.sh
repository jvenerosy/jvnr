#!/bin/bash

echo "🐳 Test du build Docker..."

echo "🏗️ Construction de l'image Docker..."
docker build -t jvnr-site:test .

if [ $? -eq 0 ]; then
    echo "✅ Build Docker réussi !"
    
    echo "🚀 Test de l'image..."
    docker run --rm -p 3001:3000 -d --name jvnr-test jvnr-site:test
    
    echo "⏳ Attente du démarrage du serveur..."
    sleep 5
    
    echo "🧪 Test de la réponse HTTP..."
    curl -f http://localhost:3001 > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ Le serveur répond correctement !"
    else
        echo "❌ Le serveur ne répond pas"
    fi
    
    echo "🛑 Arrêt du conteneur de test..."
    docker stop jvnr-test
    
else
    echo "❌ Échec du build Docker"
    exit 1
fi