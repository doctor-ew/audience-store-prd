We’re in ./audience-store. Create a profile view so users can see credits and their history.
From the PRD: Each user should have a page showing their current credit balance, items they listed, and items they’ve bought.
Acceptance criteria:
/profile shows credits at top.
“My Listings”: all items user created.
“My Purchases”: items user bought with price + timestamp.
Tasks:
Add app/profile/page.tsx.
Query logged-in user’s credits, listings, and purchases using Prisma.
Render with Tailwind: two simple sections (“My Listings” / “My Purchases”).
Handle not logged in → redirect to /login.
Output: app/profile/page.tsx.