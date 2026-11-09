# Rollback and recovery

Before release, record the previous known-good web artifact, mobile version/runtime and database migration state. Rehearse recovery in staging.

Web: revert to the prior approved artifact, verify welcome/invitation paths and auth behavior, then monitor errors. Mobile: halt rollout or submit a corrective build; already-installed native binaries cannot be remotely uninstalled. OTA recovery is allowed only for compatible runtimes through approved channels.

Database: prefer additive migrations and forward fixes. Do not destructively reverse schema under active clients. Use documented backups/restore only after assessing lost writes and founder impact approval. Revoking compromised credentials/tokens may be necessary independently of code rollback.

No artifacts, database backups or rollback infrastructure exist in the initial scaffold; verify them before production.
