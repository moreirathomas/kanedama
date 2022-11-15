import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';
import { DatabaseError } from 'pg';

import { parseUser } from '../../user';
import { isFailure } from '../../validation';
import { WithDatabase } from '../plugins';

const schema = {
  body: {
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
    .post('/users', { schema }, async (request, reply) => {
      const { name, email, password } = request.body;

      const userRes = parseUser({ name, email, password });

      if (isFailure(userRes)) {
        app.log.warn(userRes);
        reply.status(400);
        return {
          error: 'Validation failed',
          reasons: userRes.error,
        };
      }

      try {
        await database('persons').insert(userRes);
      } catch (error) {
        app.log.error(error);

        if (error instanceof DatabaseError && error.code === '23505') {
          reply.status(409);
          return {
            error: 'Email or name already taken',
          };
        }

        reply.status(500);
        return { error: 'Internal server error' };
      }

      reply.status(201);
      return userRes;
    });
};
