/** "45m", "1h", "1h 30m" from a minute count. */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};

/** "12.5h" — total-hours label from a minute count. */
export const formatHours = (minutes: number): string =>
  `${Math.round((minutes / 60) * 10) / 10}h`;
