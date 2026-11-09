# Optimization design

Pure deterministic TypeScript modules implement date arithmetic, individual PTO recommendations, and later group scheduling. No network or LLM dependency is permitted in the engine.

## Calendar model

Use validated Gregorian date-only strings (YYYY-MM-DD) with a centralized UTC-based arithmetic helper. Validate by round-trip components; never parse local midnight or use elapsed local hours to count days. Inclusive ranges are explicit. Workweeks are sets of weekdays. Confirmed employer-observed holiday dates exclude scheduled workdays from PTO requirements; public holiday suggestions do not.

PTO balances are keyed by calendar year so cross-year windows cannot spend the wrong year's allowance. Blackout ranges are normalized before overlap checks. Inputs are immutable; results include assumptions and deterministic explanations.

## Individual recommendations

Enumerate candidate starts within a bounded preferred period for the requested duration. Reject invalid ranges, blackouts and yearly balance violations. Count scheduled workdays excluding confirmed holidays. Return dates, consecutive days away, PTO cost by year, contributing holidays and remaining balances. Rank by total required PTO, then start date. Empty results explain constraints and suggest editing them, without silently relaxing hard rules.

The first sprint covers individual fixed-duration windows. Annual allocation is a separate story using non-overlapping windows and per-year budgets; do not label a greedy result globally optimal.

## Group scheduling (later)

Reuse date/PTO primitives server-side. Distinguish unknown submissions, tentative availability and confirmed attendance. Hard conflicts are never relaxed automatically. Default ranking prioritizes full participation, then maximum individual relative PTO burden, then total PTO, then date. Configurable priorities require explicit labels and stable tie-breaking. Partial-attendance compromises are separately labeled; never silently exclude a participant for a better score.

Responses expose safe aggregate explanations, not individual private budgets/balances. Version inputs and recommendations to detect late changes. Test incomplete responses, inequitable burden, ties and stale options before connecting voting.
