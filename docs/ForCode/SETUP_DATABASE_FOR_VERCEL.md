# Setup Database for Vercel - Guide for Claude Code

> **⚠️ PHASE 2 ONLY**: This guide is for Phase 2 implementation.
> **For Phase 1**: See `docs/ForCode/PHASE_1_IMPLEMENTATION.md` (no database)

This is a step-by-step guide for adding Prisma and Vercel Postgres in Phase 2.

## Context

When building a Next.js app for Vercel deployment, database choice matters:

- ❌ **SQLite** (`file:./dev.db`) - Doesn't work on serverless
- ⚠️ **Turso/libsql** - Complex setup, native module issues, webpack configuration needed
- ✅ **Vercel Postgres** - Simple, reliable, zero config for Vercel

## Prerequisites

Before starting, ensure:
- [ ] User has a Vercel account
- [ ] User has created a Vercel Postgres database in their project
- [ ] User has run `vercel env pull .env.local` to get connection strings

## Implementation Steps

### Step 1: Install Dependencies

```bash
cd fifa-traffic-demo-1
pnpm add @prisma/client
pnpm add -D prisma
```

### Step 2: Initialize Prisma

```bash
pnpm prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` (if it doesn't exist)

### Step 3: Update Prisma Schema

Edit `prisma/schema.prisma` to use PostgreSQL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model Event {
  id          String   @id @default(cuid())
  fifaEventId String   @unique
  name        String
  description String
  startTime   DateTime
  venueId     String
  venue       Venue    @relation(fields: [venueId], references: [id])
}

model Venue {
  id        String         @id @default(cuid())
  name      String
  address   String
  latitude  Float
  longitude Float
  events    Event[]
  favorites UserFavorite[]
}

model UserProfile {
  id        String         @id @default(cuid())
  language  String         @default("en")
  favorites UserFavorite[]
  createdAt DateTime       @default(now())
}

model UserFavorite {
  id        String      @id @default(cuid())
  profileId String
  venueId   String
  profile   UserProfile @relation(fields: [profileId], references: [id])
  venue     Venue       @relation(fields: [venueId], references: [id])

  @@unique([profileId, venueId])
}

model Translation {
  id       String @id @default(cuid())
  key      String
  locale   String
  value    String
  category String @default("general")

  @@unique([key, locale])
  @@index([locale])
}
```

### Step 4: Create Centralized Prisma Client

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Key Points**:
- Always export a singleton `prisma` instance
- Never create `new PrismaClient()` elsewhere in the codebase
- All database queries should import from this file: `import { prisma } from '@/lib/prisma'`

### Step 5: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**Why `prisma generate`?**
- Generates the Prisma Client TypeScript types
- Must run before every build
- `postinstall` ensures it runs after `pnpm install`

### Step 6: Create Database Seed (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample venue
  const venue = await prisma.venue.create({
    data: {
      name: 'Mercedes-Benz Stadium',
      address: '1 AMB Drive NW, Atlanta, GA 30313',
      latitude: 33.755487,
      longitude: -84.400993,
    },
  });

  console.log('Created venue:', venue);

  // Create sample event
  const event = await prisma.event.create({
    data: {
      fifaEventId: 'FIFA2026-ATL-001',
      name: 'FIFA World Cup 2026 - Opening Match',
      description: 'The opening match of FIFA World Cup 2026',
      startTime: new Date('2026-06-11T19:00:00Z'),
      venueId: venue.id,
    },
  });

  console.log('Created event:', event);

  // Create translations
  await prisma.translation.createMany({
    data: [
      { key: 'app.title', locale: 'en', value: 'Atlanta FIFA Navigator', category: 'general' },
      { key: 'app.title', locale: 'es', value: 'Navegador FIFA de Atlanta', category: 'general' },
      { key: 'transit.bus', locale: 'en', value: 'Bus', category: 'transit' },
      { key: 'transit.bus', locale: 'es', value: 'Autobús', category: 'transit' },
    ],
  });

  console.log('Created translations');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Install tsx for TypeScript execution:

```bash
pnpm add -D tsx
```

### Step 7: Run Migrations

```bash
# Create and apply migration
pnpm prisma migrate dev --name init

# This will:
# 1. Create prisma/migrations/ directory
# 2. Generate SQL migration files
# 3. Apply migration to database
# 4. Generate Prisma Client
# 5. Run seed (if configured)
```

### Step 8: Verify Setup

```bash
# Check database connection
pnpm prisma studio

# This opens a GUI at http://localhost:5555
# You should see your tables and seed data
```

### Step 9: Configure Vercel

Create or update `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

## Common Usage Patterns

### Reading Data

```typescript
// app/[lang]/page.tsx
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const events = await prisma.event.findMany({
    include: { venue: true },
    orderBy: { startTime: 'asc' },
  });

  return <EventList events={events} />;
}
```

### API Routes

```typescript
// app/api/translations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'en';

  const translations = await prisma.translation.findMany({
    where: { locale },
  });

  return NextResponse.json(translations);
}
```

## Deployment Checklist

When deploying to Vercel:

- [ ] Vercel Postgres database created in project
- [ ] Environment variables automatically set (no manual config needed)
- [ ] `package.json` includes `prisma generate` in build script
- [ ] All code uses `import { prisma } from '@/lib/prisma'`
- [ ] No references to SQLite, Turso, libsql, or adapter packages
- [ ] Local build succeeds: `pnpm run build`
- [ ] Push to main branch (Vercel auto-deploys)

## Troubleshooting

### Error: "Could not resolve module"

**Cause**: Leftover Turso/libsql packages

**Solution**:
```bash
pnpm remove @libsql/client @prisma/adapter-libsql libsql
rm -rf node_modules .next
pnpm install
```

### Error: "URL must start with file:"

**Cause**: Schema has `provider = "sqlite"` but using Postgres URL

**Solution**: Change schema to `provider = "postgresql"`

### Error: "Environment variable not found: POSTGRES_PRISMA_URL"

**Cause**: Missing environment variables

**Solution**:
```bash
# Pull from Vercel
vercel env pull .env.local

# Or manually add to .env.local
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
```

### Build succeeds but runtime errors

**Cause**: Multiple Prisma Client instances

**Solution**: Find and replace all instances:
```bash
# Find all new PrismaClient()
grep -r "new PrismaClient" src/

# Replace with import from centralized client
# import { prisma } from '@/lib/prisma';
```

## When NOT to Use This Approach

Avoid Vercel Postgres if:
- You need edge runtime (use Vercel Postgres + Prisma Accelerate instead)
- You're not deploying to Vercel (use standard Postgres or Supabase)
- You have complex database requirements (consider managed Postgres like AWS RDS)

## Summary

**Do:**
- ✅ Use Vercel Postgres for Vercel deployments
- ✅ Use `provider = "postgresql"` in schema
- ✅ Create centralized prisma client in `src/lib/prisma.ts`
- ✅ Include `prisma generate` in build script
- ✅ Pull environment variables with `vercel env pull`

**Don't:**
- ❌ Use SQLite in production builds
- ❌ Create multiple `new PrismaClient()` instances
- ❌ Use Turso unless you have specific edge requirements
- ❌ Manually configure connection pooling (Vercel handles this)
- ❌ Run migrations in build script (use `prisma generate` only)

---

**Created**: 2025-10-29
**For**: Claude Code automated setup
**Next Steps**: Follow this guide exactly when setting up new projects for Vercel
