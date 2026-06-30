import { describe, expect, it } from '@jest/globals';

import { formatDuration, formatHours } from '../format';

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(45)).toBe('45m');
  });

  it('formats whole hours without minutes', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(120)).toBe('2h');
  });

  it('formats hours and minutes together', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(125)).toBe('2h 5m');
  });
});

describe('formatHours', () => {
  it('renders a one-decimal hours label', () => {
    expect(formatHours(0)).toBe('0h');
    expect(formatHours(90)).toBe('1.5h');
    expect(formatHours(150)).toBe('2.5h');
  });
});
