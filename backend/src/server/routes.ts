import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';

import { handleRegistration, handleLogin } from './api';
import { handleHealthCheck } from './health';

export function registerRoutes(app: FastifyInstance, database: Knex) {
  app.register(handleHealthCheck);
  app.register(handleRegistration, { database });
  app.register(handleLogin, { database });
}
