/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const dotenv = require('dotenv');
const knex = require('knex');

const ENV_FILE = path.join(__dirname, '..', '.env.dev');

const { parsed: config } = dotenv.config({ path: ENV_FILE });

if (!config) {
  throw new Error(`Unable to load environment variables from ${ENV_FILE}`);
}

/**
 * @type {import('knex').Knex}
 */
const pg = knex({
  client: config.DB_CLIENT,
  connection: {
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  },
  searchPath: JSON.parse(config.DB_SEARCH_PATH),
});

const query = `CREATE TABLE Persons (
    PersonID int,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    city varchar(255)
);`;

async function migrate() {
  console.log('migrating 🚀');
  try {
    await pg.raw(query);
    console.log('migration successful');
  } catch (error) {
    console.error(error);
  } finally {
    await pg.destroy();
    console.log('connection closed');
  }
}

migrate();
