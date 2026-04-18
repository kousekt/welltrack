import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getHabits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const habits = await prisma.habit.findMany({
      where: { OR: [{ userId: null }, { userId: req.user!.id }], isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(habits);
  } catch (err) { next(err); }
}

export async function createHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const habit = await prisma.habit.create({ data: { ...req.body, userId: req.user!.id } });
    res.status(201).json(habit);
  } catch (err) { next(err); }
}

export async function updateHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Habit not found' }); return; }
    if (existing.userId === null) { res.status(403).json({ error: 'FORBIDDEN', message: 'Cannot modify system habits' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const habit = await prisma.habit.update({ where: { id }, data: req.body });
    res.json(habit);
  } catch (err) { next(err); }
}

export async function deleteHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Habit not found' }); return; }
    if (existing.userId === null) { res.status(403).json({ error: 'FORBIDDEN', message: 'Cannot delete system habits' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.habit.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
