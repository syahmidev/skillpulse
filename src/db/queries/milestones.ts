import { asc, eq } from 'drizzle-orm';

import { nowISO } from '@/lib/date';
import { newId } from '@/lib/id';
import type { MilestoneFormValues } from '@/lib/validations';

import { db } from '../client';
import { milestones, type Milestone, type NewMilestone } from '../schema';

export async function listMilestonesBySkill(skillId: string): Promise<Milestone[]> {
  return db
    .select()
    .from(milestones)
    .where(eq(milestones.skillId, skillId))
    .orderBy(asc(milestones.createdAt));
}

export async function createMilestone(values: MilestoneFormValues): Promise<Milestone> {
  const ts = nowISO();
  const row: NewMilestone = {
    id: newId(),
    isCompleted: false,
    createdAt: ts,
    updatedAt: ts,
    ...values,
  };
  const [created] = await db.insert(milestones).values(row).returning();
  return created;
}

/**
 * Bulk-insert milestones for a skill (e.g. from a generated AI plan).
 * createdAt is staggered by index so the checklist preserves the given order.
 */
export async function createMilestones(skillId: string, titles: string[]): Promise<void> {
  if (titles.length === 0) return;
  const base = Date.now();
  const rows: NewMilestone[] = titles.map((title, i) => {
    const ts = new Date(base + i).toISOString();
    return { id: newId(), skillId, title, isCompleted: false, createdAt: ts, updatedAt: ts };
  });
  await db.insert(milestones).values(rows);
}

export async function setMilestoneCompleted(
  id: string,
  isCompleted: boolean
): Promise<Milestone | undefined> {
  const [updated] = await db
    .update(milestones)
    .set({ isCompleted, updatedAt: nowISO() })
    .where(eq(milestones.id, id))
    .returning();
  return updated;
}

export async function deleteMilestone(id: string): Promise<void> {
  await db.delete(milestones).where(eq(milestones.id, id));
}
