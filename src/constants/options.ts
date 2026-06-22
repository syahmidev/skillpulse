// Domain enums — single source for select options, Zod validation, and DB column types.

export const SKILL_CATEGORIES = [
  'frontend',
  'backend',
  'mobile',
  'database',
  'devops',
  'soft_skill',
  'other',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_STATUSES = ['active', 'paused', 'completed'] as const;
export type SkillStatus = (typeof SKILL_STATUSES)[number];

export const LOG_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type LogDifficulty = (typeof LOG_DIFFICULTIES)[number];

export const LEARNING_MOODS = ['productive', 'neutral', 'tired', 'confused'] as const;
export type LearningMood = (typeof LEARNING_MOODS)[number];

// Human-readable labels for UI selects/badges.
export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  database: 'Database',
  devops: 'DevOps',
  soft_skill: 'Soft Skill',
  other: 'Other',
};

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const STATUS_LABELS: Record<SkillStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
};

export const DIFFICULTY_LABELS: Record<LogDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const MOOD_LABELS: Record<LearningMood, string> = {
  productive: 'Productive',
  neutral: 'Neutral',
  tired: 'Tired',
  confused: 'Confused',
};
