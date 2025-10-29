# Database Setup for Vercel Deployment

> **⚠️ PHASE 2 FEATURE**: This guide is for Phase 2 implementation only.
> **For Phase 1**: See `docs/ForCode/PHASE_1_IMPLEMENTATION.md` (no database required)

This guide explains how to set up your database for Phase 2 when adding user features and persistent data.

## Problem

The initial project may use SQLite with `file:./dev.db`, which doesn't work on Vercel's serverless environment. Attempting to retrofit Turso/libsql can cause complex build issues with module resolution and native dependencies.

## Recommended Solution: Vercel Postgres

Vercel Postgres is the simplest, most reliable option for deploying Next.js apps to Vercel.

### Why Vercel Postgres?

- **Native Integration**: Built specifically for Vercel's serverless environment
- **Zero Configuration**: Automatic connection pooling and optimization
- **Generous Free Tier**: 256MB database, 60 hours compute per month
- **Simple Setup**: No adapter packages or complex webpack configs needed
- **Development-Friendly**: Works seamlessly in both local and production environments

## Step-by-Step Setup

### 1. Create Vercel Postgres Database

```bash
# Option A: Via Vercel Dashboard (Recommended)
# 1. Go to your project dashboard: https://vercel.com/your-team/your-project
# 2. Navigate to Storage tab
# 3. Click "Create Database"
# 4. Select "Postgres"
# 5. Choose a region close to your users
# 6. Copy the connection string

# Option B: Via Vercel CLI
vercel env pull .env.local
```

### 2. Configure Prisma Schema

Create or update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
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

### 3. Environment Variables

Vercel automatically provides these environment variables when you create a Postgres database:

```bash
# .env.local (for local development)
POSTGRES_URL="postgres://default:********@ep-********.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:********@ep-********.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:********@ep-********.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="ep-********.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="********"
POSTGRES_DATABASE="verceldb"
```

**Important**: These are automatically set in Vercel. For local development, run:

```bash
vercel env pull .env.local
```

### 4. Install Dependencies

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### 5. Create Centralized Prisma Client

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

### 6. Initialize Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Create and apply migrations
pnpm prisma migrate dev --name init

# Seed database (optional)
pnpm prisma db seed
```

### 7. Update package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### 8. Configure vercel.json (Optional)

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

## Using Prisma in Your Code

Always import from the centralized client:

```typescript
// ✅ Good
import { prisma } from '@/lib/prisma';

export async function getEvents() {
  return await prisma.event.findMany();
}

// ❌ Bad - creates multiple client instances
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

## Local Development vs Production

| Environment | Connection Type | Environment Variable |
|-------------|----------------|----------------------|
| **Local Development** | Direct connection | `POSTGRES_URL_NON_POOLING` |
| **Vercel Serverless** | Pooled connection | `POSTGRES_PRISMA_URL` |
| **Vercel Edge** | Not supported | Use Prisma Accelerate |

Prisma automatically uses the correct connection based on the `url` and `directUrl` in your schema.

## Migration Strategy

### From SQLite to Vercel Postgres

If you're migrating from an existing SQLite database:

1. **Export your data** from SQLite:
   ```bash
   pnpm prisma db execute --file export-data.sql
   ```

2. **Update schema** to use PostgreSQL (change `provider = "sqlite"` to `provider = "postgresql"`)

3. **Generate new migration**:
   ```bash
   pnpm prisma migrate dev --name switch-to-postgres
   ```

4. **Import data** into Postgres:
   ```bash
   pnpm prisma db push
   node scripts/import-data.js
   ```

### From Turso/libsql to Vercel Postgres

If you attempted to use Turso and hit issues:

1. **Remove Turso packages**:
   ```bash
   pnpm remove @libsql/client @prisma/adapter-libsql libsql
   ```

2. **Update schema** (change `provider = "sqlite"` to `provider = "postgresql"`)

3. **Remove adapter code** from `src/lib/prisma.ts`

4. **Follow steps 1-6** above for fresh Postgres setup

## Troubleshooting

### Build fails with "could not resolve module"

**Cause**: Leftover references to libsql or SQLite-specific packages

**Solution**:
```bash
rm -rf node_modules .next
pnpm install
pnpm prisma generate
```

### "URL must start with protocol file:"

**Cause**: Schema still has `provider = "sqlite"` but DATABASE_URL uses postgres://

**Solution**: Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("POSTGRES_PRISMA_URL")
}
```

### Connection timeout in development

**Cause**: Using pooled connection URL for local dev

**Solution**: Use direct connection in development:
```bash
# In .env.local
DATABASE_URL=$POSTGRES_URL_NON_POOLING
```

## Production Deployment Checklist

- [ ] Vercel Postgres database created
- [ ] Environment variables automatically set in Vercel project
- [ ] `prisma/schema.prisma` uses `provider = "postgresql"`
- [ ] Build script includes `prisma generate`
- [ ] All imports use `@/lib/prisma` not new PrismaClient()
- [ ] Migrations applied: `pnpm prisma migrate deploy`
- [ ] Test build locally: `pnpm run build`
- [ ] Deploy: `vercel --prod`

## Alternative: Turso (For Edge Runtime)

If you specifically need edge runtime support, Turso is an option, but requires additional configuration:

```bash
# Install packages
pnpm add @libsql/client @prisma/adapter-libsql

# Update next.config.ts
export default {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@libsql/client');
    }
    return config;
  },
};
```

**Note**: Vercel Postgres is recommended for 95% of use cases. Only use Turso if you have specific edge runtime requirements.

## Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Created**: 2025-10-29
**Last Updated**: 2025-10-29
**Recommended for**: All new Vercel deployments
