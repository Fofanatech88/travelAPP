import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  addDays,
  calculatePto,
  type VacationOpportunity,
} from '../../domain/pto';
import { tokens } from '../../design/tokens';
import { shareSummary } from '../../services/sharing/shareSummary';

type Holiday = { date: string; name: string };
type BudgetFields = { allowance: string; balance: string };
function Field({
  label,
  value,
  onChange,
  numeric = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  numeric?: boolean;
  hint?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        keyboardType={numeric ? 'number-pad' : 'default'}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}
export function PtoPlanner() {
  const [goal, setGoal] = useState<'solo' | 'group'>('solo');
  const [start, setStart] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [end, setEnd] = useState(() => addDays(start, 89));
  const [duration, setDuration] = useState('9');
  const [budgets, setBudgets] = useState<Record<string, BudgetFields>>(() => ({
    [start.slice(0, 4)]: { allowance: '20', balance: '10' },
  }));
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [blackouts, setBlackouts] = useState<
    { startDate: string; endDate: string }[]
  >([]);
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [options, setOptions] = useState<VacationOpportunity[] | null>(null);
  const shareAttempt = useRef(0);
  const resultRef = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    if (options === null) return;
    const summary = options.length
      ? `Found ${options.length} vacation opportunities. Best option uses ${options[0]?.ptoDates.length} PTO days.`
      : 'No vacation windows fit yet. Review your constraints.';
    if (Platform.OS === 'web') resultRef.current?.focus();
    else AccessibilityInfo.announceForAccessibility(summary);
  }, [options]);
  const crossYear = start.slice(0, 4) !== end.slice(0, 4);
  const startYear = start.slice(0, 4);
  const endYear = end.slice(0, 4);
  const emptyBudget: BudgetFields = { allowance: '', balance: '' };
  const currentBudget = budgets[startYear] ?? emptyBudget;
  const nextBudget = budgets[endYear] ?? emptyBudget;
  function edited(change: () => void) {
    shareAttempt.current += 1;
    change();
    setOptions(null);
    setError('');
    setShareStatus('');
    setManualSummary('');
  }
  function editBudget(year: string, field: keyof BudgetFields, value: string) {
    edited(() =>
      setBudgets((previous) => ({
        ...previous,
        [year]: { ...(previous[year] ?? emptyBudget), [field]: value },
      })),
    );
  }
  function calculate() {
    const integer = (v: string) => (/^\d+$/.test(v) ? Number(v) : Number.NaN);
    const input = {
      startDate: start,
      endDate: end,
      duration: integer(duration),
      budgets: [
        {
          year: Number(start.slice(0, 4)),
          allowance: integer(currentBudget.allowance),
          balance: integer(currentBudget.balance),
        },
        ...(crossYear
          ? [
              {
                year: Number(end.slice(0, 4)),
                allowance: integer(nextBudget.allowance),
                balance: integer(nextBudget.balance),
              },
            ]
          : []),
      ],
      employerHolidays: holidays,
      blackouts,
    };
    const result = calculatePto(input);
    if (result.status === 'invalid') {
      setError(
        result.issues
          .map((i) => `${i.path.join('.') || 'Input'}: ${i.message}`)
          .join(' '),
      );
      setOptions(null);
      return;
    }
    setError('');
    setOptions(result.opportunities);
  }
  async function share(option: VacationOpportunity) {
    const attempt = ++shareAttempt.current;
    const summary = `Vacation idea: ${option.startDate} to ${option.endDate}. ${option.daysAway} days away using ${option.ptoDates.length} PTO days, assuming Monday–Friday work and confirmed employer holidays. Leave still requires employer approval.`;
    setManualSummary('');
    setShareStatus('');
    const outcome = await shareSummary(summary);
    if (attempt !== shareAttempt.current) return;
    setShareStatus(
      {
        shared: 'Vacation summary shared.',
        copied: 'Vacation summary copied.',
        cancelled: 'Sharing cancelled.',
        manual: 'Select and copy this vacation summary:',
      }[outcome],
    );
    if (outcome === 'manual') setManualSummary(summary);
  }
  return (
    <View style={styles.container}>
      <Text role="heading" style={styles.title}>
        Make your time off go further.
      </Text>
      <Text style={styles.body}>
        Find a break that fits your balance. No account needed.
      </Text>
      <Text style={styles.label}>Who are you planning for?</Text>
      <View style={styles.row}>
        {(['solo', 'group'] as const).map((g) => (
          <Pressable
            key={g}
            accessibilityRole="radio"
            accessibilityState={{ checked: goal === g }}
            onPress={() => setGoal(g)}
            style={[styles.choice, goal === g && styles.selected]}
          >
            <Text style={styles.label}>
              {g === 'solo' ? 'Just me' : 'With friends'}
            </Text>
          </Pressable>
        ))}
      </View>
      {goal === 'group' && (
        <Text style={styles.hint}>
          Start with your own dates. Group invitations come later.
        </Text>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>Your workweek: Monday–Friday</Text>
        <Text style={styles.hint}>
          Saturday and Sunday are days off. US planning baseline; employer
          holidays are set below. Coverage: 2026–2028.
        </Text>
        <Field
          label="Search from (YYYY-MM-DD)"
          value={start}
          onChange={(v) => edited(() => setStart(v))}
        />
        <Field
          label="Search through (YYYY-MM-DD)"
          value={end}
          onChange={(v) => edited(() => setEnd(v))}
          hint="Choose up to 366 consecutive days."
        />
        <Field
          label="Vacation length in days"
          value={duration}
          onChange={(v) => edited(() => setDuration(v))}
          numeric
          hint="1–30 consecutive calendar days, including weekends."
        />
        <Field
          label="Annual PTO allowance"
          value={currentBudget.allowance}
          onChange={(v) => editBudget(startYear, 'allowance', v)}
          hint={`For ${startYear}. Enter the allowance for this calendar year.`}
          numeric
        />
        <Field
          label="Available PTO balance"
          value={currentBudget.balance}
          onChange={(v) => editBudget(startYear, 'balance', v)}
          numeric
          hint="Whole days you can still use. We do not assume accrual or carryover."
        />
        {crossYear && (
          <>
            <Field
              label="Next year annual allowance"
              value={nextBudget.allowance}
              onChange={(v) => editBudget(endYear, 'allowance', v)}
              hint={`For ${endYear}. Required; we do not assume future leave.`}
              numeric
            />
            <Field
              label="Next year available balance"
              value={nextBudget.balance}
              onChange={(v) => editBudget(endYear, 'balance', v)}
              hint={`Enter the days actually available in ${endYear}.`}
              numeric
            />
          </>
        )}
      </View>
      <View style={styles.card}>
        <Text role="heading" style={styles.subtitle}>
          Your employer’s days off
        </Text>
        <Text style={styles.body}>
          Only add dates your employer gives you off. Public holidays are not
          automatically included. An empty list means no employer holidays.
        </Text>
        {holidays.map((h, index) => (
          <View key={index} style={styles.card}>
            <Field
              label={`Holiday ${index + 1} date (YYYY-MM-DD)`}
              value={h.date}
              onChange={(v) =>
                edited(() =>
                  setHolidays(
                    holidays.map((item, i) =>
                      i === index ? { ...item, date: v } : item,
                    ),
                  ),
                )
              }
            />
            <Field
              label={`Holiday ${index + 1} name`}
              value={h.name}
              onChange={(v) =>
                edited(() =>
                  setHolidays(
                    holidays.map((item, i) =>
                      i === index ? { ...item, name: v } : item,
                    ),
                  ),
                )
              }
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove holiday ${index + 1}`}
              style={styles.secondary}
              onPress={() =>
                edited(() =>
                  setHolidays(holidays.filter((_, i) => i !== index)),
                )
              }
            >
              <Text style={styles.label}>Remove holiday</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          style={styles.secondary}
          onPress={() =>
            edited(() => setHolidays([...holidays, { date: '', name: '' }]))
          }
        >
          <Text style={styles.label}>Add employer holiday</Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Dates you can’t travel</Text>
        {blackouts.map((range, index) => (
          <View key={index} style={styles.field}>
            <Field
              label={`Unavailable ${index + 1} from (YYYY-MM-DD)`}
              value={range.startDate}
              onChange={(v) =>
                edited(() =>
                  setBlackouts(
                    blackouts.map((item, i) =>
                      i === index ? { ...item, startDate: v } : item,
                    ),
                  ),
                )
              }
            />
            <Field
              label={`Unavailable ${index + 1} through (YYYY-MM-DD)`}
              value={range.endDate}
              onChange={(v) =>
                edited(() =>
                  setBlackouts(
                    blackouts.map((item, i) =>
                      i === index ? { ...item, endDate: v } : item,
                    ),
                  ),
                )
              }
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove unavailable range ${index + 1}`}
              style={styles.secondary}
              onPress={() =>
                edited(() =>
                  setBlackouts(blackouts.filter((_, i) => i !== index)),
                )
              }
            >
              <Text style={styles.label}>Remove range</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          style={styles.secondary}
          onPress={() =>
            edited(() =>
              setBlackouts([...blackouts, { startDate: '', endDate: '' }]),
            )
          }
        >
          <Text style={styles.label}>Add unavailable dates</Text>
        </Pressable>
      </View>
      {error !== '' && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={calculate}
        style={styles.primary}
      >
        <Text style={styles.primaryText}>Find my vacation windows</Text>
      </Pressable>
      {options !== null && (
        <View
          ref={resultRef}
          tabIndex={-1}
          accessibilityLiveRegion="polite"
          style={styles.container}
        >
          <Text role="heading" style={styles.subtitle}>
            {options.length
              ? 'Your vacation opportunities'
              : 'No vacation windows fit yet'}
          </Text>
          <Text style={styles.body}>
            {options.length
              ? options[0]?.rankReason
              : 'Try a shorter break, a wider search period, or review your balance and unavailable dates. Your hard constraints have not been relaxed.'}
          </Text>
          {options.map((option, index) => (
            <View key={option.startDate} style={styles.card}>
              <Text style={styles.label}>
                {index === 0 ? 'Best PTO value' : 'Alternative'} ·{' '}
                {option.startDate} → {option.endDate}
              </Text>
              <Text style={styles.subtitle}>
                {option.daysAway} days away · {option.ptoDates.length} PTO days
              </Text>
              <Text style={styles.body}>
                {option.daysAway - option.ptoDates.length} days need no PTO,
                covered by weekends and {option.ptoSaved} confirmed holiday
                workdays.
              </Text>
              <Text style={styles.hint}>
                PTO dates: {option.ptoDates.join(', ') || 'None'}
              </Text>
              <Text style={styles.hint}>
                Contributing holidays:{' '}
                {option.holidays
                  .map((h) => `${h.name} (${h.date})`)
                  .join(', ') || 'None'}
              </Text>
              {Object.entries(option.remainingByYear).map(
                ([year, remaining]) => (
                  <Text key={year} style={styles.hint}>
                    {year}: {remaining} PTO days remaining after this option.
                  </Text>
                ),
              )}
              <Text style={styles.hint}>
                Each option is independent. Leave is not approved until your
                employer confirms it.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Share option ${index + 1}`}
                onPress={() => share(option)}
                style={styles.secondary}
              >
                <Text style={styles.label}>Share this idea</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {shareStatus !== '' && (
        <Text accessibilityLiveRegion="polite" style={styles.hint}>
          {shareStatus}
        </Text>
      )}
      {manualSummary !== '' && (
        <Text selectable style={styles.body}>
          {manualSummary}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 20 },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    color: tokens.colors.ink,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    color: tokens.colors.ink,
  },
  body: { fontSize: 17, lineHeight: 26, color: tokens.colors.muted },
  hint: { fontSize: 15, lineHeight: 23, color: tokens.colors.muted },
  label: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: tokens.colors.ink,
  },
  field: { gap: 8 },
  input: {
    minHeight: 52,
    padding: 14,
    borderWidth: 1,
    borderColor: tokens.colors.muted,
    borderRadius: 12,
    fontSize: 17,
    color: tokens.colors.ink,
    backgroundColor: '#FFF',
  },
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  choice: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    minHeight: 48,
  },
  selected: { borderColor: tokens.colors.ink, backgroundColor: '#E1EBDD' },
  primary: {
    minHeight: 56,
    padding: 18,
    borderRadius: 16,
    backgroundColor: tokens.colors.ink,
    alignItems: 'center',
  },
  primaryText: { fontSize: 17, fontWeight: '600', color: '#FFF' },
  secondary: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 8 },
  error: { fontSize: 16, lineHeight: 24, color: tokens.colors.accent },
});
