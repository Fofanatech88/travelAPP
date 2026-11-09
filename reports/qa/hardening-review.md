# Foundation hardening QA review

Date: 2026-11-01. Reviewer: `/root/foundation_qa`, independently delegated generic QA specialist. Read-only source review; only this report written. This delegation is operational evidence for generic collaboration, not evidence that staged custom roles were discovered or activated.

## Checks executed

All checks used the available Node 24.22.2 runner by prepending its binary directory to PATH.

| Check                                                                                                  | Actual result                                                                                                                               |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run typecheck                                                                                      | Passed                                                                                                                                      |
| npm run lint                                                                                           | Passed                                                                                                                                      |
| npm test                                                                                               | Passed: 5 tests / 1 test file at review start; PTO changes were not present                                                                 |
| npm run format:check                                                                                   | Passed at review start                                                                                                                      |
| npm run check:secrets                                                                                  | Passed basic scan                                                                                                                           |
| codex --strict-config -c agents.max_concurrent_threads_per_session=2 app-server --print-startup-config | Accepted installed CLI 0.166.0 concurrency setting                                                                                          |
| Nine staged role files                                                                                 | Required name/description/developer_instructions present, distinct role names match filenames; simple key/quoted-string syntax check passed |
| npm run test:e2e                                                                                       | Blocked before test execution: server bind EPERM 127.0.0.1:4173                                                                             |

Role source validation uses a deliberately narrow checker for these simple key/string files, not a full TOML/schema/runtime-discovery test. `.codex` and `.git` are absent in this review context; the coordinator's write attempts were denied by the host policy.

## Agent activation and permissions

Nine staged definitions cover all requested roles, constrain work to assigned ownership, and identify expected evidence. Security instructions say not to change source. No misleading sandbox_mode override is included. The coordinator has successfully invoked this reviewer and received its findings through collaboration messages.

Configured project-local specialist activation remains blocked until `.codex` can be installed and discovered. Generic delegation must not be reported as custom-role activation. All agents inherit parent permissions; a role name or read-only instruction does not enforce a separate sandbox. Use a genuinely read-only session/sandbox for enforcement when required; current review source restraint is procedural only.

## Browser and test setup

Browser skill was read and tool discovery repeated for node_repl/js execution names and JavaScript execution. No callable browser execution tool was available, so the in-app browser could not be used. Existing Playwright smoke was attempted as the fallback automated check, with the failure above; no rendered screen, refresh, responsiveness or runtime token-leak pass is claimed.

Static inspection confirms exported-preview tests cover welcome keyboard navigation, unknown routes, two generated invitation URLs and refresh, token omission from visible text/console, and missing-asset HTTP404. Preview binds loopback and distinguishes asset extensions from HTML navigation fallback. CI installs dependencies from lockfile, exports web, installs Chromium, and runs tests. CI execution itself is not verified without a GitHub repository/run.

## Findings and readiness

- **P0 external blocker:** no Git baseline or configured custom agents yet; policy still prevents required project-directory writes. Existing files are not protected by a repository commit.
- **P0 acceptance blocker:** dynamic invitation routing remains proposed until browser tests execute. HTTP fallback is useful but insufficient.
- **P1 coverage gap:** component test tooling is not yet installed at this review point; five configuration tests do not validate UI behavior. Coordinator is addressing installation separately.
- **P1 native blocker:** full Xcode is absent; no native build/runtime result reviewed. JavaScript export must remain separately labeled.
- **Low:** Vitest emits a future native-config-loader warning for ESM syntax in CommonJS-loaded vitest.config.ts; current tests pass.

No code defect found in the limited scaffold beyond outstanding acceptance/tooling gaps. PTO engine/UI must receive a separate review after implementation stabilizes. This report does not accept backend authorization, real invitations, native behavior, or production readiness.
