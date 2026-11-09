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
