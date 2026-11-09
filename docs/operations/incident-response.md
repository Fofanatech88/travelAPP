# Incident response

The founder is incident owner until another owner is assigned. No automated on-call system is configured in the foundation.

Triage impact and severity, preserve redacted evidence, stop further exposure and communicate through founder-approved channels. For credential leakage, revoke/rotate affected secrets; for invitation abuse, disable or revoke affected capabilities; for deployment regressions, follow rollback.md. Do not copy private schedules, budgets or tokens into tickets.

Record start/detection times, affected versions, user impact, containment, recovery verification and follow-up owners. Assess legal/user notification obligations with appropriate advice before sending notices. After recovery, add a regression test and document root cause and corrective action. Do not contact customers or external services without explicit authorization.
