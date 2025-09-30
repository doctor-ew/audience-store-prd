You are a senior engineer verifying the DB setup for Audience Store (Next.js + Prisma + SQLite).
Steps I expect:
1. Run `pnpm prisma:generate` to generate the Prisma client.
2. Run `pnpm db:push` to sync the schema.
3. Run `pnpm db:seed` to create demo users.
Check the output for any errors and confirm that buyer@s.example and seller@s.example are in the DB.

Run:
pnpm prisma:generate && pnpm db:push && pnpm db:seed

Verify:
- No errors in logs.
- prisma/dev.db exists.
- Two seeded users (buyer@s.example / seller@s.example) present.
