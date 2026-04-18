import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, displayName: true, timezone: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' }); return; }
    res.json(user);
  } catch (err) { next(err); }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      select: { id: true, email: true, displayName: true, timezone: true, createdAt: true },
    });
    res.json(user);
  } catch (err) { next(err); }
}

export async function deleteMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.user.delete({ where: { id: req.user!.id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
