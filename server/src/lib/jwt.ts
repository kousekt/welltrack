import jwt from 'jsonwebtoken';
import { z } from 'zod';

const accessPayloadSchema = z.object({ id: z.string(), email: z.string() });
const refreshPayloadSchema = z.object({ id: z.string() });

function getSecret(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export function signAccessToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, getSecret('JWT_SECRET'), {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  });
}

export function signRefreshToken(payload: { id: string }): string {
  return jwt.sign(payload, getSecret('REFRESH_TOKEN_SECRET'), {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
  });
}

export function verifyAccessToken(token: string): { id: string; email: string } {
  const decoded = jwt.verify(token, getSecret('JWT_SECRET'));
  return accessPayloadSchema.parse(decoded);
}

export function verifyRefreshToken(token: string): { id: string } {
  const decoded = jwt.verify(token, getSecret('REFRESH_TOKEN_SECRET'));
  return refreshPayloadSchema.parse(decoded);
}
