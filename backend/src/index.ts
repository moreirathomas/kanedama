import { Knex } from 'knex';

import { connect } from './database';
import { getEnv, getEnvInteger, getEnvArray } from './env';
import { start } from './server';

const PORT = 3000;

const config: Knex.Config = {
  client: getEnv('DB_CLIENT'),
  connection: {
    host: getEnv('DB_HOST'),
    port: getEnvInteger('DB_PORT'),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
  },
  searchPath: getEnvArray('DB_SEARCH_PATH'),
};

async function main() {
  const pg = connect(config);

  const address = await start({ port: PORT, logger: true }, pg);
  console.log(`Server listening on ${address} 🚀`);
}

main().catch(console.error);
