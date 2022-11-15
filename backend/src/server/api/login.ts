import { FastifyPluginAsync } from 'fastify';

import { WithDatabase } from '../plugins';

const loginOpts = {
  schema: {
    querystring: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

export const handleLogin: FastifyPluginAsync<WithDatabase> = async (
  app,
  { database },
) => {
  app.get('/login', loginOpts, async (request, reply) => {
    // TODO
    // @ts-expect-error - query is not typed
    const { email, password } = request.query;

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
