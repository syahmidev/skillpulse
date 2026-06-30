import { describe, expect, it } from '@jest/globals';

import { learningLogSchema, milestoneSchema, skillSchema } from '../validations';

describe('skillSchema', () => {
  const valid = {
    name: 'React Native',
    category: 'mobile',
    currentLevel: 'beginner',
    targetLevel: 'intermediate',
    status: 'active',
  };

  it('accepts a valid skill', () => {
    expect(skillSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    expect(skillSchema.safeParse({ ...valid, name: 'R' }).success).toBe(false);
  });

  it('rejects an unknown category', () => {
    expect(skillSchema.safeParse({ ...valid, category: 'wizardry' }).success).toBe(false);
  });
});

describe('learningLogSchema', () => {
  const valid = {
    skillId: 'abc',
    title: 'Learned routing',
    durationMinutes: 60,
    logDate: '2026-06-23',
  };

  it('accepts a valid log', () => {
    expect(learningLogSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a duration of 0', () => {
    expect(learningLogSchema.safeParse({ ...valid, durationMinutes: 0 }).success).toBe(false);
  });

  it('rejects a title shorter than 3 characters', () => {
    expect(learningLogSchema.safeParse({ ...valid, title: 'hi' }).success).toBe(false);
  });
});

describe('milestoneSchema', () => {
  it('accepts a valid milestone', () => {
    expect(milestoneSchema.safeParse({ skillId: 'abc', title: 'Build first APK' }).success).toBe(
      true
    );
  });

  it('rejects a short title', () => {
    expect(milestoneSchema.safeParse({ skillId: 'abc', title: 'go' }).success).toBe(false);
  });

  it('rejects a missing skill id', () => {
    expect(milestoneSchema.safeParse({ skillId: '', title: 'Build first APK' }).success).toBe(
      false
    );
  });
});
