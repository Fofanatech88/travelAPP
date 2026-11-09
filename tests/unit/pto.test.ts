import { describe, expect, it } from 'vitest';
import {
  addDays,
  isCalendarDate,
  optimizePto,
  ptoInputSchema,
  type PtoInput,
} from '../../src/domain/pto';

const base: PtoInput = {
  startDate: '2026-07-03',
  endDate: '2026-07-05',
  duration: 3,
  budgets: [{ year: 2026, allowance: 20, balance: 10 }],
  employerHolidays: [],
  blackouts: [],
};

describe('date-only calendar helpers', () => {
  it('validates actual dates rather than normalized timestamps', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
    for (const value of [
      '2027-02-29',
      '2026-02-30',
      '2026-13-01',
      '2026-00-01',
      '2026-1-01',
      '2026-01-01T00:00:00Z',
    ]) {
      expect(isCalendarDate(value)).toBe(false);
    }
  });
  it('increments across leap, year and daylight-saving boundaries', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09');
    expect(addDays('2026-11-01', 1)).toBe('2026-11-02');
  });
});

describe('PTO input boundaries', () => {
  it.each([2025, 2029])(
    'rejects holiday and blackout dates outside coverage: %s',
    (year) => {
      expect(
        ptoInputSchema.safeParse({
          ...base,
          employerHolidays: [{ date: `${year}-07-03`, name: 'Outside' }],
        }).success,
      ).toBe(false);
      for (const range of [
        { startDate: `${year}-01-01`, endDate: '2028-12-31' },
        { startDate: '2026-01-01', endDate: `${year}-12-31` },
      ])
        expect(
          ptoInputSchema.safeParse({ ...base, blackouts: [range] }).success,
        ).toBe(false);
    },
  );
  it.each([
    { duration: 0 },
    { duration: 31 },
    { duration: 1.5 },
    { startDate: '2026-07-06' },
    { startDate: 'bad' },
    { endDate: '2027-07-04' },
    { budgets: [{ year: 2026, allowance: 5, balance: 6 }] },
    { budgets: [{ year: 2026, allowance: 20, balance: -1 }] },
    { budgets: [{ year: 2026, allowance: 20, balance: 1.5 }] },
    { budgets: [{ year: 2026, allowance: 367, balance: 0 }] },
    { budgets: [] },
    { budgets: [base.budgets[0], base.budgets[0]] },
    { blackouts: [{ startDate: '2026-07-05', endDate: '2026-07-03' }] },
    { employerHolidays: [{ date: '2026-02-30', name: 'Invalid' }] },
  ])('rejects invalid or contradictory input %j', (change) => {
    expect(ptoInputSchema.safeParse({ ...base, ...change }).success).toBe(
      false,
    );
  });
  it.each([2025, 2029])(
    'rejects search dates outside supported coverage: %s',
    (year) => {
      expect(
        ptoInputSchema.safeParse({
          ...base,
          startDate: `${year}-07-03`,
          endDate: `${year}-07-05`,
          budgets: [{ year, allowance: 20, balance: 10 }],
        }).success,
      ).toBe(false);
    },
  );
  it('rejects a cross-year search ending beyond coverage', () => {
    expect(
      ptoInputSchema.safeParse({
        ...base,
        startDate: '2028-12-30',
        endDate: '2029-01-02',
        budgets: [
          { year: 2028, allowance: 20, balance: 10 },
          { year: 2029, allowance: 20, balance: 10 },
        ],
      }).success,
    ).toBe(false);
  });
  it('requires both yearly budgets across a search range', () => {
    expect(
      ptoInputSchema.safeParse({
        ...base,
        startDate: '2026-12-30',
        endDate: '2027-01-03',
      }).success,
    ).toBe(false);
  });
  it('rejects unsupported work-schedule overrides rather than silently ignoring them', () => {
    expect(
      ptoInputSchema.safeParse({ ...base, workdays: [0, 1] }).success,
    ).toBe(false);
  });
  it('accepts the inclusive 366-day horizon', () => {
    expect(
      ptoInputSchema.safeParse({
        ...base,
        startDate: '2028-01-01',
        endDate: '2028-12-31',
        budgets: [{ year: 2028, allowance: 20, balance: 10 }],
      }).success,
    ).toBe(true);
  });
});

