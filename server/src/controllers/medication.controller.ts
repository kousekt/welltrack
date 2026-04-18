import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getMedications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const medications = await prisma.medication.findMany({ where: { userId: req.user!.id }, orderBy: { name: 'asc' } });
    res.json(medications);
  } catch (err) { next(err); }
}

export async function createMedication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const medication = await prisma.medication.create({ data: { ...req.body, userId: req.user!.id } });
    res.status(201).json(medication);
  } catch (err) { next(err); }
}

export async function updateMedication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Medication not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const medication = await prisma.medication.update({ where: { id }, data: req.body });
    res.json(medication);
  } catch (err) { next(err); }
}

export async function deleteMedication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Medication not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.medication.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
