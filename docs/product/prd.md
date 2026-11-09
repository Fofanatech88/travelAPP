# MVP product requirements

## Outcome and scope

A working professional can discover a vacation opportunity, create a private trip, invite friends, collect availability, compare feasible windows, and record agreed dates. [MVP scope](mvp-scope.md) defines release boundaries; [backlog](backlog.md) is the task tracker until GitHub Issues is established.

First value should take approximately 60 seconds in a usability session, without authentication or device permissions. This is a validation target, not an observed result. iOS is primary; invited guests and PTO users must have a usable mobile browser experience.

## Functional requirements

| ID  | Requirement and observable behavior                                                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | Welcome → individual/group goal → basic PTO inputs → explained recommendation → save or invite. No account gate before calculation; account creation may be requested to persist a result or create a trip.                                                                                                                                            |
| R2  | Collect calendar year, country/jurisdiction, recurring workdays, annual allowance, available balance, employer-confirmed observed holidays, preferred periods, desired duration, and blackouts. Distinguish allowance from balance. Show invalid/missing inputs clearly.                                                                               |
| R3  | Enumerate vacation windows and show consecutive days away, PTO dates and total, contributing confirmed holidays, remaining balance, alternatives, assumptions, and annual allocation where feasible. Treat dates as calendar dates, including across year boundaries. Never count an unconfirmed statutory holiday as leave.                           |
| R4  | Authenticated organizers manage a trip with name, optional destination, flexible/preferred dates, desired duration, optional target budget, participants, and status. Statuses: draft, collecting availability, evaluating options, awaiting confirmation, confirmed, completed, cancelled. Cancellation is explicit; avoid extra states until needed. |
| R5  | Organizers share an invitation using native share, WhatsApp, iMessage, email, or copy link. Browser guests can give basic availability without registering. Expiration, revocation, and narrow guest access must work on the server.                                                                                                                   |
| R6  | Participants submit available/unavailable dates, dates needing PTO, maximum PTO commitment, optional flexibility and private budget. Organizer sees response progress and approved summaries; no exact private balance or budget by default.                                                                                                           |
| R7  | Rank feasible group windows with explicit participation, total PTO, per-person burden, hard constraints, and incomplete responses. Hard conflicts cannot be silently overridden. Missing responses remain unknown. Partial attendance is an explicit compromise, never silently favored by a summed score.                                             |
| R8  | Permit voting and vote changes, organizer preferred selection, attendee confirmation, pending-PTO-approval status, and organizer final confirmation. Show remaining responses and unresolved leave. Export confirmed dates through a supported calendar mechanism.                                                                                     |
| R9  | Dashboard shows upcoming/confirmed trips, requests needing action, saved opportunities, supplied PTO balance, and relevant group activity. Keep it focused on decisions.                                                                                                                                                                               |
| R10 | Accessible forms, clear navigation, loading/empty/error/success states, shareable summaries and reduced-motion support. Placeholder mascot artwork must be original and cannot block functionality.                                                                                                                                                    |

## Trust requirements

Privacy defaults are part of acceptance. Clients cannot assign themselves ownership or organizer privileges. Guest capabilities cannot become broad trip access. Server policies and endpoint authorization must prevent cross-group reads and writes. Invitation tokens, budgets, private schedules, and identifiers/secrets must not enter analytics or error reports. Account deletion, retention, export, privacy policy and App Store disclosures are beta/public-release gates.

## Delivery and acceptance

Implement incrementally: foundations, account-free PTO slice, owned trips, guest invitations, group scheduling, voting/confirmation, beta. Significant stories require testable acceptance criteria, a plan, domain tests, appropriate browser/iOS review, and independent review. Production release needs founder approval. Automated checks alone do not establish usability, native behavior, or production security.

## Open product choices

Use a US federal baseline for the first PTO slice, explicitly confirmed against the user's employer calendar. State/local and additional countries remain tracked expansion work; do not advertise unsupported coverage. Annual carryover, accrual, and irregular shifts require later modeling. Decide initial validated participant-count and search-horizon limits before group scheduling implementation. Final public branding and release positioning require founder approval.
