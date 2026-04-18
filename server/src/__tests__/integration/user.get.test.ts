import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../lib/jwt';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

beforeEach(() => mockReset(prismaMock));

const mockUser = {
  id: 'user-id-1',
  email: 'jane@example.com',
  passwordHash: 'hashed',
  displayName: 'Jane Doe',
  timezone: 'UTC',
  createdAt: new Date(),
};

const token = signAccessToken({ id: mockUser.id, email: mockUser.email });

describe('GET /api/user', () => {
  it('200: returns the logged-in user name', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'Jane Doe' });
  });

  it('401: missing Authorization header', async () => {
    const res = await request(app).get('/api/user');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  it('401: malformed token', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', 'Bearer not.a.valid.token');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  it('404: user deleted after token was issued', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });
});
