import { z } from 'zod';

import {
  LEARNING_MOODS,
  LOG_DIFFICULTIES,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_STATUSES,
} from '@/constants/options';

export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters'),
  category: z.enum(SKILL_CATEGORIES),
  currentLevel: z.enum(SKILL_LEVELS),
  targetLevel: z.enum(SKILL_LEVELS),
  status: z.enum(SKILL_STATUSES),
  goal: z.string().optional(),
});
export type SkillFormValues = z.infer<typeof skillSchema>;

export const learningLogSchema = z.object({
  skillId: z.string().min(1, 'Skill is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  notes: z.string().optional(),
  durationMinutes: z.number().min(1, 'Duration must be more than 0 minutes'),
  difficulty: z.enum(LOG_DIFFICULTIES).optional(),
  mood: z.enum(LEARNING_MOODS).optional(),
  logDate: z.string().min(1, 'Log date is required'),
});
export type LearningLogFormValues = z.infer<typeof learningLogSchema>;

export const milestoneSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  title: z.string().min(3, 'Milestone title must be at least 3 characters'),
});
export type MilestoneFormValues = z.infer<typeof milestoneSchema>;
