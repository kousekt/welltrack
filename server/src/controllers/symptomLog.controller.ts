import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getSymptomLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate, limit = '50', offset = '0' } = req.query as Record<string, string>;
    const take = Math.min(parseInt(limit) || 50, 200);
    const skip = parseInt(offset) || 0;
    const where: Record<string, unknown> = { userId: req.user!.id };
    if (startDate || endDate) {
      where.loggedAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }
    const logs = await prisma.symptomLog.findMany({
      where, orderBy: { loggedAt: 'desc' }, take, skip,
      include: { symptom: { select: { id: true, name: true, category: true } } },
    });
    res.json(logs);
  } catch (err) { next(err); }
}

export async function createSymptomLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { symptomId, severity, notes, loggedAt } = req.body;
    const symptom = await prisma.symptom.findFirst({
      where: { id: symptomId, OR: [{ userId: null }, { userId: req.user!.id }] },
    });
    if (!symptom) { res.status(404).json({ error: 'NOT_FOUND', message: 'Symptom not found' }); return; }
    const log = await prisma.symptomLog.create({
      data: { userId: req.user!.id, symptomId, severity, notes, loggedAt: new Date(loggedAt) },
      include: { symptom: { select: { id: true, name: true, category: true } } },
    });
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function updateSymptomLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.symptomLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const data = { ...req.body };
    if (data.loggedAt) data.loggedAt = new Date(data.loggedAt);
    const log = await prisma.symptomLog.update({ where: { id }, data });
    res.json(log);
  } catch (err) { next(err); }
}

export async function deleteSymptomLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.symptomLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.symptomLog.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
