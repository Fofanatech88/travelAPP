# Foundation security review

Date: 2026-11-01. Reviewer: independently delegated architecture_docs agent acting as security reviewer. Read-only review; only this report was written. This reviewer authored architecture/engineering/design/operations documentation earlier, so review independence applies to application/tooling/CI implementation, not those documents.

## Scope and outcome

Reviewed AGENTS.md, package manifest, application configuration/routes, public database configuration parser and tests, preview server, secret scanner, CI, Playwright tests/configuration, ignored files, environment placeholders, staged agent configuration, security design and current backlog.

No critical or high-severity implementation finding identified in this limited scaffold. This is not a production-security acceptance: there is no backend, authentication, real invitation capability, RLS policy, guest session or deployed host to test. Those features require the direct API/isolation/token tests described in the security model before release.

Positive controls observed: no remote client or credentials required for welcome; private environment patterns ignored; database parser rejects secret-key prefix and insecure remote HTTP; invitation preview does not read/echo the token; preview binds loopback, sets no-referrer/no-store/nosniff headers and omits URL request logging; CI permissions are contents:read with no production credentials or deployment job. Agent roles inherit parent permissions; staged read-only reviewer instructions are guidance rather than a separate sandbox guarantee.

## Findings

### SEC-FND-01 — Low: narrow secret-pattern coverage

Affected file: scripts/check-secrets.mjs (scan patterns).

Evidence: detection covers private-key headers, sb_secret_ keys and AKIA access-key IDs only. A legacy Supabase service-role JWT or a common GitHub token form does not match these expressions. Therefore a passing basic check cannot establish absence of credentials. No actual leaked credential was identified.

Reproduction by static inspection: compare the script's three secret expressions with a legacy JWT-shaped service key or ghp_-prefixed token; none of the current alternatives matches. No secret fixture was written or printed during review.

Remediation: keep its label explicitly basic; add a maintained secret scanner or reviewed additional patterns with synthetic detector tests before backend credentials are introduced. Do not print matched values. Git history scanning becomes relevant after Git initialization.

Disposition: remediated for the reported pattern gaps. Follow-up read-only inspection confirmed additional common GitHub token and generic JWT expressions. The basic scanner still does not guarantee absence of secrets; maintained scanning and history coverage remain future hardening before credentialed integrations.

### SEC-FND-02 — Low: navigation fallback includes missing assets

Affected file: scripts/preview.mjs (stat failure fallback).

Evidence: any missing path with an Accept header containing text/html receives index.html, including /_expo/missing.js. This contradicts the routing ADR criterion that missing assets return 404, and can conceal asset failures. The response is marked text/html with nosniff, limiting script interpretation risk.

Reproduction: after starting the exported preview, request /_expo/missing.js with Accept:text/html; source logic selects index.html. This reviewer could not execute the HTTP request because preview startup was denied EPERM in its sandbox; this is static evidence, not a claimed runtime reproduction.

Remediation: restrict fallback to navigation paths and return 404 for reserved asset prefixes/file requests. Add an exported-server assertion for this case.

Disposition: remediated for the reported missing.js case. Follow-up read-only inspection confirmed fallback now requires an extensionless path, and the root explicitly resolves index.html. The coordinator reports actual HTTP invitation 200 and missing.js 404 responses with Accept:text/html. This reviewer did not independently reproduce those HTTP requests. Browser routing acceptance remains blocked separately. Reserved extensionless asset prefixes are not explicitly rejected; revisit if such assets are introduced.

## Checks actually executed

- node scripts/check-secrets.mjs: passed basic patterns/environment-file check.
- npm audit --audit-level=high --json: failed to retrieve advisories because registry.npmjs.org DNS was unavailable. Dependency risk was not independently revalidated here.
- HTTP header requests: failed because no server was reachable in this reviewer context.
- node scripts/preview.mjs: denied EPERM binding 127.0.0.1:4173; no server left running.

The coordinator reports an earlier audit of 24 moderate vulnerabilities and no high/critical advisories. That count is coordinator-supplied context, not an independently reproduced result. Record advisory details and dependency upgrade constraints in the initialization report; reassess before public beta.

## Release limitations

Actual host logging/redaction, security headers, universal links, native sessions, invitation expiry/revocation, cross-group isolation, guest escalation, account deletion/export and retention remain unimplemented or unverified. Neither this report nor browser routing success substitutes for those checks. Project-local agent installation remains blocked by workspace policy; generic delegated review does not prove custom-agent discovery.

## Fix verification addendum

Read-only follow-up inspected the modified preview and secret-scanner implementations. Both reported low findings are remediated within their stated scope; no high/critical finding was added. Re-ran node scripts/check-secrets.mjs successfully after the changes. Historical evidence above describes the initial implementation, with current disposition recorded on each finding. The coordinator's HTTP evidence is attributed rather than presented as independent execution. Browser tests remain blocked and are not claimed passed.
