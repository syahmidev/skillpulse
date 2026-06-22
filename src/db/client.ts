import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

// Single SQLite connection for the app. Foreign keys are enabled so the
// `onDelete: 'cascade'` relations actually fire when a skill is removed.
export const sqlite = openDatabaseSync('skillpulse.db', {
  enableChangeListener: true,
});
sqlite.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });
