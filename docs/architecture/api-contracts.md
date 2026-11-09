# Service and domain contracts

Foundation: the welcome and routing proof have no remote data dependency. Supabase environment configuration may be absent; product presentation must still load. No invitation token in the proof grants access to a real trip.

## Planned domain boundary

- CalendarDate: validated date-only value; DateRange: inclusive start/end.
- PTO input: recurring workweek, balances by year, confirmed employer holidays, preferred period, desired duration and unavailable ranges.
- Recommendation result: ranked windows with yearly PTO costs, remaining balances, contributing holidays and assumptions; empty-result explanation.
- Group input, introduced later: versioned private participant constraints and explicit priority configuration.

Validate at UI and server trust boundaries using Zod where appropriate. Domain validation does not replace authorization. Use consistent user-safe errors; internal diagnostics must exclude secrets and private form data.

## Planned server boundaries

| Operation                | Authority                                         | Minimal result                           |
| ------------------------ | ------------------------------------------------- | ---------------------------------------- |
| Create/update trip       | Authenticated organizer derived from session      | Own trip record                          |
| Create/revoke invitation | Server checks organizer membership                | Share link once / revocation outcome     |
| Redeem invitation        | Server checks hash, expiry, revocation and limits | Narrow guest scope and safe trip summary |
| Submit availability      | Verified subject scope                            | Own submission acknowledgement           |
| Generate options         | Server checks membership and input version        | Safe ranked aggregates                   |
| Vote/confirm             | Verified participant; current option version      | Own status and safe progress             |

These are behavior contracts, not implemented endpoints. Final request schemas and guest credential transport belong in the feature ADR before implementation. Never accept client organizer IDs as authority. Database generated types will be produced from reviewed migrations; do not hand-author types that pretend tables exist.
