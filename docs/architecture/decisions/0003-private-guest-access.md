# ADR 0003: Private inputs and server-authorized guest participation

Status: accepted direction; guest credential lifecycle requires feature design. Date: 2026-11-01.

## Decision

Use Supabase Auth for accounts, RLS for data access, and server-authorized scoped guest capabilities for invitation participation. Store invitation token hashes with expiration and revocation. Keep individual schedules, PTO balances and budgets in private records; expose only approved summaries.

## Alternatives and consequences

Requiring every guest to register harms the invitation outcome. Making invitation-linked tables publicly readable exposes group data. Granting organizers raw participant inputs violates privacy defaults. Narrow server operations preserve low-friction participation but require explicit abuse controls, guest-session revocation rules, recovery decisions and direct API security tests before implementation.

No custom identity system or cryptographic primitives will be built. The backend engineer and security reviewer must review the detailed redemption contract before it becomes executable.
