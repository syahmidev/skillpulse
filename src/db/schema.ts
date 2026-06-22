import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type {
  LearningMood,
  LogDifficulty,
  SkillCategory,
  SkillLevel,
  SkillStatus,
} from '@/constants/options';

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').$type<SkillCategory>().notNull(),
  currentLevel: text('current_level').$type<SkillLevel>().notNull(),
  targetLevel: text('target_level').$type<SkillLevel>().notNull(),
  status: text('status').$type<SkillStatus>().notNull(),
  goal: text('goal'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const learningLogs = sqliteTable('learning_logs', {
  id: text('id').primaryKey(),
  skillId: text('skill_id')
    .notNull()
    .references(() => skills.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  notes: text('notes'),
  durationMinutes: integer('duration_minutes').notNull(),
  difficulty: text('difficulty').$type<LogDifficulty>(),
  mood: text('mood').$type<LearningMood>(),
  logDate: text('log_date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const milestones = sqliteTable('milestones', {
  id: text('id').primaryKey(),
  skillId: text('skill_id')
    .notNull()
    .references(() => skills.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Record types derived from the schema — the canonical type source.
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type LearningLog = typeof learningLogs.$inferSelect;
export type NewLearningLog = typeof learningLogs.$inferInsert;

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
