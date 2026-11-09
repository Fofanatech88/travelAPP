# System overview

Status: foundation design; backend capabilities below are scheduled, not deployed.

Project Together helps working professionals agree on feasible vacation dates. The first product milestone is an anonymous, explainable PTO recommendation; the MVP adds private group coordination.

One repository contains an Expo 58 application targeting iOS and web, strict TypeScript domain modules, and future Supabase migrations and Edge Functions. Node 24 is the project runtime. React, React Native, Router and Web versions must follow Expo compatibility checks rather than independent upgrades.

Presentation routes call feature modules; features call pure domain functions and service boundaries. Domain modules cannot import React, Expo, Supabase, analytics or network clients. Start with React state; introduce a server-state library only when remote queries justify it.

Supabase will provide PostgreSQL, Auth and RLS. Privileged invitation operations belong in authenticated, server-authorized Edge Functions. Do not build a custom auth system or general backend framework. No microservices, queues, payments, photo storage or LLM calls are part of the foundation.

Web rendering is a proposed single-page export with host navigation fallback. The decision requires an exported-build proof of direct loading and refreshing arbitrary invitation paths; development-server success alone is insufficient. Production hosting remains unselected. See decisions/0002-routing.md.

## Main risks

- Native behavior is unverified until full Xcode and a simulator/device are available.
- Guest identities require explicit capability boundaries before invitation implementation.
- Public calendars describe suggestions, not employer leave entitlement.
- A future host must support navigation fallback, HTTPS and security headers without logging invitation URLs.

See data-model.md, security-model.md, optimization-design.md and api-contracts.md for boundaries.
