import { desc, eq } from 'drizzle-orm';

import { nowISO } from '@/lib/date';
import { newId } from '@/lib/id';
import type { LearningLogFormValues } from '@/lib/validations';

import { db } from '../client';
import { learningLogs, type LearningLog, type NewLearningLog } from '../schema';

export async function listLogs(): Promise<LearningLog[]> {
  return db.select().from(learningLogs).orderBy(desc(learningLogs.logDate));
}

export async function listLogsBySkill(skillId: string): Promise<LearningLog[]> {
  return db
    .select()
    .from(learningLogs)
    .where(eq(learningLogs.skillId, skillId))
    .orderBy(desc(learningLogs.logDate));
}

export async function createLog(values: LearningLogFormValues): Promise<LearningLog> {
  const ts = nowISO();
  const row: NewLearningLog = { id: newId(), createdAt: ts, updatedAt: ts, ...values };
  const [created] = await db.insert(learningLogs).values(row).returning();
  return created;
}

export async function deleteLog(id: string): Promise<void> {
  await db.delete(learningLogs).where(eq(learningLogs.id, id));
}
