import { desc, eq } from 'drizzle-orm';

import { nowISO } from '@/lib/date';
import { newId } from '@/lib/id';
import type { SkillFormValues } from '@/lib/validations';

import { db } from '../client';
import { skills, type NewSkill, type Skill } from '../schema';

export async function listSkills(): Promise<Skill[]> {
  return db.select().from(skills).orderBy(desc(skills.createdAt));
}

export async function getSkill(id: string): Promise<Skill | undefined> {
  const rows = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return rows[0];
}

export async function createSkill(values: SkillFormValues): Promise<Skill> {
  const ts = nowISO();
  const row: NewSkill = { id: newId(), createdAt: ts, updatedAt: ts, ...values };
  const [created] = await db.insert(skills).values(row).returning();
  return created;
}

export async function updateSkill(
  id: string,
  values: SkillFormValues
): Promise<Skill | undefined> {
  const [updated] = await db
    .update(skills)
    .set({ ...values, updatedAt: nowISO() })
    .where(eq(skills.id, id))
    .returning();
  return updated;
}

export async function deleteSkill(id: string): Promise<void> {
  // learning_logs and milestones cascade via the schema's onDelete.
  await db.delete(skills).where(eq(skills.id, id));
}
