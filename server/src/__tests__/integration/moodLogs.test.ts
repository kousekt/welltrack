import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const LOG = { id: 'ml-1', userId: USER_ID, moodScore: 4, energyLevel: 3, stressLevel: 2, notes: null, loggedAt: new Date(), createdAt: new Date() };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/mood-logs', () => {
  it('returns mood logs', async () => {
    prismaMock.moodLog.findMany.mockResolvedValue([LOG] as never);
    const res = await request(app).get('/api/mood-logs').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/mood-logs', () => {
  it('creates a mood log', async () => {
    prismaMock.moodLog.create.mockResolvedValue(LOG as never);
    const res = await request(app)
      .post('/api/mood-logs')
      .set('Authorization', AUTH)
      .send({ moodScore: 4, energyLevel: 3, loggedAt: new Date().toISOString() });
    expect(res.status).toBe(201);
  });

  it('returns 400 for missing moodScore', async () => {
    const res = await request(app)
      .post('/api/mood-logs')
      .set('Authorization', AUTH)
      .send({ loggedAt: new Date().toISOString() });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/mood-logs/:id', () => {
  it('deletes a mood log', async () => {
    prismaMock.moodLog.findUnique.mockResolvedValue(LOG as never);
    prismaMock.moodLog.delete.mockResolvedValue(LOG as never);
    const res = await request(app).delete('/api/mood-logs/ml-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });
});
