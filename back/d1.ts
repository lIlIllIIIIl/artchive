/**
 * Client D1 via l’API REST Cloudflare.
 * Nécessite CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, D1_DATABASE_ID dans back/.env
 */

const ACCOUNT_ID = (process.env.CLOUDFLARE_ACCOUNT_ID ?? '').trim();
const API_TOKEN = (process.env.CLOUDFLARE_API_TOKEN ?? '').trim();
const DATABASE_ID = (process.env.D1_DATABASE_ID ?? '').trim();

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}`;

function checkConfig(): void {
  const missing: string[] = [];
  if (!ACCOUNT_ID) missing.push('CLOUDFLARE_ACCOUNT_ID');
  if (!API_TOKEN) missing.push('CLOUDFLARE_API_TOKEN');
  if (!DATABASE_ID) missing.push('D1_DATABASE_ID');
  if (missing.length) {
    throw new Error(`D1: variables manquantes dans back/.env : ${missing.join(', ')}`);
  }
}

export type D1Row = Record<string, unknown>;

interface D1QueryResponse {
  result: Array<{
    results?: D1Row[];
    success: boolean;
    meta?: Record<string, unknown>;
  }>;
  success: boolean;
  errors?: Array<{ message: string }>;
}

/**
 * Exécute une requête SQL paramétrée sur D1.
 * @param sql - Requête avec ? pour les paramètres
 * @param params - Valeurs pour les paramètres
 * @returns Les lignes retournées (tableau d’objets)
 */
export async function query<T extends D1Row = D1Row>(
  sql: string,
  params: (string | number)[] = []
): Promise<T[]> {
  checkConfig();

  const res = await fetch(`${BASE}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const json = (await res.json()) as D1QueryResponse;

  if (!res.ok || !json.success) {
    const msg = json.errors?.[0]?.message ?? res.statusText ?? 'D1 query failed';
    const detail = JSON.stringify(json.errors ?? json).slice(0, 200);
    throw new Error(`D1: ${msg}${detail ? ` (${detail})` : ''}`);
  }

  const first = json.result?.[0];
  const results = first?.results ?? [];
  return results as T[];
}
