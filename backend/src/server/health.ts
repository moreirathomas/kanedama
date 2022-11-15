import { FastifyPluginAsync } from 'fastify';

export const handleHealthCheck: FastifyPluginAsync = async (app) => {
  app.get('/healthz', async (request, reply) => {
    reply.status(200).send();
  });
};
