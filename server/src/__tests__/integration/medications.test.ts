import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

const USER_ID = 'user-uuid-1';
const token = signAccessToken({ id: USER_ID, email: 'test@example.com' });
const AUTH = `Bearer ${token}`;

const MED = { id: 'med-1', userId: USER_ID, name: 'Ibuprofen', dosage: '400mg', frequency: 'as needed', isActive: true, createdAt: new Date() };

beforeEach(() => mockReset(prismaMock));

describe('GET /api/medications', () => {
  it('returns medications for the user', async () => {
    prismaMock.medication.findMany.mockResolvedValue([MED] as never);
    const res = await request(app).get('/api/medications').set('Authorization', AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/medications', () => {
  it('creates a medication', async () => {
    prismaMock.medication.create.mockResolvedValue(MED as never);
    const res = await request(app)
      .post('/api/medications')
      .set('Authorization', AUTH)
      .send({ name: 'Ibuprofen', dosage: '400mg' });
    expect(res.status).toBe(201);
  });
});

describe('PATCH /api/medications/:id', () => {
  it('updates a medication', async () => {
    prismaMock.medication.findUnique.mockResolvedValue(MED as never);
    prismaMock.medication.update.mockResolvedValue({ ...MED, isActive: false } as never);
    const res = await request(app)
      .patch('/api/medications/med-1')
      .set('Authorization', AUTH)
      .send({ isActive: false });
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/medications/:id', () => {
  it('deletes a medication', async () => {
    prismaMock.medication.findUnique.mockResolvedValue(MED as never);
    prismaMock.medication.delete.mockResolvedValue(MED as never);
    const res = await request(app).delete('/api/medications/med-1').set('Authorization', AUTH);
    expect(res.status).toBe(204);
  });
});
