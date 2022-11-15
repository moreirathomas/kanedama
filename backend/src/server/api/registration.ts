import { FastifyPluginAsync } from 'fastify';

import { parseUser } from '../../user';
import { isFailure } from '../../validation';
import { WithDatabase } from '../plugins';

const registrationOpts = {
  schema: {
    querystring: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

export const handleRegistration: FastifyPluginAsync<WithDatabase> = async (
  app,
  { database },
) => {
  app.get('/registration', registrationOpts, async (request, reply) => {
    // TODO
    // @ts-expect-error - query is not typed
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
