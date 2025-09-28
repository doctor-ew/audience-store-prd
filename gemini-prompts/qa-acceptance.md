You are a QA lead writing acceptance criteria.

Context:
- The PRD is in docs/PRD.md.
- The technical specification is in docs/spec.md.

Task:
Write an acceptance-criteria checklist (docs/acceptance-criteria.md) for the "Audience Store" app.

Guidelines:
- Organize by milestone (Setup, Marketplace, Transactions, Account Page, Optional AI).
- Each criterion must be *testable* (either via API call, UI action, or DB check).
- Tie criteria directly to routes, pages, or components defined in the spec.
- Cover edge cases: insufficient credits, item already sold, empty marketplace.
- Include deployment readiness: app runs with `pnpm dev`, builds with `pnpm build`, and deploys to Codespaces/Vercel.
- Output in Markdown with `[ ]` checkboxes.
- Do not restate the PRD; write criteria so engineers and QA can agree when a slice is DONE.

