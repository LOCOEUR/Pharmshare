# PharmShare - Plateforme de Gestion de Pharmacie

PharmShare est une application web moderne permettant aux pharmacies de gérer leur inventaire, d'analyser leurs performances et de faciliter les échanges de produits entre partenaires.

## Structure du Projet

- `/api` : Backend PHP (API RESTful + Base de données MySQL)
- `/pharmshare` : Frontend React (Vite + CSS Vanilla)

## Installation Locale (Développement)

### 1. Backend (PHP)
1. Assurez-vous d'avoir **XAMPP**, **WAMP** ou **Laragon** installé.
2. Clonez ce projet dans votre dossier serveur (ex: `htdocs/Pharmshare`).
3. Importez la base de données via phpMyAdmin (voir fichier `schema.sql` ou export SQL).
4. Configurez les accès dans `api/config/database.php`.

### 2. Frontend (React)
1. Ouvrez le dossier `/pharmshare` dans votre terminal.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application :
   ```bash
   npm run dev
   ```

## Déploiement

### Frontend
Hébergez le contenu du dossier `/pharmshare` sur **Vercel** ou **Netlify**.
Pensez à mettre à jour l'URL de l'API dans `src/services/api.js`.

### Backend
Hébergez le dossier `/api` sur un serveur compatible PHP (mutualisé ou VPS).
Configurez les variables d'environnement sur votre serveur pour la base de données :
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

## Sécurité
- HTTPS est requis en production pour sécuriser les tokens JWT.
- Les identifiants de base de données ne sont pas versionnés (utilisez les variables d'environnement).
