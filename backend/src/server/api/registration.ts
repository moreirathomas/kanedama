import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';

import { parseUser } from '../../user';
import { isFailure } from '../../validation';
import { WithDatabase } from '../plugins';

const schema = {
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['name', 'email', 'password'],
  },
} as const;

export const handleRegistration: FastifyPluginAsync<WithDatabase> = async (
  app,
  { database },
) => {
  app
    .withTypeProvider<JsonSchemaToTsProvider>()
    .get('/registration', { schema }, async (request, reply) => {
      const { name, email, password } = request.query;

      const res = parseUser({ name, email, password });
      if (isFailure(res)) {
        reply.status(400);
        app.log.warn(res.error);
        return { error: res.error };
      }

      try {
        await database('persons').insert(res);
      } catch (error) {
        reply.status(500);
        app.log.error(error);
        return { error: 'Internal server error' };
      }

      reply.status(201);
      return res;
    });
};
