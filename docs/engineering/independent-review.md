# Mandatory independent review

Every feature, vertical slice, bug fix and code-changing task requires fresh independent review after automated checks and before Done or merge. Implementers never approve their own work. Use one reviewer ordinarily; add security/domain specialists for authentication, private data, payments, migrations or optimization correctness. Maximum two specialists concurrently, reviews after implementation stabilizes.

Launch a NEW session each attempt: never resume/fork a developer or earlier reviewer conversation. Supply only approved requirements/acceptance, repository instructions, reviewer role and immutable revision/diff plus relevant code/tests. Do not forward developer reasoning, self-evaluations or previous verdicts. A separate window alone is insufficient. Findings return to the developer; fixes require checks and another NEW reviewer session. Prior reports remain historical evidence.

Use enforced read-only sandboxing where supported; role instructions are not permission enforcement. The reviewer does not edit implementation files. Capture output externally and preserve it under reports/reviews. Verify fresh session, effective isolation, target revision and evidence. If launch/isolation/revision cannot be verified, status is Review Blocked.

Done/merge requires satisfied acceptance, passing required checks, fresh review, no unresolved P0/P1, founder acceptance evidence for unresolved P2, preserved report and coordinator verification. PASS is not a substitute for tests or production approval. Unverified required behavior blocks acceptance. Historical QA does not automatically satisfy this policy.

## Running a review

Commit implementation and approved requirements first; keep the worktree clean. Use Node 24:

`npm run review:start -- TASK-ID BASE-COMMIT TARGET-COMMIT approved-requirements.md IMPLEMENTER-SESSION-ID[,ID]`

The launcher requires full commit hashes, an approved requirement file tracked in TARGET, TARGET=HEAD and a clean checkout. It creates a detached worktree outside the development tree, starts fresh `codex exec --sandbox read-only` with approvals disabled and checks fresh session output, effective sandbox probe and worktree integrity. A denied write probe must be observed; a successful probe invalidates review. No resume/fork flags or conversation history are used. It runs the staged independent-reviewer instructions, so CLI review execution does not imply .codex custom-role discovery. Local project config/AGENTS and approved requirements still apply; implementation summaries/previous reports must not be read as review input.

Reviewer output is captured in a temporary directory. The coordinator preserves one JSON report per attempt under reports/reviews, verifies provenance and adds coordinator acceptance; reviewers cannot approve as coordinator. Reviewer permissions may prevent tests that need caches or browser processes: record them as unverified, never infer success. Do not loosen source write access to make tests pass.

`npm run review:check -- REPORT.json BASE-COMMIT HEAD-COMMIT`

On PRs the CI job checks reports against the PR base and HEAD. Reports may be committed after the reviewed revision; only changes under reports/reviews are allowed after it. All other changes invalidate the review. Reports cannot be recycled across unrelated base revisions. P2 acceptance must include founder identity and an evidence reference; the coordinator authenticates it externally. This structural check cannot prove identity, context freshness or truthful attestations. It is not a cryptographic approval system.

## GitHub enforcement

Require CI verify and independent-review checks, require an authorized founder/reviewer approval, dismiss stale approvals, require approval of the latest reviewable push and prevent author self-approval/admin bypass where supported. Test a rejecting and accepting PR before claiming branch protection works. Protect workflow/validator changes with trusted human review; PR-controlled scripts/reports are not a tamper-proof gate. Origin is connected to Fofanatech88/travelAPP as of 2026-11-08; hosted enforcement remains untested.

Reports contain task/base/target IDs; reviewer session/launch and read-only verification; scope and acceptance results; independently run commands/results; P0–P3 findings with file/line, evidence, disposition and missing tests; unverified behavior; recommendation; coordinator verification. Use one structured JSON document rather than duplicate prose reports. Report validator schema is scripts/review/report.mjs.
