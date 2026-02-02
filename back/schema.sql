-- Schéma D1 pour artchive (équivalent Supabase)
-- À exécuter dans la console D1 ou via: wrangler d1 execute artchive --remote --file=./schema.sql

-- Artistes (ex-authors)
CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  twitter TEXT,
  instagram TEXT,
  shop TEXT
);

-- Images : id = clé objet R2, author = id dans authors
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL REFERENCES authors(id)
);

CREATE INDEX IF NOT EXISTS idx_images_author ON images(author);
