# REV-01 — mandatory independent review protocol

Status: **Review Blocked**. Implementation and automated checks are available; this change is not approved or Done.

2026-11-08 follow-up: Git is now initialized, origin is connected to Fofanatech88/travelAPP and a feature branch was created with elevated execution. The no-repository limitations below describe the earlier attempt. Current baseline/review evidence is tracked in [Git/browser acceptance](git-browser-acceptance.md). Custom-role runtime discovery and hosted enforcement remain unverified.

2026-11-09 follow-up: fresh isolated CLI review now runs after correcting the sandbox helper's required permission profile. Two real sessions reviewed 9e295b9; JSON reports are preserved in reports/reviews with FAIL recommendations, not approvals. Their findings prompted explicit per-year budget entry and browser share fallback fixes, followed by passing coordinator checks. New sessions are required for the changed revision. Launcher preparation may link existing local dependencies under read-only enforcement; it never installs dependencies or runs target setup scripts outside the sandbox. Latest review outcomes belong in reports/reviews; native acceptance remains blocked.

Implemented: permanent gate in AGENTS/workflow/Definition of Done/agent model/PR template; ten staged specialist definitions including independent-reviewer; concurrency remains two; fresh Codex CLI launcher with detached target checkout, read-only sandbox probe, no resume/fork, external report capture and coordinator acceptance kept separate; structured report validator and PR CI job. Each correction requires another fresh review.

Reports are single JSON documents under reports/reviews. The launcher captures an actual review externally first; only the coordinator preserves its unchanged findings plus authenticated provenance and completion verification. There is no report in that directory yet because no qualifying review executed. This status file is an implementation/blocker log, not a reviewer report.

Mandatory report content includes task/base/target identifiers, implementing/reviewing sessions, isolation evidence, acceptance, independently executed commands/results, missing tests, unverified behavior, P0–P3 findings with file/line/evidence/disposition, founder acceptance for unresolved P2, additional independent security/domain evidence for high-risk work, final recommendation and coordinator verification. Structural CI cannot authenticate sessions or founder identity; those attestations need coordinator/human verification.

## Actual limitations and attempts

- Creating .codex/agents was denied: Operation not permitted. Independent reviewer definition remains staged under tooling/codex/agents; no active custom-role discovery is claimed.
- Current project is not a Git repository. No immutable target/worktree exists; no launcher review can be accepted. Launcher preflight fails closed without versioned input.
- Installed Codex 0.166.0 supports fresh exec and read-only sandbox flags. A standalone fresh `codex exec --sandbox read-only --ephemeral --ignore-user-config --skip-git-repo-check` review attempt failed before model execution: failed to initialize in-process app-server client, Operation not permitted. It received only the policy criteria, relevant paths and instructions to report unverifiable revision/isolation; no prior reasoning or verdict was forwarded.
- Separate `codex sandbox -c sandbox_mode="read-only"` probe failed before command execution: sandbox-exec sandbox_apply Operation not permitted. This is not proof that a nested review sandbox successfully enforced read-only access.
- No reviewer session/report/approval was fabricated. Historical QA reports remain historical and cannot satisfy the new protocol. PTO-03 was changed from Complete to Review Blocked pending a qualifying fresh review.
- GitHub remote/branch protection are unavailable. The PR job is prepared; hosted required checks, stale-approval dismissal, trusted human approval and rejection/acceptance of real PRs are not configured or tested. PR-controlled code/reports alone are not a tamper-proof enforcement mechanism.

Next prerequisites: permit .git/.codex writes, establish a committed target and operational fresh read-only Codex session, then run review:start with the task/base/target/approved requirements/implementer IDs. Test actual sandbox read success and write denial, run the independent review and preserve its report. Return findings to the developer; fixes require checks and another new session. Only then can the coordinator accept this task. Production approval remains separate.

## Checks executed

- `npm test`: 55 tests passed (16 review-gate/preflight cases plus 39 existing tests). Covers clean/accepted-risk reports, self-review, missing fields, false isolation/freshness attestations, stale revisions, unaccepted P2, P0/P1, unmet acceptance/failed tests, coordinator verification, high-risk extra reviewer evidence and no-Git fail-closed preflight. These fixtures verify structural policy, not the truth of attestations.
- `npm run test:components`: four existing tests passed.
- `npm run typecheck`: passed after removing an unnecessary test suppression.
- `npm run lint`, formatting and basic secret checks passed during implementation; final checks recorded by coordinator.
- Installed CLI strict config accepted concurrency=2 and memories/apps/plugins disabled. This proves recognized keys, not runtime isolation.
- No application behavior, dependency version or native configuration changed. No cloud credentials/services or production actions added.
