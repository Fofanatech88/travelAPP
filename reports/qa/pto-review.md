# PTO first-slice independent QA review

Date: 2026-11-01. Reviewer: `/root/foundation_qa`, a generic delegated QA specialist. Read-only review of implementation and existing tests; only this report written. The reviewer did not author the engine or planner. This does not prove configured `.codex` role discovery or enforced separate read-only permissions.

## Actual checks

- Read `src/domain/pto/index.ts`, `calendar.ts`, `src/features/pto/PtoPlanner.tsx`, route/welcome/layout code, and existing domain/component tests.
- Ran `npm test -- tests/unit/pto.test.ts` independently under `TZ=UTC`, `TZ=America/New_York`, and `TZ=Pacific/Auckland`, using Node 24.22.2: **34/34 passed in each environment**.
- Ran an independent inline enumeration oracle using Vite SSR loading: **120/120 scenarios passed**. Months January/February/March/July/November/December of leap year 2028 × durations 1/2/3/9/30 × balances 0/1/5/20. The oracle enumerated dates using UTC-noon timestamps, counted Mon–Fri except one explicitly configured employer day on the third, and compared top-three start dates, PTO costs and exact PTO dates. Vite emitted a blocked HMR WebSocket bind warning, but module evaluation/oracle completed and the process exited zero; no UI/browser result is inferred.
- Component runner alignment is coordinator-owned and was in progress at review time; this reviewer did not independently execute component tests. Browser/native runtime was not exercised by this review.

## Behavior reviewed

Input schema rejects impossible/non-padded dates, unsupported search coverage, horizons over 366 days, reversed ranges, negative/fractional/excess PTO, balance greater than allowance, duplicate/missing yearly balances, malformed holiday/range values and unsupported workday overrides. UI uses a whole-digit check before conversion; it does not silently truncate fractional or malformed numeric inputs.

The engine validates again at its public boundary, centralizes UTC calendar-day arithmetic, uses inclusive windows and blackout intersections, budgets PTO by calendar year, counts only explicit employer holidays on weekdays and deduplicates holidays by date. It returns deterministic minimum-cost/earliest alternatives, not a claimed annual allocation. No government holiday or observed substitute is assumed. Weekend holidays create no extra free weekday.

The form clears prior recommendations on all calculation-input edits. Invalid inputs remove results and show validation errors; insufficient PTO yields an explicit no-result state without relaxing constraints. Remaining balances are per independent option, and employer approval remains explicitly pending. Personal inputs remain in component memory; no auth/network/analytics requests or sensitive URL properties are introduced by the PTO module. Shared text contains result dates/cost/assumptions only, excluding allowance, remaining balances, blackouts and private profile data.

## Findings

No blocking calendar arithmetic, yearly-balance, input-validation or stale-calculation defect found in the reviewed implementation.

### PTO-QA-01 — Medium: result discovery requires platform accessibility verification

After calculation, results append below the full form. Source includes `accessibilityLiveRegion="polite"`, but no explicit native accessibility announcement, screen-reader focus transfer or scroll-to-results behavior. Android live regions do not establish equivalent iOS VoiceOver behavior. Web keyboard users can remain on the submit control with results below the viewport.

Recommendation: add an accessible result/error announcement or focus transition suitable for each platform, avoid unexpected focus while editing, and verify VoiceOver/keyboard behavior on a running app. This is a usability/accessibility acceptance gap, not evidence of incorrect PTO arithmetic.

### PTO-QA-02 — Low: field validation is aggregated

Errors are concatenated into a single alert without associating individual messages with their corresponding fields. A user can recover by editing labeled inputs, but a form with multiple holiday/blackout rows may be hard to correct.

Recommendation: group or link errors to fields when refining onboarding; keep whole-day/date requirements explicit. Current source tests cover malformed-date recovery and stale-result clearing, but runtime screen-reader behavior remains unverified.

### PTO-QA-03 — Known bounded coverage

Default search dates derive from the user's local current date, while supported planning coverage ends 2028-12-31. Near the end of that range a default 90-day horizon can exceed coverage and require correction. This is not a current 2026 defect; document/refresh supported coverage before that date rather than claiming an indefinitely valid default.

## Acceptance limit

Domain behavior has strong automated evidence. A working iPhone experience, rendered browser onboarding/navigation, native compatibility, sharing fallback and accessibility acceptance still require actual platform execution. No beta/production acceptance or configured custom-agent activation is granted by this report. The coordinator must incorporate findings and record final component/browser/native outcomes separately.

## Fix verification

After coordinator changes and clean dependency installation, this reviewer independently ran `npm run test:components` on Node 24.22.2: **2 suites / 4 tests passed**. These cover welcome links, the nine-day/four-PTO example with stale-result clearing, invalid-date errors and an accessibility announcement spy. Jest/Expo mocks do not establish a successful native build, real VoiceOver speech, rendered browser focus, or full navigation execution.

PTO-QA-01 is **remediated in source and component boundary**, with platform acceptance still pending. The planner now focuses a `tabIndex=-1` results container on web after calculation and calls `AccessibilityInfo.announceForAccessibility` on native platforms. The new component test verifies the native announcement call. No runtime VoiceOver or browser acceptance is claimed.

PTO-QA-02 is **partially improved**: validation alerts now include their schema paths, making multiple-input failures easier to distinguish. Field-level associations/focus remain a future accessibility refinement; no blocking calculation defect results.

Screen source now preserves handled keyboard taps, dismisses on drag and enables automatic keyboard insets. These are appropriate source changes; real keyboard layout/device behavior remains unverified. The coordinator reports Expo Doctor 20/20 after dependency alignment; this reviewer did not independently rerun Doctor.

PTO-QA-03 remains a documented bounded-coverage consideration, not a present release blocker. No high/critical defect identified in this review. Final acceptance still distinguishes passing domain/component tests from blocked native and browser runtime evidence.
