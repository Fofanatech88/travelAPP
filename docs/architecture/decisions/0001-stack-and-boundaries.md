# ADR 0001: Shared Expo application and managed modular backend

Status: accepted for foundation. Date: 2026-11-01.

## Decision

Use Expo 58, Expo Router, React Native Web and strict TypeScript in one repository; use Node 24 LTS. Keep framework-independent optimization modules separate from presentation. Use Supabase Auth, PostgreSQL, RLS and narrowly scoped Edge Functions when backend features begin.

## Alternatives and trade-offs

Separate native and web applications would offer platform autonomy but duplicate the early experience. A Spring backend would match founder experience but add deployment and language costs without current need. A custom scheduling service would complicate testing and operations. Shared TypeScript and managed infrastructure reduce early fixed costs while allowing platform-specific UI when warranted.

## Consequences

Follow Expo-compatible dependency versions, verify browser and iOS behavior separately, and test database authorization directly. No production resources are created by this decision. Node 25 is excluded by the verified current Expo package engine range; use a local Node 24 runner or version manager without changing global settings.
