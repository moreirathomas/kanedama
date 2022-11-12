import { ok } from 'assert';

import Fastify from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'password',
    searchPath: ['knex', 'public'],
  },
});

async function insert() {
  console.log('migrating 🚀');
  try {
    await pg.raw(`CREATE TABLE Persons (
    PersonID int,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    city varchar(255)
);`);
  } catch (error) {
    console.info(error);
  }
}
insert();

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
    handler: async (request, reply) => {
      ok(
        // @ts-expect-error - will be fixed
        (request.query['name'].length > 4 &&
          // @ts-expect-error - will be fixed
          request.query['name'].length < 50) ||
          // @ts-expect-error - will be fixed
          (request.query['email'].includes('@') &&
            // @ts-expect-error - will be fixed
            request.query['email'].length < 256),
      );
      pg('persons').insert(request.query).then(reply.send({}));
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
    handler: (request, reply) =>
      pg('persons')
        .where({
          // @ts-expect-error - will be fixed
          email: request.query['email'],
          // @ts-expect-error - will be fixed
          password: request.query['password'],
        })
        .first('name')
        // @ts-expect-error - will be fixed
        .then((result) => {
          reply.send(result);
        }),
  })
  .listen(3000);

console.log('server started 🚀');
