import { describe, expect, it } from '@jest/globals';

import {
  calculateStreak,
  formatDisplayDate,
  getWeekRange,
  minutesToHours,
  toISODate,
} from '../date';

const dayOffset = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

describe('toISODate', () => {
  it('formats with zero-padded month and day', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toISODate(new Date(2026, 5, 24))).toBe('2026-06-24');
  });
});

describe('calculateStreak', () => {
  it('is 0 with no logs', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(calculateStreak([dayOffset(0)])).toBe(1);
    expect(calculateStreak([dayOffset(0), dayOffset(-1), dayOffset(-2)])).toBe(3);
  });

  it('ignores duplicate dates', () => {
    expect(calculateStreak([dayOffset(0), dayOffset(0), dayOffset(-1)])).toBe(2);
  });

  it('stops at the first gap', () => {
    expect(calculateStreak([dayOffset(0), dayOffset(-2)])).toBe(1);
  });

  it('is 0 when today has no log (today breaks the streak)', () => {
    expect(calculateStreak([dayOffset(-1), dayOffset(-2)])).toBe(0);
  });
});

describe('getWeekRange', () => {
  it('returns the Monday–Sunday range for a midweek date', () => {
    expect(getWeekRange(new Date(2026, 5, 24))).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });

  it('treats Sunday as the end of the same week', () => {
    expect(getWeekRange(new Date(2026, 5, 28))).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });

  it('treats Monday as the start of the week', () => {
    expect(getWeekRange(new Date(2026, 5, 22))).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });
});

describe('formatDisplayDate', () => {
  it('renders a human-readable date', () => {
    const out = formatDisplayDate('2026-06-23');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/23/);
  });
});

describe('minutesToHours', () => {
  it('converts minutes to hours rounded to one decimal', () => {
    expect(minutesToHours(90)).toBe(1.5);
    expect(minutesToHours(30)).toBe(0.5);
    expect(minutesToHours(0)).toBe(0);
  });
});
