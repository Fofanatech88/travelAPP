# Testing strategy

Use Vitest for pure domain and configuration behavior, Expo-compatible React Native Testing Library tooling for component behavior, Playwright for key exported web workflows, and database integration tests when migrations exist. Type checking and bundling do not substitute for behavior tests.

Foundation acceptance covers welcome rendering, navigation, mobile layout, keyboard access, helpful unknown routes, and arbitrary invitation paths generated after export, loaded directly and refreshed. Screenshots supplement assertions. Native export verifies bundling only; simulator/device smoke acceptance remains separate.

PTO regression cases: zero/one PTO day, no window, weekend/observed holidays, employer confirmation, alternate workweeks, leap years, cross-year balances, time zones/DST, invalid ranges, overlapping blackouts, limits and later annual allocation. Run date tests under more than one TZ.

Group regression cases: two/six full-overlap participants, no overlap, missing responses, varied caps, hard/flexible constraints, unequal burdens, deterministic ties, late changes, vote updates and cancellation. Never show unknown attendance as confirmed.

Backend tests must attempt unauthorized trip access, cross-group access, guest escalation, expired/revoked tokens, tampered identities, direct API bypass and private-field disclosure. Use separate synthetic users; never production data.

CI runs lockfile installation, types, lint, formatting, relevant unit/component tests, web export, browser tests, dependency audit and secret checks. Add database checks with the first migration. Reports identify commands actually run, pass/fail, defects with severity/reproduction, fix verification and outstanding risks. An unavailable tool means unverified, not passed.
