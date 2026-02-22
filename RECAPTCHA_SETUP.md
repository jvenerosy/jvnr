# Configuration Google reCAPTCHA

Ce guide vous explique comment configurer Google reCAPTCHA pour sécuriser vos formulaires.

## 🔐 Pourquoi reCAPTCHA ?

Le captcha mathématique précédent n'était pas sécurisé car :
- ❌ Facilement contournable par des bots
- ❌ Réponses prévisibles (calculs simples)
- ❌ Pas de protection contre les attaques automatisées
- ❌ Vulnérable aux scripts malveillants

Google reCAPTCHA v2/v3 offre une protection robuste :
- ✅ Analyse comportementale avancée
- ✅ Machine learning pour détecter les bots
- ✅ Protection contre les attaques DDoS
- ✅ Utilisé par des millions de sites web

## 📋 Étapes de configuration

### 1. Créer un compte reCAPTCHA

1. Allez sur [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Créer" pour ajouter un nouveau site

### 2. Configurer votre site

**Informations requises :**
- **Libellé** : Nom de votre site (ex: "JVNR Contact Form")
- **Type de reCAPTCHA** : 
  - **reCAPTCHA v2** : Case à cocher "Je ne suis pas un robot"
  - **reCAPTCHA v3** : Analyse invisible en arrière-plan (recommandé)
- **Domaines** : 
  - Pour le développement : `localhost`
  - Pour la production : `votre-domaine.com`

### 3. Récupérer les clés

Après création, vous obtiendrez :
- **Clé du site (Site Key)** : Clé publique pour le frontend
- **Clé secrète (Secret Key)** : Clé privée pour la validation côté serveur

### 4. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Configuration Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# URL de base (pour la validation en local)
NEXTAUTH_URL=http://localhost:3000
```

### 5. Redémarrer le serveur

```bash
npm run dev
```

## 🧪 Test de fonctionnement

1. Ouvrez votre formulaire de contact
2. Vous devriez voir le widget reCAPTCHA
3. Complétez le formulaire et soumettez
4. Vérifiez les logs du serveur pour la validation

## 🔧 Types de reCAPTCHA

### reCAPTCHA v2 (Case à cocher)
- Interface visible avec case "Je ne suis pas un robot"
- Peut demander des défis supplémentaires (images)
- Plus familier pour les utilisateurs

### reCAPTCHA v3 (Recommandé)
- Analyse invisible en arrière-plan
- Score de 0.0 (bot) à 1.0 (humain)
- Expérience utilisateur fluide
- Protection plus avancée

## 🚨 Sécurité

### Validation côté serveur
- ✅ Toujours valider le token côté serveur
- ✅ Vérifier le score pour reCAPTCHA v3
- ✅ Gérer les erreurs de validation
- ✅ Logger les tentatives suspectes

### Bonnes pratiques
- 🔒 Ne jamais exposer la clé secrète
- 🔄 Régénérer les clés si compromises
- 📊 Monitorer les scores reCAPTCHA v3
- 🛡️ Combiner avec d'autres protections (rate limiting)

## 🐛 Dépannage

### Erreur "Configuration reCAPTCHA manquante"
- Vérifiez que `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` est définie
- Redémarrez le serveur après modification des variables

### Erreur de validation côté serveur
- Vérifiez que `RECAPTCHA_SECRET_KEY` est correcte
- Vérifiez que le domaine est autorisé dans la console reCAPTCHA

### Widget reCAPTCHA ne s'affiche pas
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que le domaine est autorisé
- Vérifiez la connectivité internet

## 📚 Ressources

- [Documentation officielle reCAPTCHA](https://developers.google.com/recaptcha)
- [Console d'administration reCAPTCHA](https://www.google.com/recaptcha/admin)
- [Guide de migration v2 vers v3](https://developers.google.com/recaptcha/docs/v3)