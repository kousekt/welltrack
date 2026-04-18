import jwt from 'jsonwebtoken';
import { z } from 'zod';

const payloadSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export type JwtPayload = z.infer<typeof payloadSchema>;

function getSecret(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret('JWT_SECRET'), {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as string,
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret('REFRESH_TOKEN_SECRET'), {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d') as string,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getSecret('JWT_SECRET'));
  return payloadSchema.parse(decoded);
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getSecret('REFRESH_TOKEN_SECRET'));
  return payloadSchema.parse(decoded);
}
