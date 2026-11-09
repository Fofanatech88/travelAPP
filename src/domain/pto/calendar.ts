const DAY_MS = 86_400_000;

/** Gregorian civil date, deliberately independent of the device time zone. */
export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number);
  if (year < 1000 || year > 9999) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function calendarDay(value: string): number {
  if (!isCalendarDate(value))
    throw new RangeError('Enter a valid YYYY-MM-DD calendar date.');
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

export function dateFromDay(day: number): string {
  if (!Number.isInteger(day))
    throw new RangeError('Calendar day must be an integer.');
  const value = new Date(day * DAY_MS).toISOString().slice(0, 10);
  if (!isCalendarDate(value))
    throw new RangeError('Calendar date is out of range.');
  return value;
}

export function addDays(value: string, days: number): string {
  if (!Number.isInteger(days))
    throw new RangeError('Day increment must be an integer.');
  return dateFromDay(calendarDay(value) + days);
}

export function isStandardWorkday(day: number): boolean {
  const weekday = new Date(day * DAY_MS).getUTCDay();
  return weekday >= 1 && weekday <= 5;
}

export function calendarYear(value: string): number {
  return Number(value.slice(0, 4));
}
