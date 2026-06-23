import { desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/client';
import { learningLogs, skills } from '@/db/schema';

/** Reactive list of all logs (newest first) with the related skill name. */
export function useLogsLive() {
  return useLiveQuery(
    db
      .select({
        id: learningLogs.id,
        skillId: learningLogs.skillId,
        skillName: skills.name,
        title: learningLogs.title,
        notes: learningLogs.notes,
        durationMinutes: learningLogs.durationMinutes,
        difficulty: learningLogs.difficulty,
        mood: learningLogs.mood,
        logDate: learningLogs.logDate,
        createdAt: learningLogs.createdAt,
      })
      .from(learningLogs)
      .innerJoin(skills, eq(learningLogs.skillId, skills.id))
      .orderBy(desc(learningLogs.logDate), desc(learningLogs.createdAt))
  );
}

/** Reactive logs for a single skill (newest first). */
export function useLogsBySkillLive(skillId: string) {
  return useLiveQuery(
    db
      .select()
      .from(learningLogs)
      .where(eq(learningLogs.skillId, skillId))
      .orderBy(desc(learningLogs.logDate), desc(learningLogs.createdAt))
  );
}

export type LogListItem = ReturnType<typeof useLogsLive>['data'][number];
