# Git baseline and browser acceptance

Date: 2026-11-08. Status: in progress. Scope: FND-01/FND-03 and the browser acceptance portion of PTO-01/02/03. Requirements: AGENTS.md, plans/first-pto-sprint.md, ADR 0002 and docs/engineering/independent-review.md. No new product scope, backend, cloud provisioning or release.

## Sequence

1. Verify Git connection and protect existing implementation on a short-lived branch. Initial state: origin points to Fofanatech88/travelAPP; HEAD 25f3ea5 tracks README only; all app/tooling/docs files are untracked. Preserve those files in the implementation baseline after secret checks. Git writes need elevated execution under the current workspace policy.
2. Use cached Node 24.22.2. Reproduce type, lint, format, unit/component, timezone, secret, dependency and export checks. Run exported-browser tests; resolve reproducible failures within existing acceptance criteria.
3. Verify browser welcome-to-result, editing/no-results, wide layout, arbitrary invitation direct load/refresh, keyboard navigation and missing-asset 404 behavior. Preserve synthetic screenshots and command evidence. Separately probe native toolchain; record blocked iOS runtime honestly.
4. Update plan/backlog/ADR/README with current evidence. Commit a reviewable target. Launch a fresh detached read-only review using review:start; preserve actual failure evidence if isolation or launch is unavailable. Optimization/security changes require the additional review specified by project policy.
5. Resolve findings with checks and a new reviewer session. Do not mark Done, merge or release while required review or platform acceptance is blocked.

## Acceptance and privacy

Existing first-slice requirements remain authoritative. Calculations stay offline and anonymous; browser fixtures use synthetic inputs; no private balance, allowance, blackout schedule or invitation token enters shared text, logs or analytics. Routing proof is local placeholder behavior, not live invitation authorization. No production deployment is authorized. GitHub branch protection/custom-role runtime discovery are separate from remote connection and remain unverified until tested.

Evidence will be recorded in reports/git-browser-acceptance.md. Review reports must identify an immutable target and actual fresh isolated reviewer; coordinator checks cannot replace review.

## Reviewer-launch compatibility follow-up

The first committed-target attempt exposed a reproducible CLI mismatch: `codex sandbox -C` requires `--permission-profile` on installed Codex 0.166.0. The documented `:read-only` profile with managed requirements included passed an elevated read-success/write-denial probe. Correct only the sandbox-helper invocation and preserve probe diagnostics before failure; keep reviewer execution read-only and approval disabled. Add a regression covering current CLI arguments and fail-closed diagnostic capture, rerun checks and commit before a new review attempt. References: https://learn.chatgpt.com/docs/cli/reference and https://learn.chatgpt.com/docs/permissions . No machine configuration changes are needed.
