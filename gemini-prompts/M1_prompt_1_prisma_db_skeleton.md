You are a senior full-stack engineer working in an existing Next.js 14 App Router + TypeScript + Tailwind repo at ./audience-store using a PRD, Spec, and Acceptance Criteria in the ./docs directory.

Prepare the project for use in a training class. Keep the developer experience SIMPLE. Students should be able to set up the database and start the dev server with just a few easy commands.

We are in a Next.js 14 App Router + TS + Tailwind repo at ./audience-store.

TASK: Initialize database with Serena MCP for the Audience Store app.

## Using Serena MCP (Preferred Approach):
- Use Serena MCP's SQLite integration to create the database at `./data/audience-store.db`
- Create a User table with: id (cuid), email (unique), passwordHash, credits (default 100), createdAt, updatedAt
- Populate with two demo users using MCP: buyer@s.example / Passw0rd!, seller@s.example / Passw0rd!
- Verify the setup using MCP's query capabilities

## Fallback (if MCP unavailable):
- Create `prisma/schema.prisma` with a single User model
- Add `src/lib/prisma.ts` (singleton PrismaClient safe in dev)
- Add `prisma/seed.ts` with the demo users

Note: Serena MCP provides direct database access without ORM configuration, making setup simpler for students.

Show the database structure and verify the users were created.
