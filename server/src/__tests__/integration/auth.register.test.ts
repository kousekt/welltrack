import request from 'supertest';
import app from '../../app';

jest.mock('../../db');
import prismaMock, { mockReset } from '../../db';

beforeEach(() => mockReset(prismaMock));

const validBody = {
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User',
};

const mockUser = {
  id: 'user-id-1',
  email: 'test@example.com',
  passwordHash: 'hashed',
  displayName: 'Test User',
  timezone: 'UTC',
  createdAt: new Date(),
};

const mockRefreshToken = {
  id: 'token-id-1',
  userId: 'user-id-1',
  tokenHash: 'tokenHash',
  expiresAt: new Date(),
  isRevoked: false,
  createdAt: new Date(),
};

describe('POST /api/auth/register', () => {
  it('201: creates a user and returns user + tokens', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUser);
    prismaMock.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app).post('/api/auth/register').send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      id: 'user-id-1',
      email: 'test@example.com',
      displayName: 'Test User',
      timezone: 'UTC',
    });
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('201: accepts optional timezone', async () => {
    const userWithTz = { ...mockUser, timezone: 'America/New_York' };
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(userWithTz);
    prismaMock.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validBody, timezone: 'America/New_York' });

    expect(res.status).toBe(201);
    expect(res.body.user.timezone).toBe('America/New_York');
  });

  it('409: EMAIL_IN_USE when email already registered', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/register').send(validBody);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('EMAIL_IN_USE');
  });

  it('400: VALIDATION_ERROR when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'password123', displayName: 'Test User' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.fields.email).toBeDefined();
  });

  it('400: VALIDATION_ERROR when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validBody, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.fields.email).toBeDefined();
  });

  it('400: VALIDATION_ERROR when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validBody, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.fields.password).toBeDefined();
  });

  it('400: VALIDATION_ERROR when displayName is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.fields.displayName).toBeDefined();
  });

  it('500: propagates unexpected DB errors', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockRejectedValue(new Error('DB connection failed'));

    const res = await request(app).post('/api/auth/register').send(validBody);

    expect(res.status).toBe(500);
  });
});
