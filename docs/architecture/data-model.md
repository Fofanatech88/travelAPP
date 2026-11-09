# Initial data model

Design only. No tables or policies have been deployed. Introduce migrations alongside their feature and authorization tests, not all at once.

| Entity                   | Purpose                                                           | Default access                             |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------ |
| profiles                 | Minimal account display identity                                  | Owner; explicitly safe group projection    |
| pto_profiles             | Workweek, employer holidays and yearly allowances                 | Owner only                                 |
| trips                    | Name, optional destination/budget, duration, status and organizer | Organizer; limited participant projection  |
| trip_participants        | Account or scoped guest membership and response progress          | Organizer progress; participant own record |
| invitations              | Token hash, trip scope, expiry and revocation                     | Privileged server only                     |
| availability_submissions | Private date constraints, PTO cap and optional budget             | Subject; optimizer server                  |
| proposed_windows         | Versioned dates and safe aggregate explanations                   | Current authorized members                 |
| votes                    | Participant choice per current option                             | Own write; agreed group summary            |
| confirmations            | Attending, declined, or pending PTO approval                      | Own write; group progress projection       |
| trip_status_events       | Auditable transitions and actor                                   | Server write; limited organizer read       |

Use database UUIDs, foreign keys, uniqueness constraints and UTC timestamps for events. Vacation dates use PostgreSQL DATE and validated YYYY-MM-DD in TypeScript. Budgets, when introduced, need an explicit currency and must not be aggregated across currencies implicitly.

Trip statuses: draft, collecting_availability, evaluating_options, awaiting_confirmation, confirmed, completed, cancelled. Organizer-controlled transitions are validated server-side. Changes to constraints invalidate affected recommendations, votes and confirmations through explicit version handling; never silently carry stale agreement forward.

PTO profiles are private. Group scheduling consumes private inputs server-side and returns only approved aggregates. An organizer does not automatically receive participant budgets, exact balances or raw availability. Notification preferences are introduced only with notification delivery. Memories and stranger discovery have no tables in this foundation.
