// <project-root>/__tests__/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import { driver } from '../src/config/neo4j';

afterAll(async () => {
  await driver.close();
});

describe('Auth Endpoints', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'bob',
        email: 'bob@example.com',
        password: 'secret123'
      });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('id');
  });

  it('rejects duplicate registration', async () => {
    // first registration
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'bob2', email: 'bob2@example.com', password: 'pass' });
    // attempt again
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ username: 'bob2', email: 'bob2@example.com', password: 'pass' });
    expect(res2.status).toBeGreaterThanOrEqual(400);
  });

  it('logs in with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'carol', email: 'carol@example.com', password: 'pw' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'carol@example.com', password: 'pw' });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexist@example.com', password: 'nope' });
    expect(res.status).toBe(401);
  });
});
