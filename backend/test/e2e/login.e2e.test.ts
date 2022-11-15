/// <reference lib="dom" />

const url = 'http://localhost:3000/login';

describe('Login', () => {
  test('(happy path) can login with the valid email and password combination', async () => {
    const login = {
      email: 'alice@hey.com',
      password: 'password1234567890',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    });

    expect(res.status).toBe(200);

    const actual = await res.json();
    const expected = { name: 'Alice' };
    expect(actual).toEqual(expected);
  });

  test('returns 401 if the email and password combination is incorrect', async () => {
    const login = {
      email: 'bademail@hey.com',
      password: '123',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    });

    expect(res.status).toBe(401);
  });

  test('returns 400 if the parameters are missing or incorrect', async () => {
    const login = {
      email: 'alice@hey.com',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    });
    expect(res.status).toBe(400);
  });
});

// Make the file a module to compile under '--isolatedModules'.
export {};
