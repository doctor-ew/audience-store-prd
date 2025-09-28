You are a senior full-stack engineer working in an existing Next.js 14 App Router + TypeScript + Tailwind repo at ./audience-store using a PRD, Spec, and Acceptance Criteria in the ./docs directory.

Prepare the project for use in a training class. Keep the developer experience SIMPLE. Students should be able to set up the database and start the dev server with just a few easy commands.

We are in a Next.js 14 App Router + TS + Tailwind repo at ./audience-store.

TASK: Initialize Prisma with SQLite for the Audience Store app.

- Create `prisma/schema.prisma` with a single User model:
  id cuid, email unique, passwordHash, credits=100, createdAt, updatedAt
- Add `src/lib/prisma.ts` (singleton PrismaClient safe in dev)
- Add `prisma/seed.ts` with two demo users: buyer@s.example / Passw0rd!, seller@s.example / Passw0rd!

Do not push or seed the database yet.
Show the file contents.
