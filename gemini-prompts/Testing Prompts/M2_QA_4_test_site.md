We’re inside ./audience-store with the dev server running.

Task: TEST the site in the browser (minimal checks, no auth yet).

Open http://localhost:3000 and verify:
- The page loads without runtime errors.
- If the homepage was implemented for Milestone 2.4:
  - Empty state shows when there are no items (or you see at least one seeded/created item card).
- If /sell exists (2.3):
  - http://localhost:3000/sell loads a form with Name, Description, Price.
  - Invalid inputs show friendly errors.

Report back (bullet points):
- Homepage load: PASS/FAIL with any console errors
- Sell page form present: YES/NO
- Any obvious UI or 404 issues (1-2 lines)
- Next action you recommend (e.g., “Proceed to 3.x prompts”)
