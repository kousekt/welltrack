import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import prisma from '../db';
import { signAccessToken, signRefreshToken } from '../lib/jwt';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, displayName, timezone } = req.body as {
      email: string;
      password: string;
      displayName: string;
      timezone?: string;
    };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'EMAIL_IN_USE' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName, timezone: timezone ?? 'UTC' },
    });

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const accessToken = signAccessToken({ id: user.id, email: user.email });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email });

    res.status(201).json({
      user: { id: user.id, email: user.email, displayName: user.displayName, timezone: user.timezone },
      accessToken,
      refreshToken: rawToken,
    });
  } catch (err) {
    next(err);
  }
}
