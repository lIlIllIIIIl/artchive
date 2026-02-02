import { query } from './d1.js';
import { signR2Key } from './r2.js';

export function parseExcludeIds(excludeParam: string | undefined): string[] {
  if (!excludeParam || typeof excludeParam !== 'string') return [];
  return excludeParam
    .split(',')
    .map((s) => s.trim())
    .filter((id) => id.length > 0 && id.length < 512 && !/[;'"\\]/.test(id));
}

export async function getArtist(name: string | undefined) {
  if (!name || typeof name !== 'string') return { artist: [], images: [] };

  const artistRows = await query<{ id: string; name: string; twitter: string; instagram: string; shop: string }>(
    'SELECT id, name, twitter, instagram, shop FROM authors WHERE LOWER(name) = LOWER(?)',
    [name]
  );
  if (!artistRows[0]) return { artist: [], images: [] };

  const imageRows = await query<{ id: string }>('SELECT id FROM images WHERE author = ?', [artistRows[0].id]);
  const imagesTab = imageRows.length
    ? await Promise.all(imageRows.map((row) => signR2Key(row.id)))
    : [];

  return { artist: artistRows, images: imagesTab };
}

export async function getAllArtists() {
  return query<{ id: string; name: string; twitter: string; instagram: string; shop: string }>(
    'SELECT id, name, twitter, instagram, shop FROM authors ORDER BY name'
  );
}

export async function getImagesWithAuthors(limit: number, excludeIds: string[]) {
  const placeholders = excludeIds.length > 0 ? excludeIds.map(() => '?').join(',') : null;
  const whereClause = placeholders ? `WHERE images.id NOT IN (${placeholders})` : '';
  const args = placeholders ? [...excludeIds, limit] : [limit];

  const rows = await query<{
    id: string;
    author_id: string;
    name: string;
    twitter: string;
    instagram: string;
    shop: string;
  }>(
    `SELECT images.id,
            authors.id AS author_id,
            authors.name,
            authors.twitter,
            authors.instagram,
            authors.shop
     FROM images
     LEFT JOIN authors ON images.author = authors.id
     ${whereClause}
     ORDER BY RANDOM()
     LIMIT ?`,
    args
  );

  if (!rows.length) {
    return { images: [], nextOffset: null };
  }

  const images = await Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      url: await signR2Key(row.id),
      author:
        row.author_id != null
          ? {
              id: row.author_id,
              name: row.name,
              twitter: row.twitter ?? '',
              instagram: row.instagram ?? '',
              shop: row.shop ?? '',
            }
          : null,
    }))
  );

  return {
    images,
    nextOffset: rows.length === limit ? excludeIds.length + rows.length : null,
  };
}
