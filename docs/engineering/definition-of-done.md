# Definition of Done

Every feature, vertical slice, bug fix and code-changing task must meet all of these:

- Approved acceptance criteria satisfied; required automated checks pass.
- Relevant loading/error/empty states, privacy, authorization, accessibility, iOS/web behavior and required analytics verified; documentation current and founder reproduction possible.
- A NEW independent reviewer session inspects the approved requirements and immutable implementation revision. Developer self-approval, reused/forked context and a separate window without fresh context do not qualify.
- Review report preserved under reports/reviews; no unresolved P0/P1; unresolved P2 risks explicitly accepted by the founder with evidence.
- Engineering Coordinator verifies report provenance, revision freshness, tests and completion. Review PASS alone cannot waive failed checks, unmet acceptance or founder production approval.

If an isolated review cannot launch or effective permissions/revision cannot be verified, mark **Review Blocked**, never Done. Unverified required platform behavior also prevents acceptance. See independent-review.md for the efficient workflow and report contract. Historical reports remain valid records of their actual scope but are not automatically approvals under this protocol.
