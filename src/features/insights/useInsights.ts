import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';

import { db } from '@/db/client';
import { learningLogs, milestones, skills } from '@/db/schema';

import { computeInsights } from './compute';

/** Reactive dashboard/insights stats. Recomputes whenever any table changes. */
export function useInsights() {
  const { data: skillRows } = useLiveQuery(db.select().from(skills));
  const { data: logRows } = useLiveQuery(db.select().from(learningLogs));
  const { data: milestoneRows } = useLiveQuery(db.select().from(milestones));

  return useMemo(
    () => computeInsights(skillRows, logRows, milestoneRows),
    [skillRows, logRows, milestoneRows]
  );
}