describe('explainable fixed-duration recommendations', () => {
  it('requires one PTO day for Friday through Sunday without assuming a government holiday', () => {
    const result = optimizePto(base)[0];
    expect(result).toMatchObject({
      startDate: '2026-07-03',
      endDate: '2026-07-05',
      daysAway: 3,
      ptoDates: ['2026-07-03'],
      ptoByYear: { 2026: 1 },
      remainingByYear: { 2026: 9 },
      holidays: [],
      ptoSaved: 0,
    });
  });
  it('counts only explicitly confirmed employer holidays', () => {
    const [result] = optimizePto({
      ...base,
      employerHolidays: [
        { date: '2026-07-03', name: 'Employer-observed holiday' },
      ],
    });
    expect(result).toMatchObject({
      ptoDates: [],
      ptoByYear: { 2026: 0 },
      remainingByYear: { 2026: 10 },
      ptoSaved: 1,
      holidays: [{ date: '2026-07-03', name: 'Employer-observed holiday' }],
    });
  });
  it('does not shift weekend holidays to weekdays automatically', () => {
    const [result] = optimizePto({
      ...base,
      employerHolidays: [{ date: '2026-07-04', name: 'Saturday holiday' }],
    });
    expect(result?.ptoDates).toEqual(['2026-07-03']);
    expect(result?.holidays).toEqual([]);
    expect(result?.ptoSaved).toBe(0);
  });
  it('deduplicates confirmed holidays without double-counting savings', () => {
    const holiday = { date: '2026-07-03', name: 'Observed day' };
    const [result] = optimizePto({
      ...base,
      employerHolidays: [holiday, holiday],
    });
    expect(result?.holidays).toHaveLength(1);
    expect(result?.ptoSaved).toBe(1);
  });
  it('supports zero PTO weekends and rejects insufficient weekday PTO', () => {
    const zero = [{ year: 2026, allowance: 0, balance: 0 }];
    expect(optimizePto({ ...base, budgets: zero })).toEqual([]);
    expect(
      optimizePto({
        ...base,
        startDate: '2026-07-04',
        duration: 2,
        budgets: zero,
      })[0]?.ptoDates,
    ).toEqual([]);
  });
  it('enforces the exact available limit', () => {
    expect(
      optimizePto({
        ...base,
        budgets: [{ year: 2026, allowance: 1, balance: 1 }],
      }),
    ).toHaveLength(1);
    expect(
      optimizePto({
        ...base,
        startDate: '2026-07-02',
        duration: 4,
        budgets: [{ year: 2026, allowance: 1, balance: 1 }],
      }),
    ).toEqual([]);
  });
  it('rejects windows intersecting blackout endpoints or overlapping blackout ranges', () => {
    const blackouts = [
      { startDate: '2026-07-01', endDate: '2026-07-03' },
      { startDate: '2026-07-02', endDate: '2026-07-04' },
    ];
    expect(optimizePto({ ...base, blackouts })).toEqual([]);
  });
  it('returns no windows when requested duration is longer than the search range', () => {
    expect(optimizePto({ ...base, duration: 4 })).toEqual([]);
  });
  it('separates cross-year cost and remaining balances', () => {
    const input = {
      ...base,
      startDate: '2026-12-31',
      endDate: '2027-01-03',
      duration: 4,
      budgets: [
        { year: 2026, allowance: 20, balance: 1 },
        { year: 2027, allowance: 20, balance: 2 },
      ],
    };
    expect(optimizePto(input)[0]).toMatchObject({
      ptoDates: ['2026-12-31', '2027-01-01'],
      ptoByYear: { 2026: 1, 2027: 1 },
      remainingByYear: { 2026: 0, 2027: 1 },
    });
    expect(
      optimizePto({
        ...input,
        budgets: [
          { year: 2026, allowance: 20, balance: 0 },
          { year: 2027, allowance: 20, balance: 10 },
        ],
      }),
    ).toEqual([]);
  });
  it('counts leap day and DST weekends using calendar dates', () => {
    const leap = optimizePto({
      ...base,
      startDate: '2028-02-28',
      endDate: '2028-03-01',
      budgets: [{ year: 2028, allowance: 20, balance: 10 }],
    })[0];
    expect(leap?.ptoDates).toEqual(['2028-02-28', '2028-02-29', '2028-03-01']);
    expect(
      optimizePto({
        ...base,
        startDate: '2026-03-07',
        endDate: '2026-03-09',
      })[0]?.ptoDates,
    ).toEqual(['2026-03-09']);
  });
  it('ranks minimum PTO first then earliest date and limits alternatives to three', () => {
    const input = {
      ...base,
      startDate: '2026-07-01',
      endDate: '2026-07-12',
      duration: 2,
    };
    const result = optimizePto(input);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.startDate)).toEqual([
      '2026-07-04',
      '2026-07-11',
      '2026-07-03',
    ]);
    expect(optimizePto(input)).toEqual(result);
  });
  it('does not mutate inputs and gives every returned window a reconcilable explanation', () => {
    const input = structuredClone(base);
    const before = structuredClone(input);
    const result = optimizePto(input);
    expect(input).toEqual(before);
    for (const option of result) {
      expect(Object.values(option.ptoByYear).reduce((a, b) => a + b, 0)).toBe(
        option.ptoDates.length,
      );
      expect(option.ptoSaved).toBe(option.holidays.length);
    }
  });
});
