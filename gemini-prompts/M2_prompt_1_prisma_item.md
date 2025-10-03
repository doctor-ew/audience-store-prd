We are in ./audience-store (Next.js App Router + TS + SQLite).

Task: extend the DB for marketplace listings.

## Using Serena MCP (Preferred):
Use Serena MCP to directly modify the SQLite database:

1. Add an Items table with:
   - id (cuid primary key)
   - name (text)
   - description (text)
   - price (integer)
   - createdAt (timestamp)
   - updatedAt (timestamp)
   - sellerId (foreign key to Users)
   - purchasedById (nullable foreign key to Users)

2. Create relationships:
   - One seller can have many items (sellerId -> Users.id)
   - One buyer can purchase many items (purchasedById -> Users.id)

3. Seed with 3 unsold Items for the seller user using MCP:
   - "Vintage Baseball Card" - $50
   - "Concert Poster" - $30
   - "Signed Basketball" - $100

Use MCP queries to verify the tables and relationships are properly created.

## Fallback (if MCP unavailable):
- Update prisma/schema.prisma to add Item model with relations
- Update prisma/seed.ts to create the 3 demo items
- Return the full updated files

Remind the Human In The Loop (HITL) to either:
- Use MCP commands to update the database directly, OR
- Run `npm run db:push && npm run db:seed` for Prisma approach