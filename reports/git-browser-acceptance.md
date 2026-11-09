# Git baseline and browser acceptance — 2026-11-08

Status: browser verification passed; baseline committed, fresh isolated review pending. No Done, merge, release or native acceptance is granted by this coordinator report. Requirements: AGENTS.md, plans/first-pto-sprint.md, ADR 0002 and docs/engineering/independent-review.md.

## Scope and Git state

The next backlog work was foundation acceptance, not another feature. At entry, origin was `https://github.com/Fofanatech88/travelAPP.git`, main was at `25f3ea514101b76d0740ab697e5359216f56722f`, and only README was tracked. Existing application, tests, configuration and documentation were untracked. Created `chore/verify-pto-foundation` with elevated execution after the sandbox denied a ref write. Existing work is preserved without changing PTO calculations or introducing dependencies.

Expanded browser assertions for exact PTO dates, result focus and keyboard traversal to Share, holiday removal invalidating results and increasing PTO from four to five days, invalid-date recovery preserving another field, and returning via welcome preserving the current draft. Updated stale Git/browser status in active plans, backlog, README and routing ADR. Historical reports retain their original outcomes. Screenshots use synthetic inputs only.

## Executed checks

All npm checks use cached Node 24.22.2 by prepending `/Users/ismailfofana/.npm/_npx/387698761821791d/node_modules/node/bin` to PATH for the command. System Node remains 25.9.0; no global configuration changed.

| Command                                                                       | Actual outcome                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git status --short`, `git log -5 --oneline`, `git ls-files`, `git remote -v` | Confirmed README-only baseline and configured origin; all original untracked files preserved.                                                                                                                             |
| `git switch -c chore/verify-pto-foundation`                                   | Sandbox failed to create ref; elevated retry passed.                                                                                                                                                                      |
| `npm run typecheck`, `npm run lint`                                           | Passed.                                                                                                                                                                                                                   |
| `npm run format:check`                                                        | Initially failed on existing README formatting; final result recorded below.                                                                                                                                              |
| `npm test`                                                                    | 55 tests passed in three files.                                                                                                                                                                                           |
| `npm run test:components`                                                     | Two suites / four tests passed.                                                                                                                                                                                           |
| `TZ=UTC npm test -- tests/unit/pto.test.ts`                                   | 34 passed.                                                                                                                                                                                                                |
| `TZ=America/New_York npm test -- tests/unit/pto.test.ts`                      | 34 passed.                                                                                                                                                                                                                |
| `TZ=Pacific/Auckland npm test -- tests/unit/pto.test.ts`                      | 34 passed.                                                                                                                                                                                                                |
| `npm run check:secrets`                                                       | Basic secret-pattern/private-env scan passed; not a complete secret/history audit.                                                                                                                                        |
| `npm audit --audit-level=high`                                                | Sandbox DNS failed; elevated network retry exited zero: 34 findings, one low and 33 moderate; zero high/critical. No dependency changes made.                                                                             |
| `EXPO_NO_TELEMETRY=1 npm run build:web`                                       | Production-mode export passed.                                                                                                                                                                                            |
| `npm run test:e2e`                                                            | Sandbox failed before assertions with loopback EPERM; elevated run passed all five original tests. Expanded run passed six tests; additional back-navigation test passed separately. Final complete suite recorded below. |
| `EXPO_NO_TELEMETRY=1 npm run build:ios:js`                                    | Hermes JavaScript export passed; this is not a native build.                                                                                                                                                              |
| `xcodebuild -version`, `xcrun simctl list devices booted`                     | Blocked: active developer directory is CommandLineTools, full Xcode/simctl absent.                                                                                                                                        |

## Browser evidence

Playwright runs the exported `dist` through `scripts/preview.mjs`, using installed Google Chrome on this Mac. Default viewport is 390 × 844; wide test uses 1280 × 900. The original suite passed 5/5 in 14.3 seconds. Expanded six-test suite passed 6/6 in 8.0 seconds. The additional back-navigation scenario passed in 3.1 seconds including startup. These durations are test execution times, not measurements of the 60-second usability target.

Verified welcome → anonymous PTO result with the November 21–29, 2026 fixture; explicit November 26 employer holiday yields nine days away/four PTO days/six remaining and exact PTO dates November 23, 24, 25, 27. Removing it clears stale results and recalculation requires five PTO days. Zero balance gives honest no-results. Correcting February 30 to March 1 recovers from validation while retaining an edited allowance. Keyboard result focus moves to the result container and Tab reaches Share. Navigating through welcome retains edited allowance/balance in the running app session; this does not establish persistence after reload.

Routing verified two random UUID invitation paths generated after export, direct navigation and refresh, safe preview text and no token in visible body/browser console. Welcome keyboard navigation and unknown-route recovery pass. Missing JavaScript with Accept:text/html returns 404. This is a placeholder routing proof, not an authorized live invitation.

Coordinator visually inspected [PTO result](qa/pto-mobile.png) and [invitation preview](qa/invitation-mobile.png). Result labels, dates, holiday contribution and balance are readable at mobile width. Full-page screenshot capture shows the scrollable result view, not a complete accessibility audit. In-app browser JavaScript execution tools were unavailable; repository Playwright was used after discovery.

## Remaining gates

- Native build/device or simulator execution, VoiceOver, native sharing and keyboard layout remain unverified. No Xcode installation, Apple provisioning or EAS cloud build was attempted.
- Fresh isolated review must run on a clean immutable target. Existing historical QA is not approval; a Git connection alone does not remove sandbox restrictions. Optimization correctness in the original baseline needs the project-required independent domain review before acceptance.
- Custom-role installation/discovery and GitHub branch protection/hosted CI have not been verified. No PR, merge or production release is claimed here.
- Moderate/low transitive dependency findings remain documented. No forced Expo downgrade or global package updates were made.
- Browser Share invocation/copy fallback, real screen-reader behavior, representative first-value usability timing and production-host routing/log redaction remain untested.

## Final checks and review

Final precommit checks passed: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` (55 tests), `npm run test:components` (four tests), and `npm run check:secrets`. Final full `npm run test:e2e` passed seven tests in 7.7 seconds with elevated browser/server execution. No application source changed during this task; the new code consists of acceptance assertions in tests/e2e/pto.spec.ts. Fresh immutable-target review remains pending; no reviewer identity or approval is inferred.

