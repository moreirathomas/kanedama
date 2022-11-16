import { Knex } from 'knex';

import { connect } from './database';
import { getEnv, getEnvInteger, getEnvArray } from './lib/env';
import { start } from './server';

async function main() {
  const PORT = getEnvInteger('PORT');

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

  const pg = connect(config);

  await start({ port: PORT, logger: true }, pg);
}

main().catch(console.error);
