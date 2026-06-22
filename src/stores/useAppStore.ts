import { create } from 'zustand';

import type { SkillCategory } from '@/constants/options';

// UI / ephemeral state only. Persisted records live in SQLite (see ARCHITECTURE.md).
type AppState = {
  // Active category filter on the Skills screen ('all' = no filter).
  skillCategoryFilter: SkillCategory | 'all';
  setSkillCategoryFilter: (filter: SkillCategory | 'all') => void;
};

export const useAppStore = create<AppState>((set) => ({
  skillCategoryFilter: 'all',
  setSkillCategoryFilter: (skillCategoryFilter) => set({ skillCategoryFilter }),
}));
