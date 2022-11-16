import { parseUser, ErrorParseUser } from './parse';

describe('User.name', () => {
  test('the name must be alphanumeric charaters', () => {
    const actual = parseUser({
      name: "@!Al-ice',",
      email: 'alice@hey.com',
      password: 'password1234',
    });

    expect(actual.isLeft()).toEqual(true);
    expect((actual.value as ErrorParseUser).name).toEqual([
      'must be alphanumeric',
    ]);
  });

  test('the name length must be in [4, 50]', () => {
    const testCases = ['Al', 'Alice'.repeat(11)];

    testCases.forEach((name) => {
      const actual = parseUser({
        name,
        email: 'alice@hey.com',
        password: 'password1234',
      });

      expect(actual.isLeft()).toEqual(true);
      expect((actual.value as ErrorParseUser).name).toEqual([
        'must be between 4 and 50 characters',
      ]);
    });
  });
});

describe('User.email', () => {
  test('the email must be alphanumeric charaters and contain a single @ symbol', () => {
    const testCases = [
      '!al-ice.@h,ey.com',
      'alicehey.com',
      'alice@hey@hey.com',
    ];

    testCases.forEach((email) => {
      const actual = parseUser({
        name: 'Alice',
        email,
        password: 'password1234',
      });

      expect(actual.isLeft()).toEqual(true);
      expect((actual.value as ErrorParseUser).email).toEqual([
        'must be alphanumeric and contain a single @ symbol',
      ]);
    });
  });

  test('the email length must be < 256', () => {
    const actual = parseUser({
      name: 'Alice',
      email: `${'alice'.repeat(100)}@hey.com`,
      password: 'password1234',
    });

    expect(actual.isLeft()).toEqual(true);
    expect((actual.value as ErrorParseUser).email).toEqual([
      'must be between 0 and 256 characters',
    ]);
  });
});

describe('User.password', () => {
  test('the password must be alphanumeric charaters', () => {
    const actual = parseUser({
      name: 'Alice',
      email: 'alice@hey.com',
      password: '@&password!12-34,',
    });

    expect(actual.isLeft()).toEqual(true);
    expect((actual.value as ErrorParseUser).password).toEqual([
      'must be alphanumeric',
    ]);
  });

  test('the password length must be in [8, 255]', () => {
    const testCases = ['1234', '1234'.repeat(100)];

    testCases.forEach((password) => {
      const actual = parseUser({
        name: 'Alice',
        email: 'alice@hey.com',
        password,
      });

      expect(actual.isLeft()).toEqual(true);
      expect((actual.value as ErrorParseUser).password).toEqual([
        'must be between 8 and 255 characters',
      ]);
    });
  });
});

describe('(happy path)', () => {
  test('returns a valid user', () => {
    const actual = parseUser({
      name: 'Alice',
      email: 'alice@hey.com',
      password: 'password1234',
    });

    const expected = {
      name: 'Alice',
      email: 'alice@hey.com',
      password: 'password1234',
    };

    expect(actual.isLeft()).toEqual(false);
    expect(actual.value).toEqual(expected);
  });
});
