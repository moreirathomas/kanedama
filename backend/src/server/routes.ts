import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';

import { parseUser } from '../user';
import { isFailure } from '../validation';

export function registerRoutes(app: FastifyInstance, database: Knex) {
  app.get('/healthz', async (request, reply) => {
    reply.status(200).send();
  });

  const registrationOpts = {
    schema: {
      querystring: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  };
  app.get('/registration', registrationOpts, async (request, reply) => {
    // TODO
    // @ts-expect-error - query is not typed
    const { name, email, password } = request.query;

    const res = parseUser({ name, email, password });
    if (isFailure(res)) {
      reply.status(400);
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

  const loginOpts = {
    schema: {
      querystring: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  };
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

      reply.status(200);
      return res;
    } catch (error) {
      reply.status(404);
      app.log.error(error);
      return { error: 'Not found' };
    }
  });
}
