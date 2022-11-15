/// <reference lib="dom" />

const url = 'http://localhost:3000/users';

describe('Login', () => {
  test('(happy path) can register with a name, a valid email, a valid password', async () => {
    const user = {
      name: 'Alice',
      email: 'alice@hey.com',
      password: 'password1234567890',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    expect(res.status).toBe(201);

    const actual = await res.json();
    const expected = user;
    expect(actual).toEqual(expected);
  });

  test('returns 409 if the email or name is already taken', async () => {
    const user = {
      name: 'BobWithTheLongName',
      email: 'bob@hey.com',
      password: 'password1234567890',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    expect(res.status).toBe(201);

    const res2 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    expect(res2.status).toBe(409);
  });

  test('returns 400 and the list of failed validations if invalid values are provided', async () => {
    const user = {
      name: '@Alice!',
      email: 'bademail',
      password: '123',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    expect(res.status).toBe(400);

    const actual = await res.json();
    const expected = {
      error: 'Validation failed',
      reasons: {
        name: ['must be alphanumeric'],
        email: ['must be alphanumeric and contain a single @ symbol'],
        password: ['must be between 8 and 255 characters'],
      },
    };
    expect(actual).toEqual(expected);
  });

  test('returns 400 if the parameters are missing or incorrect', async () => {
    const user = {
      email: 'alice@hey.com',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    expect(res.status).toBe(400);
  });
});

// Make the file a module to compile under '--isolatedModules'.
export {};
