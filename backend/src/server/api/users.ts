import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';

import { parseUser } from '../../features/user';
import { WithUserRepository } from '../plugins';

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

export const handleRegistration: FastifyPluginAsync<
  WithUserRepository
> = async (app, { repository }) => {
  app
    .withTypeProvider<JsonSchemaToTsProvider>()
    .post('/users', { schema }, async (request, reply) => {
      const { name, email, password } = request.body;

      const parsedUser = parseUser({ name, email, password });

      if (parsedUser.isLeft()) {
        app.log.warn(parsedUser);
        reply.status(400);
        return {
          error: 'Validation failed',
          reasons: parsedUser.value,
        };
      }

      const createdUser = await repository.createOne(parsedUser.value);

      if (createdUser.isLeft()) {
        switch (createdUser.value) {
          case 'UNIQUE_VIOLATION':
            reply.status(409);
            return {
              error: 'Email or name already taken',
            };
          default:
            reply.status(500);
            return {
              error: 'Internal server error',
            };
        }
      }
      reply.status(201);
    });
};
