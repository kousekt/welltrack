import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const LOG = {
  id: 'log-1', userId: USER_ID, symptomId: 'sym-1', severity: 7,
  notes: null, loggedAt: new Date(), createdAt: new Date(),
};
const SYMPTOM = { id: 'sym-1', userId: null, name: 'Headache', category: 'neurological', isActive: true };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/symptom-logs', () => {
  it('returns logs for the user', async () => {
    prismaMock.symptomLog.findMany.mockResolvedValue([LOG] as never);
    const res = await request(app).get('/api/symptom-logs').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/symptom-logs', () => {
  it('creates a log entry', async () => {
    prismaMock.symptom.findFirst.mockResolvedValue(SYMPTOM as never);
    prismaMock.symptomLog.create.mockResolvedValue({ ...LOG, symptom: SYMPTOM } as never);
    const res = await request(app)
      .post('/api/symptom-logs')
      .set('Authorization', AUTH)
      .send({ symptomId: '00000000-0000-0000-0000-000000000001', severity: 7, loggedAt: new Date().toISOString() });
    expect(res.status).toBe(201);
  });

  it('returns 404 when symptom not found', async () => {
    prismaMock.symptom.findFirst.mockResolvedValue(null);
    const res = await request(app)
      .post('/api/symptom-logs')
      .set('Authorization', AUTH)
      .send({ symptomId: '00000000-0000-0000-0000-000000000001', severity: 5, loggedAt: new Date().toISOString() });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/symptom-logs/:id', () => {
  it('deletes a log entry', async () => {
    prismaMock.symptomLog.findUnique.mockResolvedValue(LOG as never);
    prismaMock.symptomLog.delete.mockResolvedValue(LOG as never);
    const res = await request(app).delete('/api/symptom-logs/log-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });

  it('returns 403 when log belongs to another user', async () => {
    prismaMock.symptomLog.findUnique.mockResolvedValue({ ...LOG, userId: 'other-user' } as never);
    const res = await request(app).delete('/api/symptom-logs/log-1').set('Authorization', AUTH);
    expect(res.status).toBe(403);
  });
});
