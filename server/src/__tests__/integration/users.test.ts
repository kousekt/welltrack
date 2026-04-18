import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const DB_USER = {
  id: USER_ID,
  email: 'test@example.com',
  displayName: 'Test User',
  timezone: 'UTC',
  createdAt: new Date(),
};

beforeEach(() => mockReset(prismaMock));

describe('GET /api/users/me', () => {
  it('returns the current user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(DB_USER as never);
    const res = await request(app).get('/api/users/me').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(USER_ID);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/users/me', () => {
  it('updates and returns the user', async () => {
    prismaMock.user.update.mockResolvedValue({ ...DB_USER, displayName: 'New Name' } as never);
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', AUTH)
      .send({ displayName: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.displayName).toBe('New Name');
  });

  it('returns 400 when body is empty', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', AUTH)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/users/me', () => {
  it('deletes the user and returns 204', async () => {
    prismaMock.user.delete.mockResolvedValue(DB_USER as never);
    const res = await request(app).delete('/api/users/me').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });
});
