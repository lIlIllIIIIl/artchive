# Artchive

Projet monorepo : frontend Vue/Vite et backend Fastify dans un même dépôt.

## Structure

- **`back/`** — API Fastify (Supabase, S3/R2). Port 3000.
- **`front/`** — Application Vue 3 + Vite + Vue Router.

## Démarrage

```bash
# Installer les dépendances (racine + workspaces)
npm install

# Lancer le back et le front en parallèle
npm run dev
```

- Back : http://localhost:3000
- Front : http://localhost:5173 (ou autre port affiché par Vite)

## Scripts

| Commande            | Description               |
| ------------------- | ------------------------- |
| `npm run dev`       | Lance le back et le front |
| `npm run dev:back`  | Lance uniquement l’API    |
| `npm run dev:front` | Lance uniquement le front |
| `npm run build`     | Build du front            |
| `npm run preview`   | Prévisualisation du build |

## Configuration

- **Back** : créer `back/.env` avec :
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (R2)
  - `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `D1_DATABASE_ID` (D1)
  - optionnel : `R2_BUCKET`, `R2_ENDPOINT` (voir `.env.example`)
  - Créer la base D1 et exécuter `back/schema.sql` (voir [Cloudflare D1](https://developers.cloudflare.com/d1/))
- **Front** : optionnel. `VITE_API_URL` (défaut `http://localhost:3000`) pour l’URL de l’API.

Voir `docs/DATA_AND_STORAGE.md` pour les alternatives à Supabase (D1, Turso) et l’architecture données + R2.

## Déploiement sur Vercel

Le projet est prêt pour un déploiement sur Vercel (front SPA + API serverless).

1. **Lier le dépôt** : [vercel.com](https://vercel.com) → New Project → importer le repo Git.
2. **Variables d’environnement** (Settings → Environment Variables) — à renseigner pour que l’API fonctionne :
   - **D1** : `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `D1_DATABASE_ID`
   - **R2** : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` ; optionnel : `R2_BUCKET`, `R2_ENDPOINT`
3. **Build** : Vercel utilise `vercel.json` (build du front, output `front/dist`, routes API dans `api/`).
4. **Front** : en production l’API est appelée en relatif (`/api/...`). Pour une autre origine, définir `VITE_API_URL`.

En local, le back Fastify reste sur le port 3000 ; en prod, les routes sont exposées sous `/api/*` via les serverless functions.
