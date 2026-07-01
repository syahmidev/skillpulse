import { describe, expect, it } from '@jest/globals';

import type { LearningLog, Milestone, Skill } from '@/db/schema';
import { toISODate, todayISODate } from '@/lib/date';

import { buildHeatmap, computeInsights } from '../compute';

const skill = (over: Partial<Skill> & { id: string; name: string }): Skill => ({
  category: 'mobile',
  currentLevel: 'beginner',
  targetLevel: 'intermediate',
  status: 'active',
  goal: null,
  createdAt: '',
  updatedAt: '',
  ...over,
});

const log = (
  over: Partial<LearningLog> & { id: string; skillId: string; durationMinutes: number; logDate: string }
): LearningLog => ({
  title: 'session',
  notes: null,
  difficulty: null,
  mood: null,
  createdAt: '',
  updatedAt: '',
  ...over,
});

const milestone = (
  over: Partial<Milestone> & { id: string; skillId: string; isCompleted: boolean }
): Milestone => ({
  title: 'step',
  createdAt: '',
  updatedAt: '',
  ...over,
});

describe('computeInsights', () => {
  const today = todayISODate();
  const tenDaysAgo = toISODate(new Date(Date.now() - 10 * 86_400_000));

  const skills = [
    skill({ id: 'a', name: 'React Native', category: 'mobile', status: 'active' }),
    skill({ id: 'b', name: 'Laravel', category: 'backend', status: 'paused' }),
  ];
  const logs = [
    log({ id: 'l1', skillId: 'a', durationMinutes: 60, logDate: today }),
    log({ id: 'l2', skillId: 'a', durationMinutes: 40, logDate: tenDaysAgo }),
    log({ id: 'l3', skillId: 'b', durationMinutes: 30, logDate: today }),
  ];
  const milestones = [
    milestone({ id: 'm1', skillId: 'a', isCompleted: true }),
    milestone({ id: 'm2', skillId: 'a', isCompleted: false }),
    milestone({ id: 'm3', skillId: 'b', isCompleted: false }),
  ];

  const result = computeInsights(skills, logs, milestones);

  it('counts skills and active skills', () => {
    expect(result.totalSkills).toBe(2);
    expect(result.activeSkills).toBe(1);
  });

  it('counts milestones', () => {
    expect(result.totalMilestones).toBe(3);
    expect(result.completedMilestones).toBe(1);
  });

  it('sums total learning minutes', () => {
    expect(result.totalLearningMinutes).toBe(130);
    expect(result.logCount).toBe(3);
  });

  it('picks the most practiced skill by minutes', () => {
    expect(result.mostPracticedSkill).toBe('React Native');
  });

  it('computes the current streak (today present)', () => {
    expect(result.currentStreak).toBe(1);
  });

  it('builds a 7-day week with only this-week minutes', () => {
    expect(result.weekly).toHaveLength(7);
    expect(result.weeklyMinutes).toBe(90); // today's 60 + 30; the 10-day-old log is excluded
  });

  it('breaks down skills by category in SKILL_CATEGORIES order, omitting empty ones', () => {
    // backend precedes mobile in SKILL_CATEGORIES, so the breakdown follows that order.
    expect(result.categoryBreakdown).toEqual([
      { category: 'backend', count: 1 },
      { category: 'mobile', count: 1 },
    ]);
  });

  it('handles empty input', () => {
    const empty = computeInsights([], [], []);
    expect(empty.totalSkills).toBe(0);
    expect(empty.currentStreak).toBe(0);
    expect(empty.mostPracticedSkill).toBeUndefined();
    expect(empty.weekly).toHaveLength(7);
    expect(empty.weeklyMinutes).toBe(0);
    expect(empty.categoryBreakdown).toEqual([]);
    expect(empty.heatmap).toHaveLength(26);
  });
});

describe('buildHeatmap', () => {
  const today = todayISODate();
  const grid = buildHeatmap([{ logDate: today, durationMinutes: 90 }], 4);

  it('produces `weeks` columns of 7 days each', () => {
    expect(grid).toHaveLength(4);
    grid.forEach((col) => expect(col).toHaveLength(7));
  });

  it('buckets today into the right intensity level', () => {
    const cell = grid.flat().find((c) => c.date === today);
    expect(cell?.minutes).toBe(90);
    expect(cell?.level).toBe(3); // 61–120 min
  });

  it('leaves days without logs at level 0', () => {
    const others = grid.flat().filter((c) => c.date !== today);
    expect(others.every((c) => c.level === 0 && c.minutes === 0)).toBe(true);
  });
});
