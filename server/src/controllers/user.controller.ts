import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    res.json({ name: user.displayName });
  } catch (err) {
    next(err);
  }
}
