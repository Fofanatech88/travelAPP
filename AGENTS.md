# Project Together operating contract

Help working professionals agree on feasible vacations. Founder is Product Owner. Branding is provisional; MVP is anonymous PTO value followed by private group coordination.

## Start work

Read this file, relevant product requirements, architecture decisions, current backlog or issue, existing code and active plans. Identify dependencies and privacy impact. Plan significant work before edits. Backlog is docs/product/backlog.md until GitHub Issues replaces it.

## Boundaries

src/app contains Expo Router presentation; components and design hold shared UI; domain modules hold deterministic framework-independent logic when introduced. Services own external boundaries. docs/architecture/decisions records material decisions. plans holds active multi-step work; reports records actual evidence.
Use strict TypeScript, explicit boundary types and Zod validation; centralize date-only arithmetic. No local-midnight parsing. Government holidays require employer confirmation. Keep private budgets and balances out of group projections, analytics, logs and errors.
Supabase is the planned managed backend. Never expose service credentials, trust client role claims, or weaken RLS. Guests receive scoped server-authorized access. Do not build speculative future features.

## Delegation and change management

Coordinator owns integration. Use at most two concurrent specialists, with explicit non-overlapping file ownership. Select only relevant roles. Every code-changing task requires a fresh independent review after implementation/checks. Implementers cannot approve themselves. See docs/engineering/independent-review.md for the mandatory launch/report/fix cycle. High-risk changes additionally require security/domain review. Record actual reviewer identity and findings. Agent sources are staged in tooling/codex because workspace policy blocks .codex writes; runtime discovery is pending installation.

## Complete work

Do not mark Done or merge without satisfied acceptance, passing checks, a preserved fresh-review report, no unresolved P0/P1, founder-accepted P2 risks and coordinator verification. An unavailable isolated review means **Review Blocked**. Never reuse developer/reviewer context for approval; instructions alone do not enforce read-only permissions.

Run typecheck, lint, formatting and relevant tests; verify intended browser and iOS behavior separately. Check secrets and relevant dependency risks. Update acceptance criteria, plan/backlog and documentation. Report actual commands, failures, untested behavior and limitations. Do not claim a blocked platform passes. No unresolved high/critical issue for release.

## Founder decisions

Explicit approval is required for production releases, paid services, cloud provisioning, final brand/domain decisions, material scope or architectural changes. No global machine configuration changes. Use small PRs, CI before merge, main plus short-lived feature/fix/chore branches. Never commit secrets. Current work is foundation hardening and the anonymous PTO vertical slice. Browser/native acceptance and Git/custom-agent activation remain open until their recorded checks pass.
