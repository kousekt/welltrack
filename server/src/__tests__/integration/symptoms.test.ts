import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const SYMPTOM = { id: 'sym-1', userId: USER_ID, name: 'Headache', category: 'neurological', isActive: true };
const SYSTEM_SYMPTOM = { id: 'sys-sym-1', userId: null, name: 'Fatigue', category: 'general', isActive: true };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/symptoms', () => {
  it('returns symptoms for the user', async () => {
    prismaMock.symptom.findMany.mockResolvedValue([SYMPTOM, SYSTEM_SYMPTOM] as never);
    const res = await request(app).get('/api/symptoms').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /api/symptoms', () => {
  it('creates a custom symptom', async () => {
    prismaMock.symptom.create.mockResolvedValue(SYMPTOM as never);
    const res = await request(app)
      .post('/api/symptoms')
      .set('Authorization', AUTH)
      .send({ name: 'Headache', category: 'neurological' });
    expect(res.status).toBe(201);
  });

  it('returns 400 on missing fields', async () => {
    const res = await request(app)
      .post('/api/symptoms')
      .set('Authorization', AUTH)
      .send({ name: 'Headache' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/symptoms/:id', () => {
  it('updates a custom symptom', async () => {
    prismaMock.symptom.findUnique.mockResolvedValue(SYMPTOM as never);
    prismaMock.symptom.update.mockResolvedValue({ ...SYMPTOM, name: 'Migraine' } as never);
    const res = await request(app)
      .patch('/api/symptoms/sym-1')
      .set('Authorization', AUTH)
      .send({ name: 'Migraine' });
    expect(res.status).toBe(200);
  });

  it('returns 403 when trying to update a system symptom', async () => {
    prismaMock.symptom.findUnique.mockResolvedValue(SYSTEM_SYMPTOM as never);
    const res = await request(app)
      .patch('/api/symptoms/sys-sym-1')
      .set('Authorization', AUTH)
      .send({ name: 'New Name' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/symptoms/:id', () => {
  it('deletes a custom symptom', async () => {
    prismaMock.symptom.findUnique.mockResolvedValue(SYMPTOM as never);
    prismaMock.symptom.delete.mockResolvedValue(SYMPTOM as never);
    const res = await request(app).delete('/api/symptoms/sym-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });

  it('returns 403 when trying to delete a system symptom', async () => {
    prismaMock.symptom.findUnique.mockResolvedValue(SYSTEM_SYMPTOM as never);
    const res = await request(app).delete('/api/symptoms/sys-sym-1').set('Authorization', AUTH);
    expect(res.status).toBe(403);
  });
});
