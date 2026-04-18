import { Request, Response, NextFunction } from 'express';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { sendPasswordResetEmail } from '../lib/email';

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

function generateRawToken(): string {
  return randomBytes(32).toString('hex');
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, displayName, timezone } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'CONFLICT', message: 'Email already in use' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName, timezone: timezone ?? 'UTC' },
      select: { id: true, email: true, displayName: true, timezone: true, createdAt: true },
    });
    const accessToken = signAccessToken({ id: user.id, email: user.email });
    const rawRefresh = generateRawToken();
    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: hashToken(rawRefresh), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    res.status(201).json({ user, accessToken, refreshToken: rawRefresh });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid credentials' });
      return;
    }
    const accessToken = signAccessToken({ id: user.id, email: user.email });
    const rawRefresh = generateRawToken();
    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: hashToken(rawRefresh), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, accessToken, refreshToken: rawRefresh });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: rawRefresh } = req.body;
    if (!rawRefresh) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'refreshToken required' });
      return;
    }
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(rawRefresh) } });
    if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' });
      return;
    }
    try { verifyRefreshToken(rawRefresh); } catch {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid refresh token signature' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) { res.status(401).json({ error: 'UNAUTHORIZED', message: 'User not found' }); return; }
    const accessToken = signAccessToken({ id: user.id, email: user.email });
    res.json({ accessToken });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: rawRefresh } = req.body;
    if (rawRefresh) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(rawRefresh), userId: req.user!.id },
        data: { isRevoked: true },
      });
    }
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const rawToken = generateRawToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
      const resetUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(email, resetUrl);
    }
    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) { next(err); }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token: rawToken, password } = req.body;
    const tokenRecord = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
    if (!tokenRecord || tokenRecord.usedAt !== null || tokenRecord.expiresAt < new Date()) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid or expired reset token' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: tokenRecord.userId }, data: { passwordHash } });
    await prisma.passwordResetToken.update({ where: { id: tokenRecord.id }, data: { usedAt: new Date() } });
    await prisma.refreshToken.updateMany({ where: { userId: tokenRecord.userId, isRevoked: false }, data: { isRevoked: true } });
    res.json({ message: 'Password reset successful' });
  } catch (err) { next(err); }
}
