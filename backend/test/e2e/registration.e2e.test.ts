/// <reference lib="dom" />

const url = 'http://localhost:3000/registration';

describe('Login', () => {
  test('(happy path) can register with a name, a valid email, a valid password', async () => {
    const user = {
      name: 'Alice',
      email: 'alice@hey.com',
      password: 'password1234567890',
    };

    const res = await fetch(
      `${url}?name=${user.name}&email=${user.email}&password=${user.password}`,
    );

    expect(res.status).toBe(201);

    const actual = await res.json();
    const expected = user;
    expect(actual).toEqual(expected);
  });

  test('returns the list of failed validations if invalid values are provided', async () => {
    const user = {
      name: '@Alice!',
      email: 'bademail',
      password: '123',
    };

    const res = await fetch(
      `${url}?name=${user.name}&email=${user.email}&password=${user.password}`,
    );

    expect(res.status).toBe(400);

    const actual = await res.json();
    const expected = {
      error: {
        name: ['must be alphanumeric'],
        email: ['must be alphanumeric and contain a single @ symbol'],
        password: ['must be between 8 and 255 characters'],
      },
    };
    expect(actual).toEqual(expected);
  });
});

// Make the file a module to compile under '--isolatedModules'.
export {};
