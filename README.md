# Project Together

A mobile-first travel product helping friends agree on feasible vacation dates. Working brand. The anonymous PTO planner is implemented and exported-browser checks pass. Native runtime acceptance and fresh independent review remain pending. Current evidence: [Git/browser acceptance](reports/git-browser-acceptance.md).

## Run locally

Use Node 24 LTS (`nvm use` if nvm is installed), then `npm ci` and `npm run web`. Use `npm start -- --go` to try Expo Go on a compatible iPhone, or `npm start` for an installed development client. Neither path has been verified on a physical device here; simulator execution requires full Xcode. No backend credentials are required. `npm run ios` needs a configured simulator.

Checks: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run test:components`, `npm run check:secrets`, `npm audit --audit-level=high`. Browser proof: `npm run build:web`, `npx playwright install chromium`, `npm run test:e2e`. Local exported preview: `npm run preview` (port 4173). iOS JavaScript export: `npm run build:ios:js`; this is not a native build.

## Project map

- `src/app`, `src/components`, `src/design`: Expo routes and shared UI.
- `src/services`: validated integration configuration; no live backend yet.
- `docs`: product requirements/backlog, architecture ADRs, design, engineering and operations.
- `plans`: first PTO sprint; `reports`: actual review and verification evidence.
- `tooling/codex`: ten specialist/reviewer definitions staged for project-local installation.
- `tests`: unit checks and exported-web routing proof; `.github`: CI and contribution templates.

Read [AGENTS.md](AGENTS.md) before work. [Backlog](docs/product/backlog.md) tracks MVP work; [first PTO sprint](plans/first-pto-sprint.md) defines the next slice.

## Git and environment status

Git is initialized and origin points to `Fofanatech88/travelAPP`. The November 8 acceptance work uses `chore/verify-pto-foundation`; Git writes require elevated execution under the current workspace policy. Do not reinitialize the repository. Project-local custom-role installation/discovery remains pending; definitions are in `tooling/codex`. No global settings changed. GitHub branch protection/hosted checks, hosted Supabase, EAS and production resources remain unverified or unconfigured.

## First PTO slice

Welcome → Find my time off → enter PTO, search period and duration → add employer holidays/blackouts → calculate. Supports Monday–Friday workweeks, dates in 2026–2028, and explicit per-year balances. No official holiday calendar is automatically applied. No login, backend, or network call is required. Results explain required PTO dates, holidays, alternatives and remaining balance. Shares exclude allowance and remaining balance.

Reproduce the component- and browser-tested example: search 2026-11-21 through 2026-11-29, duration 9, allowance 20, balance 10, add employer holiday 2026-11-26. Result: 9 days away, 4 PTO days, 6 remaining. Removing the holiday requires 5 PTO days.

## Native development build path

`expo-dev-client` and EAS development/preview/production profiles are prepared. Native build has **not** run: full Xcode/simctl are unavailable, EAS CLI is not installed, and an Expo account/project has not been linked. With full Xcode configured, use `npx expo run:ios` to create a local development build. Alternatively, the founder can authenticate with `npx eas-cli login`, link an approved Expo project using `npx eas-cli init`, then run `npx eas-cli build --platform ios --profile development` for the simulator or `--profile development-device` for a registered iPhone. Cloud builds may consume plan quota; obtain founder approval before starting one. Real-device distribution needs Apple setup and registered devices. No cloud build was requested here.

Current evidence and blockers: [hardening report](reports/hardening.md).

## Mandatory independent review

Every code-changing task needs fresh isolated review before Done/merge; implementing agents cannot approve their own work. Use `npm run review:start -- TASK-ID BASE-SHA TARGET-SHA approved-requirements.md IMPLEMENTER-SESSION-ID[,ID]` after committing/checks, then preserve and authenticate the report and run `npm run review:check -- REPORT.json BASE-SHA HEAD-SHA`. Details: [review workflow](docs/engineering/independent-review.md). Current activation and enforcement limitations: [REV-01 status](reports/review-protocol-status.md). Missing session/isolation evidence means **Review Blocked**.

# travelAPP
