import '../back/load-env.js';
import { getAllArtists } from '../back/handlers.js';

export const config = { runtime: 'nodejs' };

export default {
  async fetch(_req: Request) {
    if (_req.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
      const data = await getAllArtists();
      return Response.json(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[api/allArtists]', msg);
      return Response.json(
        { error: 'Erreur lors de la récupération des artistes', detail: msg },
        { status: 500 }
      );
    }
  },
};
