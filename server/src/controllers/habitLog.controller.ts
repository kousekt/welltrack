import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getHabitLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { userId: req.user!.id };
    if (startDate || endDate) {
      where.loggedAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }
    const logs = await prisma.habitLog.findMany({
      where, orderBy: { loggedAt: 'desc' },
      include: { habit: { select: { id: true, name: true, trackingType: true, unit: true } } },
    });
    res.json(logs);
  } catch (err) { next(err); }
}

export async function createHabitLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { habitId, valueBoolean, valueNumeric, valueDuration, notes, loggedAt } = req.body;
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, OR: [{ userId: null }, { userId: req.user!.id }] },
    });
    if (!habit) { res.status(404).json({ error: 'NOT_FOUND', message: 'Habit not found' }); return; }
    const valueMap: Record<string, boolean> = {
      boolean: valueBoolean !== undefined,
      numeric: valueNumeric !== undefined,
      duration: valueDuration !== undefined,
    };
    if (!valueMap[habit.trackingType]) {
      res.status(400).json({ error: 'VALIDATION_ERROR', message: `Habit tracking type '${habit.trackingType}' requires the matching value field` });
      return;
    }
    const log = await prisma.habitLog.create({
      data: { userId: req.user!.id, habitId, valueBoolean: valueBoolean ?? null, valueNumeric: valueNumeric ?? null, valueDuration: valueDuration ?? null, notes, loggedAt: new Date(loggedAt) },
      include: { habit: { select: { id: true, name: true, trackingType: true, unit: true } } },
    });
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function updateHabitLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.habitLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const data = { ...req.body };
    if (data.loggedAt) data.loggedAt = new Date(data.loggedAt);
    const log = await prisma.habitLog.update({ where: { id }, data });
    res.json(log);
  } catch (err) { next(err); }
}

export async function deleteHabitLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.habitLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.habitLog.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
