# Foundation hardening and first PTO slice — 2026-11-01

## Delivery

The anonymous PTO input-to-recommendation flow is implemented and tested at domain/component boundaries. It is **not yet browser- or iPhone-accepted**. The repository remains without a Git baseline because this session cannot write `.git`. No production, paid cloud service, Supabase resource or EAS build was created.

## Completed fixes and feature behavior

- Kept approved Node 24 in .nvmrc. Corrected Expo Doctor findings by aligning TypeScript 6.0.3, Jest 30.5.2, @types/jest 30.0.0 and @types/react 19.3.0 with Expo SDK 58.0.22. Expo Doctor subsequently passed 20/20 checks.
- Installed compatible React Native Testing Library 14.1.0, jest-expo 58.0.13 and test-renderer 1.3.0. Added component tests and their CI step. No forced/legacy peer resolution flags used.
- Added offline pure TypeScript PTO engine, centralized UTC date-only helpers and strict boundary validation. Tests were written first; initial engine test failed for the missing implementation before passing.
- Built welcome → PTO form → explained recommendations/no-results, revision and native-share summary. Inputs: fixed Mon–Fri workweek; search dates in 2026–2028; duration 1–30 days; search horizon 1–366 days; annual allowances/available balances; explicit employer holiday dates; inclusive blackouts. Cross-year searches require both budgets. No accrual, carryover, official holiday grants or approved leave is assumed.
- Alternatives rank by least PTO for the chosen duration, then earliest start. Results show dates, exact PTO days, confirmed holidays and remaining balance by year. Options are independent alternatives, not an annual allocation. Input edits clear stale results. Sharing excludes allowance, remaining balance and blackout schedule.
- Added keyboard handling, result announcements on native and focus handling on web following independent QA feedback. Component announcement test passes; real VoiceOver/focus behavior remains unverified.
- Added Playwright welcome-to-PTO, editing/no-results and wide-layout scenarios alongside arbitrary invitation direct-load/refresh and asset-404 smoke tests. These are written but not passed here.
- Installed expo-dev-client and prepared EAS development simulator/device, preview and production environment profiles. Profiles are local configuration only; no Expo project or signing identity linked.

## Actual verification

All runtime validation below used cached Node 24.22.2 unless stated. Package installation through machine npm used Node 25.9.0 and emitted engine warnings; approved runtime and CI remain Node 24.

| Check                                                     | Actual outcome                                                                                                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm ci --offline --no-audit --no-fund                     | Passed clean lockfile installation: 1,392 packages                                                                                                         |
| npm exec --yes -- expo-doctor                             | Initially 19/20 with four actionable mismatches; after correction 20/20, including after dev-client addition                                               |
| npm run typecheck                                         | Passed                                                                                                                                                     |
| npm run lint                                              | Passed; test mock require warnings subsequently cleaned up                                                                                                 |
| npm test                                                  | Passed: 39 tests in two files (34 PTO + 5 configuration)                                                                                                   |
| npm run test:components                                   | Passed: four tests in two suites; welcome targets, 9-day/4-PTO example and stale-result editing, invalid date, result announcement                         |
| PTO tests with TZ=UTC, America/New_York, Pacific/Auckland | 34 tests passed in each timezone, independently reproduced by QA                                                                                           |
| Independent QA enumeration oracle                         | 120 additional scenarios passed; no blocking calculation defect found                                                                                      |
| npm run format:check                                      | Passed after final formatting                                                                                                                              |
| npm run check:secrets                                     | Passed basic scanner; not exhaustive secret/history assurance                                                                                              |
| npm audit --audit-level=high                              | Exit 0; 44 findings: 1 low, 43 moderate, no high/critical. Expo/Jest/ESLint transitive chains remain; forced SDK downgrade not applied                     |
| EXPO_NO_TELEMETRY=1 npm run build:web                     | Passed with the PTO route                                                                                                                                  |
| EXPO_NO_TELEMETRY=1 npm run build:ios:js                  | Passed Hermes JavaScript export with PTO route; **not a native build**                                                                                     |
| npm run test:e2e / npm exec -- playwright test            | Blocked before browser assertions: Playwright server availability/startup encounters EPERM on loopback. No rendered browser success or screenshots claimed |
| xcodebuild -version; xcrun simctl list devices booted     | Failed: only Command Line Tools selected; full Xcode/simctl unavailable                                                                                    |
| git init -b main; mkdir -p .codex/agents                  | Both denied: operation not permitted. No baseline commit, branch, remote or clean Git status exists                                                        |

## Specialist activation and permissions

Nine staged definitions were independently checked for name, description, developer_instructions and quoted-string syntax. Installed Codex 0.166.0 strict configuration accepts concurrency=2. A generic optimization specialist produced the engine; a separately delegated QA specialist returned findings, which the coordinator incorporated (result focus/announcement and clearer input errors). QA independently reran domain and component checks.

**Configured project-local role discovery remains blocked**, because `.codex` cannot be installed here. Generic delegation is working but does not prove invocation of `.codex/agents/qa-engineer.toml`. Reviewers inherited parent permissions; read-only task instructions were not treated as an enforced read-only sandbox. A separately enforced review session is required when permissions matter. No machine-global configuration was changed.

Official current format/permission reference: https://learn.chatgpt.com/docs/agent-configuration/subagents . Native build path reference: https://docs.expo.dev/develop/development-builds/introduction/ .

## Git, browser and native gates

Git baseline is still P0 blocked. The founder must make this workspace writable for `.git` and `.codex`, or perform the setup from their own terminal: initialize Git, inspect staged files after secret checks, commit the baseline, install tooling/codex into .codex and reopen Codex. No GitHub destination is known, so no remote is configured.

The SPA single-output decision remains provisional. Export success and prior HTTP fallback checks do not establish browser rendering, refresh, layout, keyboard focus or real invitation security. Run `npm run build:web`, `npx playwright install chromium`, then `npm run test:e2e` in a runtime permitting local server and browser processes. Local Chrome is selected automatically on this Mac; CI uses managed Chromium. No production host was chosen.

Native gate: install/configure full Xcode and use `npx expo run:ios`, or authenticate/link an approved Expo project and run the prepared EAS development profile after approving any cloud quota/cost. EAS CLI/account setup is unavailable in this session. Simulator profile avoids device provisioning; an iPhone build additionally needs Apple/device setup. README contains the exact command sequence. No native build was submitted or passed.

## Current backlog and first-feature Definition of Done

FND-01 and FND-03 remain blocked; FND-02 remains in progress for native/runtime acceptance. PTO-03 is complete for bounded first-slice domain behavior. PTO-01/02 are implemented/component-tested but remain in progress until browser/native acceptance. Share functionality is implemented locally; persistent saving remains future account work. Auth, group invitations/scheduling and annual allocation remain not started.

The first slice is accepted only when the checked-in domain/component tests and browser anonymous flow pass, actual iOS compatibility is recorded, no high/critical findings remain, explanations and privacy boundaries reconcile, and the founder can reproduce the customer journey. See plans/foundation-hardening.md for the concise contract and reports/qa/pto-review.md for independent evidence. Real-device accessibility, native sharing and visual quality remain open risks, not inferred from a JavaScript export.

## Reproducible customer example

Open welcome, choose Find my time off. Set search 2026-11-21 through 2026-11-29, duration 9, allowance 20, available balance 10; explicitly add employer holiday 2026-11-26. Expected: **9 calendar days away, 4 PTO days (Nov 23, 24, 25, 27), 6 PTO days remaining**. Removing the holiday increases the cost to 5. Component tests verify the initial result and editing/no-results behavior; browser/iPhone demonstration remains pending.
