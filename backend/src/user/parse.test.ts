import { Failure, isFailure } from '../validation';
import { parseUser, ErrorParseUser } from './parse';

describe('User validation', () => {
  describe('User.name', () => {
    test('the name must be alphanumeric charaters', () => {
      const actual = parseUser({
        name: "@!Al-ice',",
        email: 'alice@hey.com',
        password: 'password1234',
      });

      expect(isFailure(actual)).toEqual(true);
      expect((actual as Failure<ErrorParseUser>).error.name).toContainEqual(
        'must be alphanumeric',
      );
    });

    test('the name length must be in [4, 50]', () => {
      const testCases = ['Al', 'Alice'.repeat(11)];

      testCases.forEach((name) => {
        const actual = parseUser({
          name,
          email: 'alice@hey.com',
          password: 'password1234',
        });

        expect(isFailure(actual)).toEqual(true);
        expect((actual as Failure<ErrorParseUser>).error.name).toContainEqual(
          'must be between 4 and 50 characters',
        );
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

        expect(isFailure(actual)).toEqual(true);
        expect((actual as Failure<ErrorParseUser>).error.email).toContainEqual(
          'must be alphanumeric and contain a single @ symbol',
        );
      });
    });

    test('the email length must be < 256', () => {
      const actual = parseUser({
        name: 'Alice',
        email: `${'alice'.repeat(100)}@hey.com`,
        password: 'password1234',
      });

      expect(isFailure(actual)).toEqual(true);
      expect((actual as Failure<ErrorParseUser>).error.email).toContainEqual(
        'must be between 0 and 256 characters',
      );
    });
  });

  describe('User.password', () => {
    test('the password must be alphanumeric charaters', () => {
      const actual = parseUser({
        name: 'Alice',
        email: 'alice@hey.com',
        password: '@&password!12-34,',
      });

      expect(isFailure(actual)).toEqual(true);
      expect((actual as Failure<ErrorParseUser>).error.password).toContainEqual(
        'must be alphanumeric',
      );
    });

    test('the password length must be in [8, 255]', () => {
      const testCases = ['1234', '1234'.repeat(100)];

      testCases.forEach((password) => {
        const actual = parseUser({
          name: 'Alice',
          email: 'alice@hey.com',
          password,
        });

        expect(isFailure(actual)).toEqual(true);
        expect(
          (actual as Failure<ErrorParseUser>).error.password,
        ).toContainEqual('must be between 8 and 255 characters');
      });
    });
  });

  test('(happy path) returns a valid user', () => {
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

    expect(isFailure(actual)).toEqual(false);
    expect(actual).toEqual(expected);
  });
});
