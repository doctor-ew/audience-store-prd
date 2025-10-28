# GitHub Codespaces Setup for MARTA API

This document explains the configuration needed to run the Atlanta FIFA Navigator in GitHub Codespaces with MARTA transit data.

## 🚨 Critical Setup Requirements

### 1. Project Structure
**The Next.js app MUST run in its own subdirectory, NOT the repository root.**

```
audience-store-prd/          # Repository root
├── docs/
├── .devcontainer/
└── fifa-traffic-demo/        # ✅ Next.js app directory
    ├── src/
    ├── public/
    ├── package.json
    └── .env.local
```

**Why:** Next.js requires a clean directory structure and will conflict with monorepo setup if run from root.

**Usage:**
```bash
# ❌ DON'T run from root
cd /workspaces/audience-store-prd
pnpm dev

# ✅ DO run from app directory
cd /workspaces/audience-store-prd/fifa-traffic-demo
pnpm dev
```

### 2. Environment Variable Length Limitation
**Next.js 15 RC has a bug where long environment variable names are not loaded.**

```bash
# ❌ DON'T USE - Too long (>15 chars)
GOOGLE_MAPS_API_KEY=...
MARTA_TRAIN_API_KEY=...

# ✅ DO USE - Short names (≤10 chars)
GMAK=...           # Google Maps API Key
MTAK=...           # MARTA Train API Key
```

**Also:** Never use quotes in `.env.local` - they become part of the value!

```bash
# ❌ WRONG - quotes are included in value
MTAK="72f48776-a69e-496c-a823-dc6ee91dfd10"

# ✅ RIGHT - no quotes
MTAK=72f48776-a69e-496c-a823-dc6ee91dfd10
```

See `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md` for detailed examples.

---

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

Add these to your `.env.local` file in the app directory (`fifa-traffic-demo/.env.local`):

```bash
# Use SHORT variable names (Next.js 15 RC bug)
NEXT_PUBLIC_GMAK=your_google_maps_key_here
MTAK=your_marta_train_key_here

# Optional
USE_MOCK_MARTA_DATA=false  # Set to "true" to use mock data

# Stadium location (optional - has defaults)
NEXT_PUBLIC_STADIUM_NAME=Mercedes-Benz Stadium
NEXT_PUBLIC_STADIUM_LAT=33.754542
NEXT_PUBLIC_STADIUM_LNG=-84.402492
```

**Important:**
- NO quotes around values
- Keep variable names short (≤10 characters)
- Run `pnpm dev` from the `fifa-traffic-demo/` directory

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
1. Verify you're running from the app directory:
   ```bash
   pwd  # Should show: /workspaces/audience-store-prd/fifa-traffic-demo
   ```

2. Verify environment variables are set (check server logs):
   ```bash
   # Look for these in the terminal where pnpm dev is running
   # "MARTA Train API Key: 72f48776..."
   # "Full Train URL: https://..."
   ```

3. Check your `.env.local` file:
   - Must be in `fifa-traffic-demo/.env.local`
   - Variable names must be short (MTAK, not MARTA_TRAIN_API_KEY)
   - No quotes around values

4. Try setting `USE_MOCK_MARTA_DATA=true` as fallback

### Issue: Environment variables not loading (shows empty/undefined)

**Symptoms:**
- Server logs show: `MARTA Train API Key: ...` (empty)
- API returns: `Invalid APIKey` error
- Buses work but trains don't appear

**Solution:**
1. Check variable name length - MUST be ≤10 characters:
   ```bash
   # ❌ Too long
   MARTA_TRAIN_API_KEY=...

   # ✅ Short enough
   MTAK=...
   ```

2. Remove quotes from `.env.local`:
   ```bash
   # ❌ WRONG - quotes become part of value
   MTAK="72f48776-a69e-496c-a823-dc6ee91dfd10"

   # ✅ CORRECT - no quotes
   MTAK=72f48776-a69e-496c-a823-dc6ee91dfd10
   ```

3. Restart dev server after changing `.env.local`:
   ```bash
   # Press Ctrl+C to stop
   pnpm dev
   ```

### Issue: Proxy returns 429 (Rate Limited)

The `allorigins.win` proxy has rate limits. If you hit them:
- Wait a few minutes
- Use mock data temporarily
- Consider deploying your own proxy server

## Production Deployment

When deploying to production (Vercel, AWS, etc.), the code automatically uses **direct connections** because those environments don't set Codespaces environment variables. No proxy overhead occurs in production.

## Next Steps

1. Set up your Codespaces secrets with the required API keys
2. Rebuild your Codespace if it's already running
3. Test the application and verify console logs show proxy usage
4. Refer to `TECH_NOTE_Codespaces_API_Testing.md` for curl test commands

---

**Created:** 2025-10-26
**Updated:** 2025-10-28
**Branch:** fifa-traffic-demo-prompts-CODE
