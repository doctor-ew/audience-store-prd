Add NextAuth (credentials) for Audience Store:

- Add `src/lib/auth.ts` using Prisma + bcrypt
- Add `app/api/auth/[...nextauth]/route.ts` using that config
- Add `app/api/auth/signup/route.ts` (Zod validation, bcrypt password hash, safe logging, apply simple rate limit helper from earlier)
Show file contents.
