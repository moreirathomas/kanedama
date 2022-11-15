import { Knex } from 'knex';

export type WithDatabase = {
  database: Knex;
};
