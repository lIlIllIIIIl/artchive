import './load-env.js';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { getArtist, getAllArtists, getImagesWithAuthors, parseExcludeIds } from './handlers.js';

const server = fastify();
await server.register(cors, { origin: true });

server.get('/', async (_request, _reply) => ({ status: 'ok', service: 'artchive-api' }));

server.get('/artist', async (request: any, reply) => {
  try {
    const name = request.query['artist'];
    return await getArtist(name);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[artist]', msg);
    reply.status(500).send({ error: 'Erreur lors de la récupération des données artiste', detail: msg });
  }
});

server.get('/allArtists', async (_request, reply) => {
  try {
    return await getAllArtists();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[allArtists]', msg);
    reply.status(500).send({ error: 'Erreur lors de la récupération des artistes', detail: msg });
  }
});

server.get('/images-with-authors', async (request: any, reply) => {
  try {
    const limit = Math.min(Number(request.query['limit']) || 20, 50);
    const excludeIds = parseExcludeIds(request.query['exclude']);
    return await getImagesWithAuthors(limit, excludeIds);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[images-with-authors]', msg);
    reply.status(500).send({ error: 'Erreur lors de la récupération des images', detail: msg });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Serveur démarré sur http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
