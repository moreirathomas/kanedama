import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';

import { WithDatabase } from '../plugins';

const schema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
  },
} as const;

export const handleLogin: FastifyPluginAsync<WithDatabase> = async (
  app,
  { database },
) => {
  app
    .withTypeProvider<JsonSchemaToTsProvider>()
    .post('/login', { schema }, async (request, reply) => {
      const { email, password } = request.body;

      try {
        const res = await database('persons')
          .where({
            email,
            password,
          })
          .first('name');

        if (!res) {
          reply.status(401);
          app.log.warn('Invalid email or password');
          return { error: 'Invalid email or password' };
        }

        reply.status(200);
        return res;
      } catch (error) {
        reply.status(500);
        app.log.error(error);
        return { error: 'Internal server error' };
      }
    });
};
