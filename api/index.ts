import '../back/load-env.js';

export const config = { runtime: 'nodejs' };

export default {
  fetch(_req: Request) {
    return Response.json({ status: 'ok', service: 'artchive-api' });
  },
};
