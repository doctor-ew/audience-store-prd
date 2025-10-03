We're inside ./audience-store.

Task: TEST that the database is ready.

## Using Serena MCP (Preferred):
Use MCP to directly query the SQLite database:

1. Check database exists:
   - Use MCP to verify `./data/audience-store.db` exists

2. Verify Users table:
   - Query: `SELECT email, credits FROM Users`
   - Should return exactly two demo users:
     - buyer@s.example (credits: 100)
     - seller@s.example (credits: 100)

3. Verify Items table (if Milestone 2):
   - Query: `SELECT name, price, sellerId FROM Items WHERE purchasedById IS NULL`
   - Should show 3 unsold items owned by seller

## Fallback approaches:
A) Quick Node check with Prisma:
   ```bash
   node -e "import('./src/lib/prisma.ts').then(async m => { const u = await m.prisma.user.findMany({ select: { email: true, credits: true } }); console.log(u); process.exit(0); })"
   ```

B) Prisma Studio (visual inspection):
   ```bash
   pnpm dlx prisma studio
   ```

## Report format:
- PASS/FAIL for database existence
- PASS/FAIL for seeded users (show query results)
- PASS/FAIL for Items table if applicable
- Any errors and suggested fixes

MCP advantage: Direct SQL queries without ORM overhead, instant results
