We’re inside ./audience-store (Next.js + Prisma + SQLite).

Task: RUN the database setup scripts.

Do:
1) If pnpm warned about blocked builds, approve Prisma:
   pnpm approve-builds @prisma/client || true

2) Install deps (only if needed):
   pnpm install

3) Run the DB setup (preferred):
   pnpm run db:setup
   # If that script is missing, run the pieces:
   pnpm prisma:generate
   pnpm db:push
   pnpm db:seed

Report back:
- Show the exact commands you executed.
- Summarize output from each step (success or error).
- If something failed, include the last ~20 lines and a one-line fix.
