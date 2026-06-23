import { desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/client';
import { skills } from '@/db/schema';

/** Reactive list of all skills, newest first. Auto-updates on writes. */
export function useSkillsLive() {
  return useLiveQuery(db.select().from(skills).orderBy(desc(skills.createdAt)));
}

/** Reactive single skill by id. */
export function useSkillLive(id: string) {
  return useLiveQuery(db.select().from(skills).where(eq(skills.id, id)));
}
