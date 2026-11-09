# Coding standards

Use strict TypeScript, explicit boundary types, small focused functions and composition. Avoid any, speculative frameworks and unrelated refactors. Prefer readable code and minimal dependencies. Run formatting, linting and type checking through repository scripts.

Keep business rules in src/domain; routes and components compose feature behavior. Services own external integrations. Validate untrusted input at client and server boundaries. Centralize date arithmetic and error handling. Do not repeat optimization rules in UI components.

Use design tokens and accessible component primitives. Account for narrow web viewports, native safe areas, large text, touch targets and reduced motion. Every interactive control needs an understandable accessible name.

Never commit private environment files or credentials. EXPO_PUBLIC values are public. Avoid logging raw forms, private schedules, budgets, invitation links or auth sessions. Add dependencies only with a concrete feature need and review their maintenance/security impact.
