import { SKILL_CATEGORIES, type SkillCategory } from '@/constants/options';
import type { LearningLog, Milestone, Skill } from '@/db/schema';
import { calculateStreak, getWeekRange, toISODate } from '@/lib/date';

export type DailyMinutes = { label: string; minutes: number };

export type InsightsData = {
  totalSkills: number;
  activeSkills: number;
  completedMilestones: number;
  totalMilestones: number;
  totalLearningMinutes: number;
  currentStreak: number;
  mostPracticedSkill?: string;
  weeklyMinutes: number;
  weekly: DailyMinutes[];
  categoryBreakdown: { category: SkillCategory; count: number }[];
  logCount: number;
};

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Pure dashboard/insights aggregation over the raw table rows. Kept free of
 * any DB access so it can be reused by the live hook and unit-tested directly.
 */
export function computeInsights(
  skillRows: Skill[],
  logRows: LearningLog[],
  milestoneRows: Milestone[]
): InsightsData {
  const totalLearningMinutes = logRows.reduce((sum, l) => sum + l.durationMinutes, 0);

  const minutesBySkill = new Map<string, number>();
  for (const l of logRows) {
    minutesBySkill.set(l.skillId, (minutesBySkill.get(l.skillId) ?? 0) + l.durationMinutes);
  }
  let mostId: string | undefined;
  let maxMinutes = 0;
  for (const [skillId, minutes] of minutesBySkill) {
    if (minutes > maxMinutes) {
      maxMinutes = minutes;
      mostId = skillId;
    }
  }

  const { start } = getWeekRange();
  const [y, m, d] = start.split('-').map(Number);
  const cursor = new Date(y, (m ?? 1) - 1, d ?? 1);

  const minutesByDate = new Map<string, number>();
  for (const l of logRows) {
    minutesByDate.set(l.logDate, (minutesByDate.get(l.logDate) ?? 0) + l.durationMinutes);
  }

  const weekly: DailyMinutes[] = [];
  for (let i = 0; i < 7; i += 1) {
    weekly.push({ label: DAY_LABELS[i], minutes: minutesByDate.get(toISODate(cursor)) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  const weeklyMinutes = weekly.reduce((sum, day) => sum + day.minutes, 0);

  const categoryBreakdown = SKILL_CATEGORIES.map((category) => ({
    category,
    count: skillRows.filter((s) => s.category === category).length,
  })).filter((c) => c.count > 0);

  return {
    totalSkills: skillRows.length,
    activeSkills: skillRows.filter((s) => s.status === 'active').length,
    completedMilestones: milestoneRows.filter((m) => m.isCompleted).length,
    totalMilestones: milestoneRows.length,
    totalLearningMinutes,
    currentStreak: calculateStreak(logRows.map((l) => l.logDate)),
    mostPracticedSkill: skillRows.find((s) => s.id === mostId)?.name,
    weeklyMinutes,
    weekly,
    categoryBreakdown,
    logCount: logRows.length,
  };
}
