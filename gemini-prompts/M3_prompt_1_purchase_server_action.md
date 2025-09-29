We’re in ./audience-store. Add the ability for a logged-in user to buy an item safely.
From the PRD: Buying should spend credits and mark the item as sold so it disappears from the marketplace.
From the spec: The purchase must be atomic — check buyer credits, check it’s still available, debit buyer, credit seller, mark sold.
Acceptance criteria:
Only logged-in users can buy.
A user can’t buy their own item.
If two people click buy at once, only one succeeds.
Errors return clearly (e.g. “insufficient credits”).
Tasks:
Create src/lib/actions.ts (or extend if it exists) with a purchaseItem(itemId: string) server action.
Use Prisma.$transaction to:
Re-check availability.
Check buyer has enough credits and isn’t the seller.
Debit buyer, credit seller, mark item as sold.
Return { ok: true } or { ok: false, code: “…reason…” }.
Add safe logging (no emails/passwords).
Output: new or updated src/lib/actions.ts.