# Foundation QA review

Date: 2026-11-01. Reviewer: actual delegated agent `/root/product_foundation`, assigned a read-only QA review of the coordinator's implementation. This agent previously authored product/discovery documents and the PTO sprint plan; review of those authored documents is consistency checking, not independent product-document review. No application code was changed during QA.

## Scope and conclusion

Inspected welcome/navigation, invitation route, local exported-preview server, database configuration parser, tests, CI, ADRs, operating docs and first sprint plan. The scaffold is intentionally a preview, with no backend or PTO implementation. Local type/lint/configuration checks pass. Formatting has now passed fix verification. Full acceptance remains conditional on executed browser proof and external tooling restrictions. A native JavaScript export is not evidence of an iOS native build or runtime.

Project-local agent definitions are staged in tooling/codex because .codex writes are blocked. This does not satisfy installed-agent discovery. Git initialization and GitHub protections also remain external/policy-blocked, as the README states. No production resource or security policy is claimed configured.

## Commands actually executed by this reviewer

Used the coordinator-provided Node 24 runner via PATH=/Users/ismailfofana/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH.

| Check                                             | Actual result                                                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| npm run typecheck                                 | Passed, exit 0                                                                                                        |
| npm run lint                                      | Passed, exit 0                                                                                                        |
| npm test                                          | Passed: one file, five configuration tests                                                                            |
| npm run check:secrets                             | Passed: basic configured patterns/environment-file check only                                                         |
| npm run format:check                              | Failed, exit 1: playwright.config.ts, scripts/check-secrets.mjs, tests/e2e/routing.spec.ts unformatted at review time |
| Python relative-link check over README/docs/plans | Passed: 37 files, no broken relative links                                                                            |

Fix-verification rerun: npm run format:check passed, exit 0, with all matched files formatted. The earlier failure is retained above as historical review evidence.

Vitest prints a nonblocking warning that its ESM config is loaded as CommonJS and a future native config loader will need module alignment. This did not fail tests.

The coordinator reported successful web and iOS JavaScript exports; this reviewer did not independently rerun exports. This reviewer did not execute browser tests, render a screenshot, run native smoke tests, run dependency audit, test live Supabase authorization, or load installed custom agents. Browser execution remains blocked by network/socket EPERM restrictions according to the coordinator; consult the final execution report for exact failed commands. The coordinator reports curl checks of a new invitation path returning HTTP 200 and a missing asset returning HTTP 404. Those are HTTP hosting checks, not browser route rendering or refresh verification. Installed Google Chrome was observed under /Applications, but availability alone is not test execution.

## Findings

### QA-01 — Resolved: formatting gate

Evidence: the command and three affected files above. Reproduce with npm run format:check. CI runs this command, so an equivalent snapshot fails CI. Remediation: format the stable files, rerun formatting and record the actual outcome. No code correction was made by this reviewer. Fix verification: reran npm run format:check after coordinator fixes; passed, exit 0.

### QA-02 — Decisions aligned; holiday-data verification remains a readiness gate

Affected: plans/first-pto-sprint.md and docs/architecture/optimization-design.md.

Evidence: architecture defines the first sprint as fixed-duration windows ranked by required PTO then date. The sprint plan describes duration bounds and maximizing days away before minimizing PTO. The plan also leaves supported years/search limits, authoritative US federal fixture provenance and cross-year support/rejection as readiness conditions. These choices change observable outputs and should not be left for simultaneous UI/engine implementation.

Fix verification by rereading the updated plan: fixed duration 1–30 days, rank by total PTO then earlier start, coverage 2026–2028, search at most 366 consecutive dates, allowance/balance whole days 0–366 with balance no greater than allowance, and both yearly balances required for cross-year windows. These material planning decisions now align with architecture. US OPM federal schedules are explicitly identified as the intended authoritative source. Source retrieval returned HTTP 403 per the coordinator, so fixtures must not be marked reviewed or reliable until their dates/provenance are actually verified. This remaining data dependency is a clear readiness gate, rather than an unspecified product decision. Employer-confirmed holidays and calendar-date arithmetic remain consistent. Annual allocation stays deferred to PTO-05.

### QA-03 — Static test gap resolved; browser proof still blocked

Affected: docs/architecture/decisions/0002-routing.md and tests/e2e/routing.spec.ts at review time.

Evidence: ADR requires missing asset requests to return real 404s; initial tests assert welcome navigation, unknown routes, two arbitrary post-export invitation URLs, refresh, and absence of token text in body/console, but do not explicitly assert asset 404 status. The preview server appears to distinguish HTML fallback from non-HTML requests, which still needs executed evidence.

Fix verification by source inspection: E2E now includes a request to /missing-asset.js with Accept: text/html and asserts HTTP 404; the server prevents extension-bearing paths from receiving HTML fallback. The coordinator separately reports curl HTTP 200 for a new invitation path and HTTP 404 for a missing asset. This reviewer did not execute those HTTP checks or E2E assertions. Browser direct load, refresh, navigation, keyboard behavior and screenshot evidence remain unverified; HTTP success alone cannot close the routing ADR. Actual-host security headers/log redaction also require later validation.

### QA-04 — Informational: foundation acceptance limitations remain explicit

There are no high/critical functional security findings in this narrow offline scaffold review. This is not a production security clearance: no guest redemption, auth lifecycle, RLS, token revocation, private-data projections, account deletion or production deployment is implemented. Security-sensitive feature acceptance must include direct API tests later. The basic secret-pattern checker is useful but does not prove the absence of every secret format.

## Acceptance mapping

- Meaningful project memory/product/backlog/design/operations documents exist and document MVP/future boundaries.
- Nine specialist role sources exist, with conservative two-agent concurrency, but installation/discovery remains blocked and unverified.
- Shared welcome/navigation routes, configurable UI brand, tokens, strict TypeScript, validation boundary, lockfile and CI exist.
- Browser proof is defined against exported output rather than only a dev server. Execution evidence must be recorded separately.
- iOS native behavior and accessibility runtime review remain unverified without a simulator/device run.
- PTO, accounts, live invitations, availability, group optimization and voting/confirmation remain not started.

## Fix verification and next action

Findings and fix-verification results were sent to the coordinator. QA-01 is closed by an executed formatting rerun. QA-02 planning choices are specified and aligned; authoritative holiday fixture review remains pending. QA-03 assertion gap is closed by source inspection, while browser acceptance remains blocked and is not passed. Next: unblock browser execution and confirm the exported routing proof before finalizing web deployment; verify source-backed holiday fixtures before claiming holiday recommendations accurate. Update FND statuses with evidence and preserve the external setup blockers rather than marking Phase 0/1 universally complete.
