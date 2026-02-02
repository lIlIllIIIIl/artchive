import '../back/load-env.js';
import { getArtist } from '../back/handlers.js';

export const config = { runtime: 'nodejs' };

export default {
  async fetch(req: Request) {
    if (req.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
      const url = new URL(req.url);
      const name = url.searchParams.get('artist') ?? undefined;
      const data = await getArtist(name);
      return Response.json(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[api/artist]', msg);
      return Response.json(
        { error: 'Erreur lors de la récupération des données artiste', detail: msg },
        { status: 500 }
      );
    }
  },
};
