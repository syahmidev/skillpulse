import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/client';
import { milestones } from '@/db/schema';

/** Reactive milestones for a skill, oldest first (checklist order). */
export function useMilestonesBySkillLive(skillId: string) {
  return useLiveQuery(
    db
      .select()
      .from(milestones)
      .where(eq(milestones.skillId, skillId))
      .orderBy(asc(milestones.createdAt))
  );
}
