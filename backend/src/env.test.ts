import { getEnv, getEnvArray, getEnvInteger } from './env';

describe('getEnv(key)', () => {
  const key = 'KEY';

  test('returns value of env var', () => {
    process.env[key] = 'VALUE';
    expect(getEnv(key)).toBe('VALUE');
  });

  test('throws when env var is not defined', () => {
    delete process.env[key];
    expect(() => getEnv(key)).toThrow();
  });
});

describe('getEnvInteger(key)', () => {
  const key = 'KEY';

  test('returns value of env var as integer', () => {
    process.env[key] = '1';
    expect(getEnvInteger(key)).toBe(1);
  });

  test('throws when env var is not defined', () => {
    delete process.env[key];
    expect(() => getEnvInteger(key)).toThrow();
  });

  test('throws when env var is not an integer', () => {
    const testCases = ['VALUE', '1.2'];
    testCases.forEach((value) => {
      process.env[key] = value;
      expect(() => getEnvInteger(key)).toThrow();
    });
  });
});

describe('getEnvArray(key)', () => {
  const key = 'KEY';

  test('returns value of env var as an array', () => {
    process.env[key] = '["VALUE", "VALUE"]';
    expect(getEnvArray(key)).toStrictEqual(['VALUE', 'VALUE']);
  });

  test('throws when env var is not defined', () => {
    delete process.env[key];
    expect(() => getEnvArray(key)).toThrow();
  });

  test('throws when env var is not an array of strings in JSON', () => {
    const testCases = ['VALUE', '{ "KEY" : "VALUE" }', '["VALUE", 1]'];
    testCases.forEach((testCase) => {
      process.env[key] = testCase;
      expect(() => getEnvArray(key)).toThrow();
    });
  });
});
