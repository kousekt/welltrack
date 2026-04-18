import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getMoodLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { userId: req.user!.id };
    if (startDate || endDate) {
      where.loggedAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }
    const logs = await prisma.moodLog.findMany({ where, orderBy: { loggedAt: 'desc' } });
    res.json(logs);
  } catch (err) { next(err); }
}

export async function createMoodLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { loggedAt, ...rest } = req.body;
    const log = await prisma.moodLog.create({ data: { ...rest, userId: req.user!.id, loggedAt: new Date(loggedAt) } });
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function updateMoodLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.moodLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const data = { ...req.body };
    if (data.loggedAt) data.loggedAt = new Date(data.loggedAt);
    const log = await prisma.moodLog.update({ where: { id }, data });
    res.json(log);
  } catch (err) { next(err); }
}

export async function deleteMoodLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.moodLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.moodLog.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
