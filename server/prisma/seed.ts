import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const symptoms = [
  { id: 'system-symptom-headache', name: 'Headache', category: 'neurological' },
  { id: 'system-symptom-fatigue', name: 'Fatigue', category: 'general' },
  { id: 'system-symptom-joint-pain', name: 'Joint Pain', category: 'pain' },
  { id: 'system-symptom-muscle-pain', name: 'Muscle Pain', category: 'pain' },
  { id: 'system-symptom-nausea', name: 'Nausea', category: 'digestive' },
  { id: 'system-symptom-brain-fog', name: 'Brain Fog', category: 'neurological' },
  { id: 'system-symptom-dizziness', name: 'Dizziness', category: 'neurological' },
  { id: 'system-symptom-insomnia', name: 'Insomnia', category: 'sleep' },
  { id: 'system-symptom-anxiety', name: 'Anxiety', category: 'mental' },
  { id: 'system-symptom-stomach-pain', name: 'Stomach Pain', category: 'digestive' },
  { id: 'system-symptom-back-pain', name: 'Back Pain', category: 'pain' },
];

const habits = [
  { id: 'system-habit-sleep', name: 'Sleep Duration', trackingType: 'duration', unit: 'hours' },
  { id: 'system-habit-water', name: 'Water Intake', trackingType: 'numeric', unit: 'glasses' },
  { id: 'system-habit-exercise', name: 'Exercise', trackingType: 'boolean', unit: null },
  { id: 'system-habit-alcohol', name: 'Alcohol', trackingType: 'boolean', unit: null },
  { id: 'system-habit-caffeine', name: 'Caffeine', trackingType: 'numeric', unit: 'cups' },
];

async function main() {
  for (const s of symptoms) {
    await prisma.symptom.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, userId: null, isActive: true },
    });
  }

  for (const h of habits) {
    await prisma.habit.upsert({
      where: { id: h.id },
      update: {},
      create: { ...h, userId: null, isActive: true },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
