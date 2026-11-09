# Success metrics and event taxonomy

Primary outcome: number of groups reaching an agreed vacation plan. Operational definition: a group trip with at least two participants reaches organizer-confirmed status, with attendee confirmations and pending leave separately visible. Do not equate votes or tentative PTO with agreement. Evaluate stricter fully-approved agreement alongside this measure before launch.

Supporting measures: time to first useful recommendation; onboarding completion; result-to-trip creation; invitation response/acceptance and availability submission; group agreement; repeat organizers. Premium conversion and memory-to-repeat-trip conversion are future metrics. No observed baseline exists yet; do not invent one. The first usability study checks the approximately 60-second first-value target, then establishes activation targets from evidence.

## Event contract

Events are planned, not yet integrated. Emit after the named action succeeds, not on button press. Prefer server-confirmed lifecycle events; prevent duplicate success events on retries. Use a typed property allowlist and synthetic tests. No advertising identifiers, automatic screen capture, or session replay by default. Provider selection/integration is deferred until analytics implementation; PostHog is a candidate.

| Event                      | Exact trigger                                                                   | Allowed event-specific properties                                              |
| -------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| onboarding_started         | User begins the PTO flow                                                        | goal: individual/group                                                         |
| onboarding_completed       | User reaches a valid first result                                               | goal; coarse elapsed-time bucket                                               |
| pto_calculation_completed  | Valid deterministic calculation finishes, including no results                  | outcome: results/none; engine_version                                          |
| pto_result_saved           | Authenticated persistence succeeds                                              | none                                                                           |
| trip_created               | Authorized trip creation succeeds                                               | none                                                                           |
| trip_invitation_sent       | Share action completes where observable; copy is labeled as copy, not delivered | channel: native_share/copy/email/whatsapp/imessage; outcome: handed_off/copied |
| trip_invitation_opened     | Valid invitation entry is successfully resolved                                 | platform: ios/web                                                              |
| availability_submitted     | Authorized availability save succeeds                                           | submission: initial/update                                                     |
| group_options_generated    | Scheduling completes for current inputs                                         | outcome: feasible/compromise/none/incomplete; engine_version                   |
| trip_option_selected       | Organizer preferred selection persists                                          | none                                                                           |
| trip_participant_confirmed | Attendance confirmation persists                                                | state: confirmed/pending_pto/declined                                          |
| trip_confirmed             | Organizer confirmation transition succeeds                                      | pending_approval: yes/no                                                       |
| trip_cancelled             | Authorized cancellation persists                                                | none                                                                           |
| feature_interest_submitted | User explicitly expresses interest in an approved future feature                | feature: allowlisted feature key                                               |

Shared properties: app version, environment, platform, schema version only. No names, emails, invitation URLs/tokens, route/query strings containing capabilities, raw schedules/dates, PTO allowance/balance, personal budgets, destination text, user-generated trip names, or free text. Do not log rejected request payloads. Strip sensitive error context before monitoring capture.

## Measurement privacy and gaps

Use aggregate counts and coarse durations first. Funnel linkage must use an approved pseudonymous mechanism with explicit retention and access controls; no user or group IDs in the initial event property contract. Confirm regional consent requirements and deletion/retention behavior before enabling a provider. Delivery of a shared invitation cannot generally be proved by a native share sheet; measure recipient opens/responses separately. Group outcome and repeat-organizer metrics should use authorized backend aggregates when implemented, without sending membership graphs or private constraints to analytics.
