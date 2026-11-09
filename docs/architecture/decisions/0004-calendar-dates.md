# ADR 0004: Date-only deterministic PTO calculations

Status: accepted. Date: 2026-11-01.

## Decision

Represent travel dates as validated Gregorian YYYY-MM-DD values and database DATE fields. Centralize calendar arithmetic using UTC components and integer calendar-day steps. Events use UTC timestamps separately. Count workdays from recurring weekday schedules, subtract only confirmed employer-observed holidays, and enforce PTO balances per year.

## Alternatives and consequences

Local-midnight Date arithmetic can cross daylight-saving boundaries incorrectly. Treating government holidays as guaranteed time off overstates benefits. An external optimizer adds network dependency and cost. Central helpers and deterministic tests keep calculations reproducible; strict validation, leap-year tests, cross-year accounting and multiple process-time-zone runs are mandatory.
