import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';

import { WithUserRepository } from '../plugins';

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

export const handleLogin: FastifyPluginAsync<WithUserRepository> = async (
  app,
  { repository },
) => {
  app
    .withTypeProvider<JsonSchemaToTsProvider>()
    .post('/login', { schema }, async (request, reply) => {
      const { email, password } = request.body;

      const user = await repository.findOne({ email, password });

      if (user.isLeft()) {
        switch (user.value) {
          case 'NOT_FOUND':
            reply.status(401);
            return {
              error: 'Email or password is incorrect',
            };
          default:
            reply.status(500);
            return {
              error: 'Internal server error',
            };
        }
      }

      reply.status(200);
      return { name: user.value.name };
    });
};
