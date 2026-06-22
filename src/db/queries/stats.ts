import { and, gte, lte } from 'drizzle-orm';

import { calculateStreak, getWeekRange } from '@/lib/date';

import { db } from '../client';
import { learningLogs, milestones, skills } from '../schema';

export type DashboardStats = {
  totalSkills: number;
  activeSkills: number;
  completedMilestones: number;
  totalLearningMinutes: number;
  currentStreak: number;
  mostPracticedSkill?: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [allSkills, allLogs, allMilestones] = await Promise.all([
    db.select().from(skills),
    db.select().from(learningLogs),
    db.select().from(milestones),
  ]);

  const totalLearningMinutes = allLogs.reduce((sum, l) => sum + l.durationMinutes, 0);

  const minutesBySkill = new Map<string, number>();
  for (const l of allLogs) {
    minutesBySkill.set(l.skillId, (minutesBySkill.get(l.skillId) ?? 0) + l.durationMinutes);
  }

  let mostPracticedSkillId: string | undefined;
  let maxMinutes = 0;
  for (const [skillId, minutes] of minutesBySkill) {
    if (minutes > maxMinutes) {
      maxMinutes = minutes;
      mostPracticedSkillId = skillId;
    }
  }

  return {
    totalSkills: allSkills.length,
    activeSkills: allSkills.filter((s) => s.status === 'active').length,
    completedMilestones: allMilestones.filter((m) => m.isCompleted).length,
    totalLearningMinutes,
    currentStreak: calculateStreak(allLogs.map((l) => l.logDate)),
    mostPracticedSkill: allSkills.find((s) => s.id === mostPracticedSkillId)?.name,
  };
}

export type DailyMinutes = { date: string; minutes: number };

/** Learning minutes per day for the current Monday–Sunday week. */
export async function getWeeklyLearningMinutes(): Promise<DailyMinutes[]> {
  const { start, end } = getWeekRange();
  const logs = await db
    .select()
    .from(learningLogs)
    .where(and(gte(learningLogs.logDate, start), lte(learningLogs.logDate, end)));

  const minutesByDate = new Map<string, number>();
  for (const l of logs) {
    minutesByDate.set(l.logDate, (minutesByDate.get(l.logDate) ?? 0) + l.durationMinutes);
  }

  const days: DailyMinutes[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < 7; i += 1) {
    const key = cursor.toISOString().slice(0, 10);
    days.push({ date: key, minutes: minutesByDate.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
