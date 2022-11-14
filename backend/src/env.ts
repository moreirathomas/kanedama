/**
 * Retrieves the value of the environment variable named by the key.
 * @throws if the environment variable is not defined.
 */
export function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: '${key}'`);
  }
  return value;
}

/**
 * Retrieves the value of the environment variable named by the key as an integer.
 * @throws if the environment variable is not defined or not an integer.
 */
export function getEnvInteger(key: string): number {
  const value = getEnv(key);
  return parseInteger(value);
}

function parseInteger(value: string): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`not a number: ${value}`);
  }
  if (!Number.isInteger(n)) {
    throw new Error(`not an integer: ${n}`);
  }
  return n;
}

/**
 * Retrieves the value of the environment variable named by the key as an array.
 * @throws if the environment variable is not defined or not an array.
 */
export function getEnvArray(key: string): string[] {
  const value = getEnv(key);
  return parseStringArray(value);
}

function parseStringArray(value: string): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    throw new Error(`Invalid JSON: '${value}'`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`Not an array: ${JSON.stringify(parsed)}`);
  }
  if (parsed.some((v) => typeof v !== 'string')) {
    throw new Error(`Not an array of strings: ${JSON.stringify(parsed)}`);
  }
  return parsed;
}

// const config: Knex.Config = {
//     client: getEnv('DB_CLIENT'),
//     connection: {
//       host: getEnv('DB_HOST'),
//       port: getEnvInteger('DB_PORT'),
//       user: getEnv('DB_USER'),
//       password: getEnv('DB_PASSWORD'),
//     },
//     searchPath: getEnvArray('DB_SEARCH_PATH'),
//   };
