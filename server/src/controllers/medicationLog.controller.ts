import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getMedicationLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { userId: req.user!.id };
    // MedicationLog has no loggedAt — filter by createdAt
    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }
    const logs = await prisma.medicationLog.findMany({
      where, orderBy: { createdAt: 'desc' },
      include: { medication: { select: { id: true, name: true, dosage: true } } },
    });
    res.json(logs);
  } catch (err) { next(err); }
}

export async function createMedicationLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { medicationId, taken, takenAt, notes } = req.body;
    const medication = await prisma.medication.findFirst({ where: { id: medicationId, userId: req.user!.id } });
    if (!medication) { res.status(404).json({ error: 'NOT_FOUND', message: 'Medication not found' }); return; }
    const log = await prisma.medicationLog.create({
      data: { userId: req.user!.id, medicationId, taken, takenAt: takenAt ? new Date(takenAt) : null, notes },
      include: { medication: { select: { id: true, name: true, dosage: true } } },
    });
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function updateMedicationLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.medicationLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    const data = { ...req.body };
    if (data.takenAt) data.takenAt = new Date(data.takenAt);
    const log = await prisma.medicationLog.update({ where: { id }, data });
    res.json(log);
  } catch (err) { next(err); }
}

export async function deleteMedicationLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const existing = await prisma.medicationLog.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'NOT_FOUND', message: 'Log not found' }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' }); return; }
    await prisma.medicationLog.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
