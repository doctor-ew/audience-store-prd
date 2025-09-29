Add environment handling to ./audience-store:

- Create `.env.example` with DATABASE_URL (SQLite default) and NEXTAUTH_SECRET placeholder.
- Add `src/lib/env.ts`:
  - Reads DATABASE_URL and NEXTAUTH_SECRET
  - If NEXTAUTH_SECRET missing in dev, auto-generate one and warn

Show file contents.
