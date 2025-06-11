// <project-root>/__tests__/user.test.ts
import request from 'supertest';
import app from '../src/app';

let tokenA: string, tokenB: string, userA: string, userB: string;

beforeAll(async () => {
  const r1 = await request(app).post('/api/auth/register').send({
    username: 'u1', email: 'u1@example.com', password: 'p1'
  });
  tokenA = r1.body.data.token;
  userA = r1.body.data.id;

  const r2 = await request(app).post('/api/auth/register').send({
    username: 'u2', email: 'u2@example.com', password: 'p2'
  });
  tokenB = r2.body.data.token;
  userB = r2.body.data.id;
});

describe('Follow / Unfollow', () => {
  it('A follows B', async () => {
    const res = await request(app)
      .post(`/api/users/${userB}/follow`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
  });

  it('Followers list for B includes A', async () => {
    const res = await request(app)
      .get(`/api/users/${userB}/followers`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.body.data).toEqual(
      expect.arrayContaining([{ id: userA, username: 'u1' }])
    );
  });

  it('A unfollows B', async () => {
    const res = await request(app)
      .delete(`/api/users/${userB}/follow`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
  });
});
