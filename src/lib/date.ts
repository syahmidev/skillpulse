/** Full ISO timestamp for created_at / updated_at columns. */
export const nowISO = (): string => new Date().toISOString();

/** Local calendar date as YYYY-MM-DD (used for log_date and streak math). */
export const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const todayISODate = (): string => toISODate(new Date());

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/**
 * Current streak = consecutive calendar days, ending today, that each have at
 * least one learning log. If today has no log yet, the streak is 0 — today
 * breaks the streak (intentionally strict, per the product spec).
 *
 * @param logDates any collection of YYYY-MM-DD strings (duplicates allowed)
 */
export const calculateStreak = (logDates: Iterable<string>): number => {
  const days = new Set(logDates);
  if (days.size === 0) return 0;

  let streak = 0;
  let cursor = new Date();
  while (days.has(toISODate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

export type WeekRange = { start: string; end: string };

/**
 * Monday–Sunday week range (as YYYY-MM-DD) containing the reference date.
 * Matches the weekly chart in the spec which starts on Monday.
 */
export const getWeekRange = (ref: Date = new Date()): WeekRange => {
  const day = ref.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = addDays(ref, mondayOffset);
  const end = addDays(start, 6);
  return { start: toISODate(start), end: toISODate(end) };
};

export const minutesToHours = (minutes: number): number =>
  Math.round((minutes / 60) * 10) / 10;

/** "Jun 23, 2026" from a YYYY-MM-DD string (parsed as a local date). */
export const formatDisplayDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
