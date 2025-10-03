We're in ./audience-store. Add the ability for a logged-in user to buy an item safely.

From the PRD: Buying should spend credits and mark the item as sold so it disappears from the marketplace.
From the spec: The purchase must be atomic — check buyer credits, check it's still available, debit buyer, credit seller, mark sold.

## Enhanced with Serena MCP:

### Transaction Safety with MCP:
1. Use MCP's SQLite transaction capabilities for atomic operations
2. Log purchase attempts to external audit service via MCP
3. Send real-time notifications via Slack/webhook when purchases occur

### Implementation Options:

#### Option A: Direct MCP Database Transaction
Use MCP to execute atomic SQL transaction:
```sql
BEGIN TRANSACTION;
-- Check item availability and get details
SELECT * FROM Items WHERE id = ? AND purchasedById IS NULL FOR UPDATE;
-- Check buyer has credits and isn't seller
SELECT credits FROM Users WHERE id = ? AND id != sellerId;
-- Update buyer credits
UPDATE Users SET credits = credits - price WHERE id = buyerId;
-- Update seller credits
UPDATE Users SET credits = credits + price WHERE id = sellerId;
-- Mark item sold
UPDATE Items SET purchasedById = buyerId WHERE id = itemId;
COMMIT;
```

#### Option B: Hybrid Approach (Prisma + MCP monitoring)
Create src/lib/actions.ts with purchaseItem(itemId: string):
- Use Prisma.$transaction for database atomicity
- Use MCP to log transaction to audit service
- Use MCP to send purchase notifications
- Use MCP for distributed lock if needed

### MCP Enhancements:
- Real-time inventory tracking via external service
- Purchase analytics logging
- Fraud detection integration
- Notification system for sellers

Acceptance criteria remain the same:
- Only logged-in users can buy
- Can't buy own items
- Concurrent purchases handled safely
- Clear error messages

Output: new or updated src/lib/actions.ts with MCP integration for monitoring/notifications.