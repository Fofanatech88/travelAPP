# ADR 0002: Invitation web routing proof

Status: proposed; exported-browser proof passed 2026-11-08, fresh independent review pending. Date: 2026-11-01.

## Decision under test

Use explicit Expo web output `single` with host navigation fallback to index.html for non-asset navigation requests. Dynamic invitation tokens are interpreted by the client router, not enumerated during export. Hosting vendor remains unselected.

## Proof criteria

Export the web application, then generate two distinct synthetic invitation tokens. Directly load and refresh each path in a browser; ensure the intended screen renders, tokens are not echoed in visible text or logs, unknown routes show helpful recovery, and missing assets return real 404s. Dev-server navigation alone does not satisfy this proof.

## Alternatives

Static prerendering requires known paths and cannot be assumed to handle arbitrary invitations. Expo server rendering supports dynamic requests but introduces a server runtime and hosting cost. Use that option only if the SPA proof fails for a documented framework limitation, with a follow-up ADR.

Native custom schemes are provisional. Universal links require approved domains, associated-domain files and Apple identifiers; verify installed-app and browser fallback behavior before releasing invitations.

Reference: https://docs.expo.dev/router/web/static-rendering/ and https://docs.expo.dev/router/web/server-rendering/ . Production host security headers and log redaction remain release requirements.

## Current evidence

On 2026-11-08, web export and Playwright checks against the local production-mode export passed using Google Chrome. Two distinct UUID invitation paths generated after export loaded directly and survived refresh; visible text/browser console did not expose the tokens. Keyboard welcome navigation, unknown-route recovery and a missing JavaScript asset returning 404 with Accept:text/html also passed. Execution required elevation because sandbox loopback binding is denied. See [current evidence](../../../reports/git-browser-acceptance.md) and [screenshot](../../../reports/qa/invitation-mobile.png). This verifies the local fallback contract; fresh independent review, production-host behavior and installed-app links remain separate gates. No hosting vendor or production deployment is finalized.