Baseline commit: `f0f30d6a34a3c25a43814bcf2d8df651ac57553a` on `chore/verify-pto-foundation`, including all original untracked application/tooling files. Working tree was clean before review. No push or merge performed.

## Review-launch correction

First launcher command: `npm run review:start -- FND-BROWSER-01 25f3ea514101b76d0740ab697e5359216f56722f f0f30d6a34a3c25a43814bcf2d8df651ac57553a plans/first-pto-sprint.md 01a1bdd7-54c2-7241-8846-686976a63a44`. Sandbox execution failed on `.git/worktrees` writes; elevated retry created a detached checkout at `$TMPDIR/together-review-6xawBm/checkout` but stopped before reviewer launch. No reviewer session or approval exists for this attempt.

Reproducing its probe showed CLI exit 2: `the following required arguments were not provided: --permission-profile <NAME>`. The installed CLI is 0.166.0. The [official CLI reference](https://learn.chatgpt.com/docs/cli/reference) documents that sandbox `-C` requires a permission profile; [permission documentation](https://learn.chatgpt.com/docs/permissions) defines built-in `:read-only`. Retesting with `codex sandbox --permission-profile :read-only --include-managed-config -C CHECKOUT -- NODE -e PROBE` exited zero and printed exactly `READ_OK_WRITE_DENIED`; the sentinel remained `source-write-probe`. This validates this elevated OS probe, not a model reviewer session.

Corrected only sandbox-helper arguments, retained managed requirements and added external `probe-evidence.json` capture before any failure. Reviewer execution remains fresh, ephemeral, read-only, with approval disabled. Two integration regressions use a temporary committed Git fixture and fake CLI to verify current required flags, diagnostics and refusal to start a reviewer on startup failure or unexpected source modification. They passed; fake-CLI tests do not prove isolation. A new clean commit and launcher attempt are required after this fix.

## First fresh reviews and fixes — 2026-11-09 follow-up

Two new read-only sessions completed against `9e295b9dbea5cd5896aa02100d0057fb5c0e9f15`. Their unchanged findings/recommendations are preserved under reports/reviews:

- General reviewer `01a1bde7-c1f3-7a43-8177-26dc533bc63c`, launch `fafe6adf-b79b-4624-82c6-f9a4434481c8`: FAIL. Verified read-only source access and personally repeated a denied source-write attempt. Identified P2 browser copy fallback and implicit next-year budgets. Model execution completed; its attempt to spawn a nested domain reviewer failed, so no approval from that nested attempt is claimed.
- Domain reviewer `01a1bde9-4715-7f90-a2b5-ca13a71995b6`, launch `01ef28a9-4b33-4f01-b77b-7c3530bd8fab`: FAIL. Supplied requirements were the broader optimization-design.md, producing weekday-set and structured-result findings inconsistent with the narrower approved first-pto-sprint.md. Findings are preserved, not silently removed. New domain review will use the complete approved first-slice plan; no scope expansion is authorized.

Both checkouts lacked dependencies and their default login shells used Node 25, limiting independent tests. Launcher now exposes existing local node_modules through a symlink under read-only enforcement and explicitly supplies the approved Node executable in the review instructions. It does not run target setup scripts, install packages, or loosen source permissions. Browser/native runtime may still be unavailable in the isolated session; those gaps must remain explicit.

Resolved the two actionable general-review findings in source: per-year UI budgets are keyed to calendar years and additional years start blank; no new year's balance is silently assumed. Browser sharing now uses native web sharing when supported, then clipboard copy, then an actually selectable summary if copying is denied. Cancellation is reported separately. Native sharing still uses React Native Share and handles dismissal. Summary text excludes allowance, balances, blackouts and holiday names.

After fixes, `npm run typecheck`, `npm run lint`, `npm test` (57), `npm run test:components` (five), `npm run format:check` and `npm run check:secrets` passed. Web export and iOS JavaScript export passed again. Elevated `npm run test:e2e` passed 10/10 in 13.1 seconds, including missing next-year budgets, per-year reconciliation, changing years, safe clipboard contents and selectable recovery when clipboard access is denied. The native Share dismissal/payload check is a component mock, not a device result. A fresh review of the changed revision remains mandatory; no original finding is accepted as an unresolved founder risk.

## Second review cycle

Fresh sessions `01a1c26f-0be0-7220-804b-9084af77757c` (general) and `01a1c26f-1692-7e82-a3e0-45edff1c5737` (domain) inspected 4280c7b against the approved sprint. Reports remain FAIL and coordinator-unaccepted. Launcher post-check rejected its own intentionally prepared untracked node_modules symlink; no source alteration was found. Their reports retain all findings; session IDs were attached from actual thread.started events and coordinator metadata explicitly records this launcher failure.

General review identified pending-share completions restoring stale summaries after edits. Source now invalidates prior attempts on edits and on a newer share request. Browser regressions defer clipboard promises to test edit/completion ordering and older/newer completion ordering. Domain review identified holiday/blackout dates outside the advertised coverage passing validation. All input dates now use the existing planning-date schema; new unit cases reject holiday/blackout dates before 2026 or after 2028. Scope and optimization objective are unchanged.

Launcher integrity now compares the prepared checkout status before/after review, preserving the source-write sentinel check. A successful-session fixture with a prepared dependency symlink supplements the failure fixtures. No sandbox permission was expanded.

After this cycle: typecheck, lint, formatting, secret scan, 60 unit tests and five component tests pass. All 36 PTO fixtures pass separately in UTC/New York/Auckland. Web and iOS JavaScript exports pass. Final elevated browser run passed 12/12 tests in 20.5 seconds. Hosted verify passed on 4280c7b in 2m36s; independent-review correctly failed without accepted current evidence. Fresh review outcomes for the revised target are recorded in reports/reviews. Latest immutable-target reviews are in reports/reviews; this document is an implementation/check log, never review approval. Draft PR: https://github.com/Fofanatech88/travelAPP/pull/1 . No merge/release/native acceptance is authorized.

## Domain explanation boundary

Fresh general reviewer `01a1c273-d382-7963-a44f-05047080cc1d` inspected 625f257 and found no code defects; its recommendation remains FAIL because required runtime tests cannot write caches under read-only enforcement. Fresh domain reviewer `01a1c273-dd36-7d01-9ee6-8ebf69aba1eb` independently passed 720 bounded oracle comparisons across New York/Auckland and identified missing structured domain assumptions/rank reason/invalid/no-results outputs. Both reports are preserved unchanged with coordinator acceptance false.

Added `calculatePto(unknown)` as the validated application boundary, returning structured validation issues or an explicit success/no-results result with assumptions and explanation. Opportunities include assumptions and deterministic rank reason. The planner consumes this boundary and the domain ranking copy; the low-level enumerator remains available for existing pure enumeration callers. Added three contract regressions. This implements the existing sprint contract; it adds no scheduling capability or network dependency. New checks and new isolated general/domain/security sessions must cover the revised target. Required isolated runtime checks and native acceptance remain blocked where permissions/toolchain prevent execution; no source permissions are weakened.

Final domain-boundary checks: typecheck, lint, formatting, secret scan, 63 unit tests, five component tests and 12 exported-browser tests passed (13.5 seconds). All 39 PTO fixtures passed in UTC/New York/Auckland, and web/iOS JavaScript exports passed. No native runtime acceptance is inferred. Latest fresh reviewer findings/provenance and coordinator disposition are preserved as JSON under reports/reviews after the immutable target is committed.
