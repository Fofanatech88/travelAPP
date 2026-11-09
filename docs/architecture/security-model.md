# Security and privacy model

Threat model and required controls for future implementation; not a claim of deployed protection.

| Threat                                 | Required control                                                                       | Verification                                           |
| -------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Account accesses another trip          | RLS membership/ownership checks on every exposed table                                 | Direct API requests with two accounts and two groups   |
| Client spoofs organizer or participant | Derive actor from verified session; resolve membership server-side                     | Tampered IDs and role claims rejected                  |
| Leaked or replayed invitation          | Cryptographically random token, hash at rest, expiry, revocation and scoped redemption | Expired/revoked tokens fail; scope cannot expand       |
| Guest escalates privileges             | Narrow guest session/capability limited to own submission                              | Cross-group read/write and organizer operations denied |
| Private participant data leaks         | Private tables and explicit safe projections                                           | Response-shape and unauthorized-select tests           |
| Invitation endpoint abuse              | Bounded inputs, rate limits, generic failures and request-size limits                  | Repeated redemption and malformed requests             |
| Sensitive diagnostics                  | Allowlisted analytics, URL/token/body redaction, no raw form logging                   | Review browser, server and monitoring payloads         |

Use platform crypto APIs; never custom cryptography. Token plaintext is returned only when creating a share link and never stored in analytics or application logs. Avoid third-party scripts on invitation pages; use Referrer-Policy: no-referrer and Cache-Control: no-store for sensitive responses. Production host/access logs must redact invitation paths before release.

Enable RLS before exposing tables. Deny access until a specific policy is tested. Service-role credentials belong only in managed server secrets; EXPO_PUBLIC values are publicly extractable. Security-definer functions, if justified, require constrained search paths, explicit caller validation, narrow grants and review.

Invitation redemption must not imply account ownership. Decide guest recovery and account-linking rules in the invitation feature plan before implementing them. Revocation must prevent future access according to the documented capability/session lifecycle.

Before public beta: review account deletion, export, retention, consent, incident handling, privacy disclosures and abuse protections. Critical/high findings block release; lower findings need owners and disposition. Do not claim compliance from this document.
