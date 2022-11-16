import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';

import { userRepository } from '../features/user';
import { handleRegistration, handleLogin } from './api';
import { handleHealthCheck } from './health';

export function registerRoutes(app: FastifyInstance, database: Knex) {
  app.register(handleHealthCheck);

  {
    const repository = userRepository(database);
    app.register(handleRegistration, { repository });
    app.register(handleLogin, { repository });
  }
}
