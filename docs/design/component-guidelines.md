# Component guidelines

Build presentation primitives from shared tokens. Keep optimization and authorization rules outside components. Prefer composition and clear props over a large configurable component framework.

Buttons: one clear primary action per screen, descriptive label, 44-point minimum target, keyboard/focus support on web, announced loading state and prevention of duplicate submissions.

Forms: persistent labels, sensible input modes, optional fields marked, inline actionable errors, no placeholders as sole labels. Group date controls with clear inclusive range meaning. Private inputs include concise visibility explanations.

Feedback: loading preserves context; empty states suggest a next step; errors explain recovery without exposing server internals. Success confirms a real completed action. Progress distinguishes missing responses, tentative leave and confirmed attendance.

Navigation and modals: retain a consistent back path, honor native safe areas, restore focus on web and avoid traps. Test narrow screens, large text, screen-reader order, reduced motion and keyboard use. Screenshots are useful evidence, not proof of accessibility.
