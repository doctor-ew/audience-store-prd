# FIFA Traffic Demo - Production Notes

## Internationalization (i18n) Implementation

**NOTE:** This application supports bilingual functionality (English/Spanish) using a database-driven translation system.

### Architecture

The i18n system is implemented using:

1. **Database-Backed Translations** (`Translation` model in Prisma)
   - All translatable strings are stored in the database
   - Allows dynamic translation updates without code deployment
   - Supports categorization (general, events, etc.)

2. **React Context for Client-Side State** (`TranslationContext`)
   - Provides `t()` function for translation lookup
   - `setLocale()` for switching languages without page reload
   - Initial translations hydrated from server to prevent hydration errors

3. **API Endpoint** (`/api/translations`)
   - Fetches translations dynamically when language changes
   - Query parameter: `?locale=en` or `?locale=es`

### Key Features

- **No Page Reload**: Language switching happens instantly via React state
- **URL Updates**: Language preference reflected in URL (`/en` or `/es`)
- **Server-Side Rendering**: Initial page load includes correct translations
- **Hydration Safe**: Server and client render the same content initially

### File Structure

```
src/
├── contexts/
│   └── TranslationContext.tsx    # Client-side translation provider
├── app/
│   ├── api/
│   │   └── translations/
│   │       └── route.ts           # Translation API endpoint
│   └── [lang]/
│       ├── layout.tsx             # SSR translation loading
│       └── page.tsx               # Main page
└── components/
    ├── LanguageSwitcher.tsx       # EN/ES toggle button
    ├── EventList.tsx              # Uses t('upcoming_events')
    ├── EventCard.tsx              # Uses t('event_*_name')
    └── VenueMarker.tsx            # Uses t('stadium')

prisma/
├── schema.prisma                  # Translation model definition
└── seed-translations.ts           # Translation seed data
```

### Usage in Components

```tsx
// In any client component:
import { useTranslation } from '@/contexts/TranslationContext';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('upcoming_events')}</h1>
      <button onClick={() => setLocale('es')}>Español</button>
    </div>
  );
}
```

### Adding New Translations

1. Add translations to `prisma/seed-translations.ts`:
   ```ts
   { key: 'new_key', locale: 'en', value: 'English Text', category: 'general' },
   { key: 'new_key', locale: 'es', value: 'Texto en Español', category: 'general' },
   ```

2. Run seed script:
   ```bash
   npx tsx prisma/seed-translations.ts
   ```

3. Use in components:
   ```tsx
   {t('new_key')}
   ```

### Supported Locales

- `en` - English (default)
- `es` - Spanish (Español)

### Event Translation Keys

Event translations follow the pattern: `event_{fifaEventId}_{field}`

Example:
- `event_m01_name` - "Group Stage: USA vs. England" / "Fase de Grupos: EE.UU. vs. Inglaterra"
- `event_m01_description` - Match description text

### Migration Notes

- Next.js 16 deprecated `middleware.ts` in favor of `proxy.js` (warning present, functional)
- Dynamic route params must be awaited in Next.js 15+ (`await params`)
- `generateStaticParams()` required for `[lang]` dynamic route segment

---

## Vercel Deployment

### Critical Issue: Database Migration

**⚠️ IMPORTANT:** This application currently uses SQLite (`file:./dev.db`) which **will not work on Vercel's serverless infrastructure**. SQLite requires file system persistence, which is not available in serverless environments.

You **must** migrate to a cloud database before deploying to production.

### Recommended Database Solutions

#### Option 1: **Turso** (Serverless SQLite) ⭐ RECOMMENDED

**Best for:** Minimal migration effort, keeping SQLite compatibility

**Pros:**
- **Zero schema changes** - it's serverless SQLite!
- Just update `DATABASE_URL`, nothing else changes
- Prisma has native Turso support
- Generous free tier (500 databases, 9GB storage, 1B row reads/month)
- Global edge replication for low latency
- Point-in-time recovery

**Migration Steps:**
1. Create Turso account: https://turso.tech
2. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. Create database:
   ```bash
   turso db create fifa-traffic-demo
   turso db show fifa-traffic-demo
   ```
4. Get connection URL:
   ```bash
   turso db show fifa-traffic-demo --url
   turso db tokens create fifa-traffic-demo
   ```
5. Update `DATABASE_URL` in Vercel environment variables:
   ```
   DATABASE_URL="libsql://[your-db-name]-[org].turso.io"
   ```
6. Add auth token to `.env`:
   ```
   TURSO_AUTH_TOKEN="your-token-here"
   ```
7. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

**Migration Effort:** ⏱️ 5-10 minutes
**Schema Changes:** None
**Code Changes:** None

---

#### Option 2: **Prisma Postgres** (Managed PostgreSQL)

**Best for:** Seamless Prisma integration, production-grade PostgreSQL

**Pros:**
- Built specifically for Prisma + Vercel
- One-click setup through Prisma Data Platform
- Instant provisioning
- Connection pooling included
- Development/Production environments

**Migration Steps:**
1. Sign up at https://cloud.prisma.io
2. Create new project and database
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Update field types (SQLite → PostgreSQL):
   - `String @id @default(cuid())` stays the same
   - `DateTime` stays the same
   - May need to adjust indexes/unique constraints
5. Generate new migration:
   ```bash
   npx prisma migrate dev --name migrate_to_postgres
   ```
6. Add `DATABASE_URL` to Vercel environment variables

**Migration Effort:** ⏱️ 10-15 minutes
**Schema Changes:** Minimal (mostly compatibility)
**Code Changes:** None

---

#### Other Options (Evaluated but not recommended)

| Database | Reason Not Recommended |
|----------|----------------------|
| **Vercel Postgres** | Good option, but Prisma Postgres is more integrated |
| **Supabase** | Excellent choice, but more features than needed (auth, storage, etc.) |
| **Neon** | Great serverless Postgres, but Prisma Postgres has better DX |
| **PlanetScale** | Excellent, but MySQL requires more schema changes from SQLite |
| **Upstash Redis** | Not a primary database solution |
| **MongoDB Atlas** | Requires complete schema redesign (NoSQL vs SQL) |

---

### Vercel Configuration

**File:** `vercel.json`

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "env": {
    "NEXT_PUBLIC_GMAK": "@next_public_gmak",
    "NEXT_PUBLIC_STADIUM_NAME": "@next_public_stadium_name",
    "NEXT_PUBLIC_STADIUM_LAT": "@next_public_stadium_lat",
    "NEXT_PUBLIC_STADIUM_LNG": "@next_public_stadium_lng",
    "MARTA_API_KEY": "@marta_api_key",
    "MARTA_TRAIN_API_KEY": "@marta_train_api_key",
    "MTAK": "@mtak",
    "DATABASE_URL": "@database_url"
  }
}
```

### Environment Variables Required on Vercel

Set these in your Vercel project settings (Settings → Environment Variables):

**Public (exposed to browser):**
- `NEXT_PUBLIC_GMAK` - Google Maps API Key
- `NEXT_PUBLIC_STADIUM_NAME` - Stadium name
- `NEXT_PUBLIC_STADIUM_LAT` - Stadium latitude
- `NEXT_PUBLIC_STADIUM_LNG` - Stadium longitude

**Private (server-side only):**
- `DATABASE_URL` - Your cloud database connection string
- `MARTA_API_KEY` - MARTA bus API key
- `MARTA_TRAIN_API_KEY` - MARTA train API key
- `MTAK` - Alternative MARTA key

**If using Turso, also add:**
- `TURSO_AUTH_TOKEN` - Turso authentication token

### Deployment Commands

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview environment
cd fifa-traffic-demo-1
vercel

# Deploy to production
vercel --prod
```

### Post-Deployment Steps

1. **Seed Translations:**
   ```bash
   # SSH into Vercel deployment or use Vercel CLI
   vercel env pull .env.production
   npx tsx prisma/seed-translations.ts
   ```

2. **Verify Database Connection:**
   - Check Vercel logs for database connection errors
   - Test `/api/translations?locale=en` endpoint
   - Verify translations appear on the site

3. **Test Language Switching:**
   - Visit `/en` and `/es` routes
   - Click language switcher
   - Verify no hydration errors in console

### Troubleshooting

**Issue:** `PrismaClientInitializationError: Can't reach database server`
- **Fix:** Verify `DATABASE_URL` is set correctly in Vercel environment variables
- **Fix:** Ensure database allows connections from Vercel IPs (check firewall)

**Issue:** Translations not appearing
- **Fix:** Run seed script against production database
- **Fix:** Check `/api/translations` endpoint returns data

**Issue:** Prisma migration fails
- **Fix:** Use `prisma migrate deploy` instead of `prisma migrate dev` in production
- **Fix:** Ensure all migrations are committed to git

### Next.js 16 Compatibility Note

Vercel fully supports Next.js 16. The middleware deprecation warning (`middleware.ts` → `proxy.js`) does not affect deployment functionality.
