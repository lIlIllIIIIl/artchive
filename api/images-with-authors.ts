import '../back/load-env.js';
import { getImagesWithAuthors, parseExcludeIds } from '../back/handlers.js';

export const config = { runtime: 'nodejs' };

export default {
  async fetch(req: Request) {
    if (req.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
      const url = new URL(req.url);
      const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 50);
      const excludeParam = url.searchParams.get('exclude') ?? undefined;
      const excludeIds = parseExcludeIds(excludeParam);
      const data = await getImagesWithAuthors(limit, excludeIds);
      return Response.json(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[api/images-with-authors]', msg);
      return Response.json(
        { error: 'Erreur lors de la récupération des images', detail: msg },
        { status: 500 }
      );
    }
  },
};
