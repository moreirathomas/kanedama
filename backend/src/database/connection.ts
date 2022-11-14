import { Knex, knex } from 'knex';

let done = false;
let database: Knex;

export function connect(config: Knex.Config): Knex {
  if (!done) {
    database = knex(config);
    done = true;
  }

  return database;
}
