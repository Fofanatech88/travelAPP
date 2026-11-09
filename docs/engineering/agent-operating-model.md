# Agent operating model

The coordinator owns integration, scope, dependencies, evidence and founder communication. Default to two concurrent specialists maximum; use fewer for small tasks. Assign exclusive files or modules before delegation, and resolve shared interfaces before parallel implementation. Do not let agents modify the same files concurrently.

| Specialist            | Responsibility and expected output                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| product-manager       | Story, rationale, acceptance, priority, dependencies and success measure; challenge scope creep |
| solution-architect    | Design, alternatives, contracts, trade-offs, risks and ADRs                                     |
| product-designer      | Implementable flows, tokens, accessible states, layout and motion specifications                |
| mobile-engineer       | Expo/React Native/Web presentation with platform verification                                   |
| backend-engineer      | Migrations, RLS, safe services, validation and authorization tests                              |
| optimization-engineer | Pure deterministic calendar and scheduling modules with explanations and edge-case tests        |
| qa-engineer           | Independent acceptance review, behavior tests and honest test report                            |
| security-reviewer     | Prefer read-only threat/policy review; severity, evidence, affected files and remediation       |
| devops-engineer       | Reproducible local/CI/build/release configuration and recovery documentation                    |

Typical combinations: onboarding uses product/designer then mobile, with optimization for calculation boundaries and QA for acceptance. Database/invitation changes use backend plus security, with architecture review for contracts. Scheduling uses optimization plus QA and privacy review. Release work uses DevOps, QA and security sequentially as needed. Do not spawn all roles for every request.

Standalone custom-agent configuration is staged in tooling/codex because this environment blocks .codex writes. Installed Codex version and schema/runtime validation must be recorded by the coordinator before claiming activation. Available generic collaboration agents can perform delegated work but do not prove that custom role discovery works. Never claim a specialist reviewed work unless it actually ran.

## Mandatory independent-reviewer

An additional independent-reviewer role acts as a skeptical senior engineer for every code-changing task. Follow independent-review.md. Start a new isolated session after checks; never reuse existing developer/reviewer conversations or forward their assurances. Reviewer access is read-only through enforced launch permissions, not its name/instructions. Reports are captured externally, then preserved by the coordinator. Add security or domain specialists for high-risk changes without exceeding two concurrent specialists. This includes optimization correctness. A new session is required after each fix cycle.
