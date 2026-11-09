import { z } from 'zod';
import {
  calendarDay,
  calendarYear,
  dateFromDay,
  isCalendarDate,
  isStandardWorkday,
} from './calendar';
export { addDays, calendarDay, calendarYear, isCalendarDate } from './calendar';

const calendarDateSchema = z
  .string()
  .refine(isCalendarDate, 'Enter a valid date in YYYY-MM-DD format.');
const planningDateSchema = calendarDateSchema.refine(
  (value) => value >= '2026-01-01' && value <= '2028-12-31',
  'Choose a planning date from 2026 through 2028.',
);
const dateRangeSchema = z
  .strictObject({ startDate: calendarDateSchema, endDate: calendarDateSchema })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: 'End date must be on or after start date.',
    path: ['endDate'],
  });
const budgetSchema = z
  .strictObject({
    year: z.number().int().min(1000).max(9999),
    allowance: z.number().int().min(0).max(366),
    balance: z.number().int().min(0).max(366),
  })
  .refine(({ allowance, balance }) => balance <= allowance, {
    message: 'Available PTO cannot exceed the annual allowance.',
    path: ['balance'],
  });
const holidaySchema = z.strictObject({
  date: calendarDateSchema,
  name: z.string().trim().min(1).max(100),
});

/** Only Monday–Friday schedules are supported by this first slice. All holidays
 * supplied here must already have been explicitly confirmed by the employee. */
export const ptoInputSchema = z
  .strictObject({
    startDate: planningDateSchema,
    endDate: planningDateSchema,
    duration: z.number().int().min(1).max(30),
    budgets: z.array(budgetSchema).min(1).max(3),
    employerHolidays: z.array(holidaySchema).max(1100),
    blackouts: z.array(dateRangeSchema).max(366),
  })
  .superRefine((input, context) => {
    if (!isCalendarDate(input.startDate) || !isCalendarDate(input.endDate))
      return;
    const horizon =
      calendarDay(input.endDate) - calendarDay(input.startDate) + 1;
    if (horizon < 1 || horizon > 366) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Choose a search period of 1–366 consecutive calendar days.',
      });
      return;
    }
    const years = new Set(input.budgets.map((budget) => budget.year));
    if (years.size !== input.budgets.length)
      context.addIssue({
        code: 'custom',
        path: ['budgets'],
        message: 'Provide exactly one PTO balance per year.',
      });
    for (
      let year = calendarYear(input.startDate);
      year <= calendarYear(input.endDate);
      year++
    ) {
      if (!years.has(year))
        context.addIssue({
          code: 'custom',
          path: ['budgets'],
          message: `Provide the annual allowance and available balance for ${year}.`,
        });
    }
  });

export type PtoInput = z.infer<typeof ptoInputSchema>;
export type EmployerHoliday = PtoInput['employerHolidays'][number];
export interface VacationOpportunity {
  startDate: string;
  endDate: string;
  daysAway: number;
  ptoDates: string[];
  holidays: EmployerHoliday[];
  ptoByYear: Record<number, number>;
  remainingByYear: Record<number, number>;
  /** PTO avoided specifically through confirmed holidays on scheduled workdays. */
  ptoSaved: number;
}

/** Exhaustively checks a bounded date range; ranks fixed-duration alternatives
 * by PTO cost and then earlier start. These alternatives are not an annual plan. */
export function optimizePto(value: PtoInput): VacationOpportunity[] {
  const input = ptoInputSchema.parse(value);
  const firstDay = calendarDay(input.startDate);
  const lastDay = calendarDay(input.endDate);
  const budgets = new Map(input.budgets.map((budget) => [budget.year, budget]));
  // A date grants at most one day off even if submitted repeatedly. Sorting names
  // makes the chosen explanation stable if conflicting duplicates are reordered.
  const holidays = new Map<string, EmployerHoliday>();
  for (const holiday of [...input.employerHolidays].sort(
    (a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name),
  )) {
    if (!holidays.has(holiday.date)) holidays.set(holiday.date, holiday);
  }
  const blackouts = input.blackouts.map((range) => ({
    start: calendarDay(range.startDate),
    end: calendarDay(range.endDate),
  }));
  const options: VacationOpportunity[] = [];
  for (let start = firstDay; start + input.duration - 1 <= lastDay; start++) {
    const end = start + input.duration - 1;
    if (blackouts.some((range) => start <= range.end && end >= range.start))
      continue;
    const option: VacationOpportunity = {
      startDate: dateFromDay(start),
      endDate: dateFromDay(end),
      daysAway: input.duration,
      ptoDates: [],
      holidays: [],
      ptoByYear: {},
      remainingByYear: {},
      ptoSaved: 0,
    };
    for (let day = start; day <= end; day++) {
      const date = dateFromDay(day);
      const year = calendarYear(date);
      option.ptoByYear[year] ??= 0;
      if (!isStandardWorkday(day)) continue;
      const holiday = holidays.get(date);
      if (holiday) {
        option.holidays.push({ ...holiday });
        option.ptoSaved++;
      } else {
        option.ptoDates.push(date);
        option.ptoByYear[year]++;
      }
    }
    let feasible = true;
    for (const [yearText, cost] of Object.entries(option.ptoByYear)) {
      const year = Number(yearText);
      const budget = budgets.get(year);
      if (!budget || cost > budget.balance) {
        feasible = false;
        break;
      }
      option.remainingByYear[year] = budget.balance - cost;
    }
    if (feasible) options.push(option);
  }
  return options
    .sort(
      (a, b) =>
        a.ptoDates.length - b.ptoDates.length ||
        a.startDate.localeCompare(b.startDate),
    )
    .slice(0, 3);
}
