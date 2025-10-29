# Database Setup - Quick Reference

> **⚠️ PHASE 2 ONLY**: Database is not needed for Phase 1
> **Phase 1**: Use static JSON files and localStorage

## TL;DR (Phase 2)

**For Vercel deployment: Use Vercel Postgres with these 4 steps:**

```bash
# 1. Install
pnpm add @prisma/client && pnpm add -D prisma

# 2. Get environment variables
vercel env pull .env.local

# 3. Initialize and migrate
pnpm prisma init
pnpm prisma migrate dev --name init

# 4. Build
pnpm run build
```

## Schema Template

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

## Prisma Client Template

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;
```

## package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

## Usage in Code

```typescript
// ✅ Always do this
import { prisma } from '@/lib/prisma';

// ❌ Never do this
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

## Decision Tree

```
Need database for Vercel?
│
├─ Yes, and using Next.js
│  └─ Use Vercel Postgres (recommended)
│
├─ Yes, but need edge runtime
│  └─ Use Vercel Postgres + Prisma Accelerate
│
└─ No, deploying elsewhere
   └─ Use standard PostgreSQL or Supabase
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `URL must start with file:` | Change `provider = "sqlite"` to `"postgresql"` |
| `Could not resolve @libsql` | Remove Turso packages, clean install |
| `Multiple Prisma instances` | Use centralized client in `src/lib/prisma.ts` |
| `POSTGRES_PRISMA_URL not found` | Run `vercel env pull .env.local` |

## Migration Commands

```bash
# Development (creates migration + applies)
pnpm prisma migrate dev --name migration_name

# Production (applies existing migrations)
pnpm prisma migrate deploy

# Reset database (⚠️ deletes all data)
pnpm prisma migrate reset
```

## Complete File Checklist

- [ ] `prisma/schema.prisma` - Database schema with postgresql provider
- [ ] `src/lib/prisma.ts` - Centralized Prisma client
- [ ] `.env.local` - Environment variables (from `vercel env pull`)
- [ ] `package.json` - Build scripts include `prisma generate`
- [ ] `vercel.json` - Build command includes `prisma generate` (optional)

---

**See full guides:**
- Production setup: `docs/FromProd/DATABASE_SETUP.md`
- Code implementation: `docs/ForCode/SETUP_DATABASE_FOR_VERCEL.md`
