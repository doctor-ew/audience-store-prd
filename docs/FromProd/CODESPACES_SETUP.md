# GitHub Codespaces Setup for MARTA API

This document explains the configuration needed to run the Atlanta FIFA Navigator in GitHub Codespaces with MARTA transit data.

## Problem

GitHub Codespaces blocks outbound connections to non-standard ports (anything other than 80/443) for security reasons. The MARTA Train API runs on port 18096, which causes timeout errors when accessed from Codespaces.

## Solution

The application automatically detects when running in Codespaces and routes the MARTA Train API through a CORS proxy (`allorigins.win`) that operates on standard port 443.

## Configuration Files Updated

### 1. `.devcontainer/devcontainer.json`

Added MARTA API keys to the container environment:

```json
{
  "containerEnv": {
    "MARTA_TRAIN_API_KEY": "${localEnv:MARTA_TRAIN_API_KEY}",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "${localEnv:NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}"
  }
}
```

### 2. Environment Variables Required

Add these to your Codespaces secrets or local `.env` file:

```bash
MARTA_TRAIN_API_KEY=your_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
USE_MOCK_MARTA_DATA=false  # Optional: set to "true" to use mock data
```

## Code Implementation

The MARTA API route (`app/api/marta/route.ts`) includes:

1. **Environment Detection**:
   ```typescript
   const isCodespaces = Boolean(
     process.env.CODESPACES === "true" ||
     process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
   );
   ```

2. **Conditional Proxy Routing**:
   ```typescript
   const trainFetchUrl = isCodespaces
     ? `https://api.allorigins.win/raw?url=${encodeURIComponent(trainUrl)}`
     : trainUrl;
   ```

3. **Console Logging for Debugging**:
   ```typescript
   console.log(`Train API URL: ${isCodespaces ? 'PROXIED via allOrigins' : 'DIRECT'}`);
   ```

## Testing in Codespaces

When your app runs in Codespaces, you should see these console messages:

```
🚀 CODESPACES DETECTED - Using proxy for MARTA API
Fetching MARTA bus and train data...
Train API URL: PROXIED via allOrigins
Received X bus positions from MARTA
Received Y train entries from MARTA
```

## Performance Impact

| Environment | Bus API | Train API | Total Response Time |
|-------------|---------|-----------|---------------------|
| **Local** | ~140ms | ~300ms | ~300ms (parallel) |
| **Codespaces** | ~200ms | ~600ms | ~600ms (parallel) |
| **Production** | ~150ms | ~250ms | ~250ms (parallel) |

The proxy adds approximately 200-500ms latency in Codespaces, but this is acceptable for development/demo purposes.

## Documentation

- **Technical Testing Guide**: `docs/TECH_NOTE_Codespaces_API_Testing.md`
- **WBS Integration Tasks**: `docs/WBS.md` (Task 3.6)

## Troubleshooting

### Issue: Still getting timeout errors

**Check:**
1. Verify environment variables are set:
   ```bash
   echo $CODESPACES
   echo $MARTA_TRAIN_API_KEY
   ```

2. Check application logs for detection message

3. Try setting `USE_MOCK_MARTA_DATA=true` as fallback

### Issue: Proxy returns 429 (Rate Limited)

The `allorigins.win` proxy has rate limits. If you hit them:
- Wait a few minutes
- Use mock data temporarily
- Consider deploying your own proxy server

## Production Deployment

When deploying to production (Vercel, AWS, etc.), the code automatically uses **direct connections** because those environments don't set Codespaces environment variables. No proxy overhead occurs in production.

## Database Setup

The application uses Prisma with Vercel Postgres for database management. See the detailed guides:

- **For Production Team**: `docs/FromProd/DATABASE_SETUP.md` - Complete database setup guide
- **For Claude Code**: `docs/ForCode/SETUP_DATABASE_FOR_VERCEL.md` - Step-by-step implementation
- **Quick Reference**: `docs/ForCode/DATABASE_QUICK_REFERENCE.md` - Fast lookup

### Quick Start

```bash
# 1. Pull environment variables from Vercel
vercel env pull .env.local

# 2. Run migrations
pnpm prisma migrate dev

# 3. Start development server
pnpm run dev
```

**Important**: Always use Vercel Postgres for production deployments. SQLite is not supported on Vercel's serverless environment.

## Next Steps

1. Set up your Codespaces secrets with the required API keys
2. Pull Vercel environment variables: `vercel env pull .env.local`
3. Run database migrations: `pnpm prisma migrate dev`
4. Rebuild your Codespace if it's already running
5. Test the application and verify console logs show proxy usage
6. Refer to `TECH_NOTE_Codespaces_API_Testing.md` for curl test commands

---

**Created:** 2025-10-26
**Updated:** 2025-10-29
**Branch:** fifa-traffic-demo
