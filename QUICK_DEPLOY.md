# 🚀 Guide de Déploiement Rapide - MoodFlow

## ⚡ Déploiement Recommandé (Vercel + Railway)

### 🎯 Étape 1: Déployer le Backend sur Railway

1. **Ouvrir Railway** → https://railway.app
2. **Nouveau Projet** → "Deploy from GitHub repo"
3. **Sélectionner** votre repo `MoodFlow-`
4. **Choisir le dossier** `mood-tracker-backend-api`
5. **Configurer les variables** dans Railway:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-me
   ```
6. **Noter l'URL** générée (ex: `https://moodflow-backend-production.railway.app`)

### 🎯 Étape 2: Déployer le Frontend sur Vercel

1. **Ouvrir Vercel** → https://vercel.com
2. **Import Project** → Connecter GitHub → Sélectionner `MoodFlow-`
3. **Configuration**:
   - Root Directory: `mood-tracker-app`
   - Framework Preset: Vite
4. **Variables d'environnement**:
   ```
   VITE_API_URL=https://VOTRE-URL-RAILWAY-BACKEND.railway.app
   ```
5. **Deploy** 🚀

### 🎯 Étape 3: Finaliser CORS

1. **Retourner sur Railway** (backend)
2. **Ajouter variable**:
   ```
   CORS_ORIGIN=https://votre-app.vercel.app
   ```
3. **Redéployer** le backend

### ✅ Test Final

Visitez votre URL Vercel → Testez login/register → Vérifiez que tout fonctionne !

---

## 🐳 Alternative: Déploiement Local avec Docker

```bash
# À la racine du projet
docker-compose up --build

# Votre app sera disponible sur:
# Frontend: http://localhost:80
# Backend: http://localhost:3000
```

---

## ⚠️ Variables d'Environnement Critiques

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://votre-backend.railway.app
```

### Backend (Railway Environment Variables)  
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://votre-frontend.vercel.app
```

---

## 🔧 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Erreur CORS | Vérifier `CORS_ORIGIN` dans Railway backend |
| 500 Backend | Vérifier les variables d'environnement Railway |
| Frontend ne charge pas | Vérifier `VITE_API_URL` dans Vercel |
| Auth ne fonctionne pas | Vérifier `JWT_SECRET` dans Railway |

---

## 📞 Support

1. **Logs Backend**: Railway Dashboard → Deployments → View Logs
2. **Logs Frontend**: Vercel Dashboard → Functions → View Logs  
3. **Test API**: `curl https://votre-backend.railway.app/`

**🎉 Une fois déployé, vous aurez une URL publique pour partager votre MoodFlow !**