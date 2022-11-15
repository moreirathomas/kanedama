/// <reference lib="dom" />

describe('Health check', () => {
  test('returns 200 OK', async () => {
    const res = await fetch('http://localhost:3000/healthz');
    expect(res.status).toBe(200);
  });
});

// Make the file a module to compile under '--isolatedModules'.
export {};
