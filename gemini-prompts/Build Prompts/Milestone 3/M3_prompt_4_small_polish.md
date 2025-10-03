We’re in ./audience-store. Quick UX sweep on the new buy + profile features.
From the PRD: Make it easy to understand what just happened after a purchase and where to check balances.
Acceptance criteria:
When a purchase finishes, give a quick success cue (toast or banner).
Profile page shows updated credits without reload glitch.
Errors like “already sold” show nicely.
Tasks:
Add lightweight success/error messages in ItemCard.tsx purchase flow.
On profile page, ensure credits and lists revalidate automatically or refresh after action.
Output: minimal changes to ItemCard.tsx and profile/page.tsx.