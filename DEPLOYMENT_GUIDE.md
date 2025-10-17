# Guide de déploiement MoodFlow

## Option 1: Déploiement complet sur Railway

### Prérequis
- Compte Railway (https://railway.app)
- Railway CLI installé (`npm install -g @railway/cli`)
- Repository Git pushé sur GitHub

### Étapes de déploiement

#### 1. Déployer le Backend sur Railway

```bash
# Dans le dossier mood-tracker-backend-api
cd mood-tracker-backend-api

# Login Railway
railway login

# Créer un nouveau projet
railway new

# Lier au projet (sélectionner le projet créé)
railway link

# Ajouter les variables d'environnement
railway env set NODE_ENV=production
railway env set JWT_SECRET=votre-jwt-secret-super-securise-changez-moi
railway env set DB_TYPE=sqlite
railway env set DB_DATABASE=./database/production.db

# Déployer
railway up
```

**Note importante**: Après le déploiement, Railway vous donnera une URL comme `https://votre-app-backend.railway.app`. 

#### 2. Déployer le Frontend sur Railway

```bash
# Dans le dossier mood-tracker-app  
cd mood-tracker-app

# Créer un nouveau projet pour le frontend
railway new

# Lier au projet
railway link

# Configurer l'URL du backend (remplacer par votre URL Railway backend)
railway env set VITE_API_URL=https://votre-app-backend.railway.app

# Déployer
railway up
```

#### 3. Configurer CORS dans le backend

Après avoir obtenu l'URL du frontend, ajoutez-la au backend :

```bash
# Dans le dossier backend
railway env set CORS_ORIGIN=https://votre-app-frontend.railway.app
```

### Problèmes courants et solutions

1. **Erreur de build**: Vérifiez que toutes les dépendances sont dans `package.json`
2. **Erreur CORS**: Assurez-vous que l'URL frontend est dans les origines autorisées
3. **Variables d'environnement**: Vérifiez avec `railway env` que toutes les variables sont définies

---

## Option 2: Frontend Vercel + Backend Railway (Recommandé)

### Pourquoi cette option ?
- Vercel est optimisé pour les applications React/Vite
- Railway est parfait pour les backends Node.js
- Séparation claire des responsabilités
- Déploiement automatique via Git

### Déploiement Backend sur Railway

1. **Préparer le backend**
```bash
cd mood-tracker-backend-api
```

2. **Créer le projet Railway**
- Aller sur https://railway.app
- "New Project" → "Deploy from GitHub repo"
- Sélectionner votre repository MoodFlow
- Choisir le dossier `mood-tracker-backend-api`

3. **Configurer les variables d'environnement dans Railway**
```
NODE_ENV=production
JWT_SECRET=votre-jwt-secret-super-securise-changez-moi
DB_TYPE=sqlite
DB_DATABASE=./database/production.db
```

4. **Noter l'URL générée** (ex: `https://moodflow-backend-production.railway.app`)

### Déploiement Frontend sur Vercel

1. **Préparer le frontend**
```bash
cd mood-tracker-app
```

2. **Installer Vercel CLI**
```bash
npm i -g vercel
```

3. **Déployer sur Vercel**
```bash
vercel
```

4. **Configurer les variables d'environnement sur Vercel**
- Aller sur votre dashboard Vercel
- Sélectionner votre projet
- Settings → Environment Variables
- Ajouter: `VITE_API_URL` = `https://votre-backend.railway.app`

5. **Redéployer**
```bash
vercel --prod
```

### Finaliser la configuration CORS

1. **Mettre à jour le backend avec l'URL Vercel**
```bash
# Dans Railway dashboard, ajouter:
CORS_ORIGIN=https://votre-app.vercel.app
```

---

## Option 3: Déploiement local avec Docker

### Pour tester localement

```bash
# À la racine du projet
docker-compose up --build
```

### Pour déployer sur un serveur

1. **Modifier docker-compose.yml** avec les vraies URLs de production
2. **Uploader sur votre serveur**
3. **Exécuter**:
```bash
docker-compose up -d --build
```

---

## Variables d'environnement importantes

### Frontend (.env.production)
```
VITE_API_URL=https://votre-backend.railway.app
VITE_AUTH_MODE=real
```

### Backend (Variables Railway/Vercel)
```
NODE_ENV=production
JWT_SECRET=votre-jwt-secret-super-securise-changez-moi
DB_TYPE=sqlite
DB_DATABASE=./database/production.db
CORS_ORIGIN=https://votre-frontend.vercel.app
```

---

## Checklist de déploiement

- [ ] Backend déployé et accessible
- [ ] Variables d'environnement backend configurées
- [ ] URL backend notée et configurée dans le frontend
- [ ] Frontend déployé
- [ ] CORS configuré avec l'URL frontend
- [ ] Test de connexion frontend ↔ backend
- [ ] Test de l'authentification
- [ ] Test des fonctionnalités principales

---

## Support et dépannage

### Logs Backend (Railway)
```bash
railway logs
```

### Logs Frontend (Vercel)
Accessible depuis le dashboard Vercel → Functions

### Test de connectivité
```bash
curl https://votre-backend.railway.app/api/v1/moods
```