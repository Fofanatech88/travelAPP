# Development workflow

Start each task by reading AGENTS.md, the relevant requirement, current code and canonical backlog/issue. Check dependencies and record a concise plan for significant work. Small fixes need proportionate documentation.

Definition of ready: clear problem and story; testable acceptance; known dependencies; privacy implications; target release; understood approach. Low-risk assumptions are recorded; material scope and architecture changes go to the founder.

Use one-week cycles with a small selected backlog. Keep main release-ready and use short-lived feature/, fix/ or chore/ branches and focused PRs. No long-lived develop branch. PRs state requirement, behavior, verification, UI evidence, migration notes, limitations, security implications and recovery when relevant. Required CI checks and review precede merge once GitHub exists.

The workspace currently blocks .git and .codex writes. Do not bypass the policy. The coordinator stages agent artifacts in tooling/codex and records the founder action needed to activate them. Git initialization and remote protection remain pending until permissions/destination allow them.

After implementation and automated checks, follow independent-review.md: launch a new isolated review, preserve its report, return findings to the original developer, and run checks plus another new session after fixes. Every code-changing task requires this gate. Complete only after coordinator verification; otherwise use Review Blocked. Production release always requires explicit founder approval.
