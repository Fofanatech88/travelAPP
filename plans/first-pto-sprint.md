# First PTO vertical slice — implementation plan

Status (2026-11-08): implemented locally with domain/component coverage and passing exported-browser checks; native acceptance and fresh independent review remain open. Current evidence: [Git/browser acceptance](../reports/git-browser-acceptance.md); historical evidence: reports/hardening.md. Candidate one-week cycle, with scope adjusted to actual capacity. Sources: [PRD](../docs/product/prd.md), [backlog PTO-01/02/03](../docs/product/backlog.md). Foundation checks and critical date/routing decisions must be established first. This plan does not authorize production deployment or expanded product scope.

## User story and success

As a working professional, I want to enter my real work/PTO constraints and receive a clear vacation opportunity without creating an account, so I can see which break is feasible before planning with friends.

Deliver one complete account-free input → calculation → explanation flow on web and shared iOS code. Roughly 60 seconds to first value is a usability target; demonstrate accuracy with test fixtures and then measure timing. No Supabase, paid API, permissions, or LLM is required to calculate.

## Ready/dependencies

- Foundation type/lint/test/web checks available; agent ownership and review workflow established.
- Dedicated calendar-date arithmetic contract documented and tested independently from UI.
- First slice uses manual employer-confirmed dates only. Official US federal presets are deferred until source provenance is verified; no calendar dataset is automatically applied.
- Initial date coverage: 2026–2028. Manual employer holidays require an exact date/name and explicit user entry. Search at most 366 consecutive dates; reject dates outside coverage. Cross-year windows require explicit balances for both years. Duration is one integer from 1–30 calendar days; PTO allowance and balance are whole days from 0–366, balance no greater than allowance. No accrual/carryover assumptions.
- Designer specifies validation, holiday confirmation, loading/no-result/error and reduced-motion behavior.

## Domain contracts

Keep pure TypeScript under src/domain/pto, without React, platform, database or network imports.

- CalendarDate: validated ISO YYYY-MM-DD value; arithmetic uses centralized civil-date/UTC-day helpers and never local-midnight parsing.
- DateRange: inclusive start/end, start <= end; merge overlapping blackouts.
- WorkSchedule: Monday–Friday only in this slice; no irregular or configurable workweeks yet.
- HolidayCandidate: date, name, jurisdiction, source/version and actual/observed relationship. EmployerObservedHoliday is the explicit confirmed subset; duplicates never double count.
- PtoProfile: country/jurisdiction, calendar year(s), allowance and available balance by year, workweek, employer holidays, preferred ranges, a fixed desired duration and unavailable ranges. Integers and ranges validated at boundaries with Zod; distinguish allowance from currently usable balance.
- VacationOpportunity: inclusive dates, consecutive calendar days away, exact required PTO dates/count per year, contributing confirmed holidays, remaining yearly balance, assumptions and deterministic rank reason.
- CalculationResult: validated opportunities or explicit no-results; invalid inputs yield structured validation errors, not impossible windows.

## Algorithm approach

1. Validate all bounds and normalize ranges/confirmed holiday dates once.
2. Enumerate candidate starts and the fixed desired duration inside the bounded search horizon.
3. Reject any window intersecting hard blackouts or violating selected periods.
4. For each calendar day, PTO is required only when it is a recurring workday and not a confirmed employer holiday. Weekend holidays do not grant another weekday unless its observed date is separately confirmed.
5. Count PTO by calendar year; reject windows exceeding the relevant available balance. Zero PTO remains valid. Explain the counted dates and residual balance.
6. Rank deterministically: minimize total required PTO for the fixed duration, then earlier start; document the initial objective rather than claiming globally best travel value.
7. Return a small deduplicated set of alternatives with a complete breakdown. Bound search work; test runtime on representative synthetic annual inputs.

Annual multi-window allocation is PTO-05: schedule after the basic slice unless capacity and acceptance allow. It must use nonoverlapping choices and unique PTO dates, not greedy claims of a global optimum. Do not claim annual optimization in this first slice.

## UI work

Welcome → select individual/group goal → concise PTO/workweek/year inputs → enter confirmed employer holiday dates → duration/period/blackouts → result with dates, days away, PTO dates, holidays and remaining balance → revise or share.

Use accessible labels and input hints, visible focus/error summaries on web, keyboard-safe layouts on iOS, large touch targets and centralized tokens. Preserve edits/back state. No account or permission request before result. Show honest unsupported-coverage and no-feasible-result messages. Result copy states that leave must be approved by the employer; holiday candidates are not automatically granted.

Sharing can begin as a privacy-safe summary through native share/web copy fallback; authenticated save belongs to PTO-04/ACC-01. Do not expose raw profile data in shared text or URLs. Analytics integration is not required to run locally; implement only approved typed events when scheduled.

## Work sequence and ownership

1. Optimization engineer: date contract, fixtures/provenance and engine interfaces, then independent unit tests and implementation.
2. Product designer/mobile engineer: agree flow and field requirements, implement forms/results using engine contract; avoid editing domain files concurrently.
3. QA engineer independently reviews acceptance and executes fixtures/browser journey; security reviewer examines sensitive data/share boundaries. Coordinator integrates fixes and evidence.

Use at most two implementation specialists at a time; independent review follows a stable change. Product manager validates behavior against scope. Keep the PR focused and update backlog status only with evidence.

## Acceptance criteria

- Anonymous user gets a correct explained result or actionable no-results without credentials/network/auth.
- Allowance/balance, recurring workweek, employer-confirmed holidays, duration, preferred periods and blackouts affect results consistently.
- Required PTO dates, holiday contribution and remaining balance reconcile exactly; unconfirmed holidays do not reduce PTO.
- Zero balance can yield a zero-PTO break; insufficient balance never yields a falsely feasible option.
- Inputs reject malformed dates/ranges, impossible dates, negative/noninteger PTO and invalid weekdays. Editing/recalculation updates results.
- Stable tie-breaking, cross-year behavior and source assumptions are visible and tested. Device timezone cannot change a calendar result.
- Accessible loading/empty/error/success behavior and sharing privacy reviewed; native execution limitations reported honestly.

## Required tests and evidence

Unit fixtures: zero PTO; one-day PTO; no windows; weekday and weekend holidays; separately confirmed observed dates; duplicate holidays; Monday–Friday boundaries; unsupported workweek overrides rejected; leap/nonleap February; Dec–Jan boundaries with yearly limits; America/New_York DST boundaries and another timezone; reversed/impossible ranges; overlapping blackouts; inclusive endpoints; exact/exceeded PTO limits; equal-option ties. Run identical fixtures in multiple TZ environments. PTO-05 later adds annual allocations and overlapping-choice tests.

Integration/UI: unauthenticated calculation with missing backend config; validation recovery/back preservation; changing a holiday changes exact PTO count; no-results guidance; accessible field labels; safe shared summary. Browser E2E covers welcome-to-result on a narrow viewport and refresh behavior as appropriate. Native smoke on simulator/device when available; a web export is not native validation.

Completion requires typecheck, lint, formatting and relevant unit/UI/browser checks actually passing; independent review; documented source coverage and known limitations; no unresolved critical/high defects; founder-reproducible demo commands; updated backlog, QA report and implementation notes. Mark native verification blocked if Xcode/device access is unavailable. Do not mark the entire MVP complete after this slice.
