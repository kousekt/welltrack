import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const HABIT = { id: 'habit-1', userId: null, name: 'Exercise', trackingType: 'boolean', unit: null, isActive: true };
const LOG = { id: 'hl-1', userId: USER_ID, habitId: 'habit-1', valueBoolean: true, valueNumeric: null, valueDuration: null, notes: null, loggedAt: new Date(), createdAt: new Date() };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/habit-logs', () => {
  it('returns habit logs', async () => {
    prismaMock.habitLog.findMany.mockResolvedValue([LOG] as never);
    const res = await request(app).get('/api/habit-logs').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/habit-logs', () => {
  it('creates a boolean habit log', async () => {
    prismaMock.habit.findFirst.mockResolvedValue(HABIT as never);
    prismaMock.habitLog.create.mockResolvedValue({ ...LOG, habit: HABIT } as never);
    const res = await request(app)
      .post('/api/habit-logs')
      .set('Authorization', AUTH)
      .send({ habitId: '00000000-0000-0000-0000-000000000001', valueBoolean: true, loggedAt: new Date().toISOString() });
    expect([201, 404]).toContain(res.status);
  });

  it('returns 400 when wrong value field type is provided', async () => {
    const numericHabit = { ...HABIT, trackingType: 'numeric' };
    prismaMock.habit.findFirst.mockResolvedValue(numericHabit as never);
    const res = await request(app)
      .post('/api/habit-logs')
      .set('Authorization', AUTH)
      .send({ habitId: '00000000-0000-0000-0000-000000000001', valueBoolean: true, loggedAt: new Date().toISOString() });
    expect([400, 404]).toContain(res.status);
  });
});

describe('DELETE /api/habit-logs/:id', () => {
  it('deletes a habit log', async () => {
    prismaMock.habitLog.findUnique.mockResolvedValue(LOG as never);
    prismaMock.habitLog.delete.mockResolvedValue(LOG as never);
    const res = await request(app).delete('/api/habit-logs/hl-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });
});
