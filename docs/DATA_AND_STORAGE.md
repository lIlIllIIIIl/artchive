# Données & stockage (R2 + base de données)

## Situation actuelle

- **R2 (Cloudflare)** : stockage des images (clé = identifiant fichier).
- **D1 (Cloudflare)** : base SQLite edge ; tables `images` (id = clé R2, author → authors) et `authors` (id, name, twitter, instagram, shop). Schéma dans `back/schema.sql`.
- **Lien** : la clé de l’objet R2 = `images.id` en base. Le back interroge D1 via l’API REST Cloudflare (voir `back/d1.ts`).

---

## Autres bases (si tu changes plus tard)

| Solution               | Type            | Avantages                                                                       | Inconvénients                                                                                            |
| ---------------------- | --------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Cloudflare D1**      | SQLite (edge)   | Même écosystème que R2, pas de sleep, 5M lectures/jour gratuites, scale-to-zero | Hébergement back sur Workers ou autre (ton Fastify peut appeler D1 via HTTP ou en déployant sur Workers) |
| **Turso**              | libSQL (SQLite) | Gratuit, pas de sleep long (scale-to-zero ~1h), API type Postgres               | Un service en plus à gérer                                                                               |
| **Neon**               | Postgres        | Plan gratuit avec peu de sleep, réveil rapide par requête                       | Peut avoir un court délai au réveil                                                                      |
| **SQLite local / VPS** | Fichier SQLite  | Contrôle total, pas de sleep si le serveur tourne                               | Tu gères le serveur et les sauvegardes                                                                   |

**D1** est utilisé par défaut : même compte que R2, pas de sleep, 5M lectures/jour en gratuit.

---

## Architecture (R2 + D1)

- **Source de vérité** : la table `images` en D1 (id = clé R2, author → authors).
- **R2** : uniquement pour générer les URLs signées des clés connues en base.
- **Flux** : `GET /images-with-authors?limit=20&offset=0` → lecture D1 (images + auteurs) → URLs signées R2 → réponse `{ images: [{ url, id, author }], nextOffset }`.
- **Front** : une requête par page, auteur déjà dans chaque image (pas d’appel au clic).

---

## Schéma de données (inchangé conceptuellement)

```
authors          images
---------        ---------
id (PK)          id (PK) = clé objet R2
name             author (FK → authors.id)
twitter
instagram
shop
```

Le schéma D1 est dans `back/schema.sql`. Pour créer la base : dashboard Cloudflare → D1 → Create database, puis exécuter le SQL (ou `wrangler d1 execute <db> --remote --file=back/schema.sql`).
