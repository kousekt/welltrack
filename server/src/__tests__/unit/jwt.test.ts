import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';

describe('signAccessToken / verifyAccessToken', () => {
  const payload = { id: 'user-1', email: 'test@example.com' };

  it('signs a token that verifies correctly', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('throws on an invalid token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });

  it('throws when verified with wrong secret', () => {
    const token = signRefreshToken(payload);
    expect(() => verifyAccessToken(token)).toThrow();
  });
});

describe('signRefreshToken / verifyRefreshToken', () => {
  const payload = { id: 'user-2', email: 'other@example.com' };

  it('signs a token that verifies correctly', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('throws on an invalid token', () => {
    expect(() => verifyRefreshToken('bad.token')).toThrow();
  });

  it('throws when verified with wrong secret', () => {
    const token = signAccessToken(payload);
    expect(() => verifyRefreshToken(token)).toThrow();
  });
});
