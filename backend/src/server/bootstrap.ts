import { fastify } from 'fastify';
import { Knex } from 'knex';

import { registerRoutes } from './routes';

interface Options {
  port: number;
  logger: boolean;
}

export function start(opts: Options, databaseConnection: Knex) {
  const app = fastify({ logger: opts.logger });

  registerRoutes(app, databaseConnection);

  return app.listen({ port: opts.port });
}
