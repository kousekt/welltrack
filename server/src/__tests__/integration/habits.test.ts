import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const HABIT = { id: 'habit-1', userId: USER_ID, name: 'Meditation', trackingType: 'boolean', unit: null, isActive: true };
const SYS_HABIT = { id: 'sys-habit-1', userId: null, name: 'Exercise', trackingType: 'boolean', unit: null, isActive: true };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/habits', () => {
  it('returns habits', async () => {
    prismaMock.habit.findMany.mockResolvedValue([HABIT, SYS_HABIT] as never);
    const res = await request(app).get('/api/habits').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /api/habits', () => {
  it('creates a custom habit', async () => {
    prismaMock.habit.create.mockResolvedValue(HABIT as never);
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', AUTH)
      .send({ name: 'Meditation', trackingType: 'boolean' });
    expect(res.status).toBe(201);
  });

  it('returns 400 for invalid trackingType', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', AUTH)
      .send({ name: 'Meditation', trackingType: 'invalid' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/habits/:id', () => {
  it('deletes a custom habit', async () => {
    prismaMock.habit.findUnique.mockResolvedValue(HABIT as never);
    prismaMock.habit.delete.mockResolvedValue(HABIT as never);
    const res = await request(app).delete('/api/habits/habit-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });

  it('returns 403 for system habits', async () => {
    prismaMock.habit.findUnique.mockResolvedValue(SYS_HABIT as never);
    const res = await request(app).delete('/api/habits/sys-habit-1').set('Authorization', AUTH);
    expect(res.status).toBe(403);
  });
});
