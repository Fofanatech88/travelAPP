# Deployment

Foundation delivery is local; no production deployment is authorized. Export verification does not mean hosting exists.

After GitHub is identified, enable protected main with required CI and PR review. Generate staging from approved code and separate preview variables. Prove arbitrary invitation direct links and refresh on the actual host, including security headers and redacted request logs, before choosing production hosting.

Before EAS setup, the founder supplies/approves Expo account/project, Apple team, provisional identifiers and eventual domain. Use explicit development, preview and production EAS environments. Use TestFlight for beta; do not automatically publish mobile builds or OTA updates on merge. Review runtime compatibility for OTA changes.

Deploy migrations through versioned, reviewed, backward-compatible steps with tested recovery. Release evidence records app version/build, source revision, notes, migrations, variables, known limitations and recovery. Production submission/deployment requires explicit founder approval of the concrete release candidate.
