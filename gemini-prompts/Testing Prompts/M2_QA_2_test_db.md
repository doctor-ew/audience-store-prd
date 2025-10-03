We’re inside ./audience-store.

Task: TEST that the database is ready.

Verify:
- File exists: ./prisma/dev.db
- Users table has exactly the two demo users:
  buyer@s.example and seller@s.example (credits: 100 each)

Do either approach:
A) Quick Node check:
   node -e "import('./src/lib/prisma.ts').then(async m => { const u = await m.prisma.user.findMany({ select: { email: true, credits: true } }); console.log(u); process.exit(0); })"

B) Ask if you should open Prisma Studio. If user says "yes":
   pnpm dlx prisma studio

Report back:
- PASS/FAIL for file existence
- PASS/FAIL for two seeded users (show the {email, credits} objects)
- Any errors and a suggested fix (one line)
