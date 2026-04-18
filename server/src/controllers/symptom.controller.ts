import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getSymptoms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const symptoms = await prisma.symptom.findMany({
      where: { OR: [{ userId: null }, { userId: req.user!.id }], isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(symptoms);
  } catch (err) { next(err); }
}

export async function createSymptom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const symptom = await prisma.symptom.create({ data: { ...req.body, userId: req.user!.id } });
    res.status(201).json(symptom);
  } catch (err) { next(err); }
}

export async function updateSymptom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.symptom.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Symptom not found' }); return; }
    if (existing.userId === null) { res.status(403).json({ error: 'FORBIDDEN', message: 'Cannot modify system symptoms' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const symptom = await prisma.symptom.update({ where: { id }, data: req.body });
    res.json(symptom);
  } catch (err) { next(err); }
}

export async function deleteSymptom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.symptom.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Symptom not found' }); return; }
    if (existing.userId === null) { res.status(403).json({ error: 'FORBIDDEN', message: 'Cannot delete system symptoms' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.symptom.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
