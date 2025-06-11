// <project-root>/__tests__/posts.test.ts
import request from 'supertest';
import app from '../src/app';

let token: string;

beforeAll(async () => {
  const r = await request(app).post('/api/auth/register').send({
    username: 'poster', email: 'post@example.com', password: 'pw'
  });
  token = r.body.data.token;
});

describe('Posts & Feed', () => {
  it('creates a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'First post' });
    expect(res.status).toBe(201);
  });

  it('fetches my posts', async () => {
    const res = await request(app)
      .get('/api/posts/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data[0]).toMatchObject({ content: 'First post' });
  });

  it('fetches empty feed when no follows', async () => {
    const res = await request(app)
      .get('/api/posts/feed')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data).toEqual([]);
  });
});
