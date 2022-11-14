import Fastify from 'fastify';
import { Knex } from 'knex';

import { connect, migrate } from './database';
import { parseUser } from './user';
import { isFailure } from './validation';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'password',
  },
  searchPath: ['knex', 'public'],
};

const pg = connect(config);

// TODO: migrate is async. Await it inside main.
// TODO: migrate may fail if the table already exists. Handle that case.
migrate(pg);

Fastify({})
  .route({
    method: 'GET',
    url: '/health',
    handler: async (request, response) => {
      response.send();
    },
  })
  .route({
    method: 'GET',
    url: '/registrtion',
    schema: {
      querystring: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    handler: (request, reply) => {
      // @ts-expect-error - query is not typed
      const { name, email, password } = request.query;

      const res = parseUser({ name, email, password });
      if (isFailure(res)) {
        reply.send({ error: res.error });
      } else {
        pg('persons')
          .insert(res)
          .then(() => reply.send({}));
      }
    },
  })
  .route({
    method: 'GET',
    url: '/login',
    schema: {
      querystring: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      },
    },
    handler: (request, reply) => {
      // @ts-expect-error - query is not typed
      const { email, password } = request.query;
      pg('persons')
        .where({
          email,
          password,
        })
        .first('name')
        .then((result) => {
          reply.send(result);
        });
    },
  })
  .listen(3000);

console.log('server started 🚀');
