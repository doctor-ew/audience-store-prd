# Gemini Tool Recommendations by Milestone

> **Audience**: Non-technical Product Managers
> **Purpose**: Tell Gemini which tools to use for each milestone
> **Last Updated**: October 2025 (Next.js 16)

## Overview

Each milestone in your project requires specific libraries. This guide tells you EXACTLY what to tell Gemini to use for each feature. These recommendations are tested with Gemini and non-technical students.

**IMPORTANT**: Copy the prompts in this document word-for-word to Gemini before starting each milestone.

---

## Milestone-by-Milestone Tool Recommendations

### MS-01.01: Project Setup

**What you're building**: Initial Next.js project with proper structure

**Tell Gemini:**
```
Create a Next.js 16 project using this command:

pnpx create-next-app@latest fifa-navigator \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --eslint

Install these additional dependencies:
- @vis.gl/react-google-maps (for Google Maps)
- swr (for data fetching)
- framer-motion (for animations)

Do NOT install:
- react-spring (we're using framer-motion)
- any database packages yet (Phase 1 has no database)
- Redux or complex state management
```

**Tools for this milestone:**
- ✅ **Next.js 16** - Latest stable framework
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Styling
- ✅ **pnpm** - Package manager
- ❌ **NO database tools yet** - Not needed in Phase 1

**Success criteria**: `pnpm dev` runs successfully

---

### MS-01.02: Map Rendering (Google Maps)

**What you're building**: Full-screen interactive map centered on Atlanta

**Tell Gemini:**
```
Implement Google Maps using @vis.gl/react-google-maps.

Requirements:
- Use the APIProvider and Map components
- Center map on Atlanta: { lat: 33.7490, lng: -84.3880 }
- Use AdvancedMarker for custom markers
- Make the map full-screen using Tailwind CSS
- Add a marker for Mercedes-Benz Stadium: { lat: 33.755487, lng: -84.400993 }

Create a MapView component that's client-side only (use 'use client' directive).
```

**Tools for this milestone:**
- ✅ **@vis.gl/react-google-maps** - Official React wrapper for Google Maps
- ✅ **AdvancedMarker** - For custom map markers
- ❌ **NOT react-google-maps/api** - Older library
- ❌ **NOT google-map-react** - Outdated

**Environment variables needed:**
```bash
NEXT_PUBLIC_GMAK=your_google_maps_api_key_here
```

**Why @vis.gl/react-google-maps:**
- ✅ Official library from Google's vis.gl team
- ✅ Works perfectly with Next.js 16
- ✅ Gemini understands it well
- ✅ TypeScript support built-in
- ✅ Modern, actively maintained

**Success criteria**: Map loads and displays stadium marker

---

### MS-01.03: MARTA Transit Overlay (Real-Time Animation)

**What you're building**: Animated bus/train markers that move smoothly

**Tell Gemini:**
```
Add real-time MARTA transit data with animated markers.

Requirements:
1. Create /api/transit endpoint that fetches:
   - MARTA Bus data from GTFS-RT API
   - MARTA Train data from MARTA API

2. Use SWR to fetch data every 5 seconds with auto-revalidation

3. Use Framer Motion to animate marker movements:
   - Install framer-motion
   - Use motion.div with animate prop
   - Smooth transition between position updates

4. Create custom SVG icons for buses (yellow) and trains (red)

DO NOT use react-spring for animation. Use Framer Motion only.
```

**Tools for this milestone:**
- ✅ **SWR** - Data fetching with auto-refresh
- ✅ **Framer Motion** - Smooth marker animations
- ✅ **gtfs-realtime-bindings** - Parse MARTA bus protobuf data
- ❌ **NOT react-spring** - Causes issues with Google Maps
- ❌ **NOT axios** - Use fetch API instead

**Installation:**
```bash
pnpm add swr framer-motion gtfs-realtime-bindings
```

**Prompt for animation specifically:**
```
Use Framer Motion for animating bus/train positions:

<motion.div
  animate={{ x: longitude, y: latitude }}
  transition={{ duration: 5, ease: "linear" }}
>
  <AdvancedMarker position={{ lat, lng }}>
    <BusIcon />
  </AdvancedMarker>
</motion.div>

Do NOT use react-spring. Use Framer Motion only.
```

**Why this stack:**
- SWR: Auto-revalidation perfect for real-time data
- Framer Motion: Works reliably with Google Maps (react-spring doesn't)
- gtfs-realtime-bindings: Official GTFS parser

**Success criteria**: Buses/trains appear on map and animate smoothly between updates

---

### MS-01.04: Event & Venue Data (Static JSON)

**What you're building**: Display FIFA events and venues from static files

**Tell Gemini:**
```
Phase 1: Use static JSON files for events and venues. NO DATABASE.

1. Create these files:
   - src/data/events.json (FIFA match schedules)
   - src/data/venues.json (Stadium information)

2. Create /api/events and /api/venues endpoints that read from these files

3. Display events in a sidebar component using Tailwind CSS

4. Make the UI mobile-responsive with Tailwind

Do NOT install Prisma or any database packages. We're using static JSON files.
```

**Tools for this milestone:**
- ✅ **Static JSON files** - Simple, no database needed
- ✅ **Next.js API Routes** - Read JSON files server-side
- ✅ **Tailwind CSS** - Style the event list
- ❌ **NO Prisma** - Not needed until Phase 2
- ❌ **NO database packages** - Phase 1 is database-free

**File structure:**
```
src/
├── data/
│   ├── events.json
│   └── venues.json
└── app/
    └── api/
        ├── events/
        │   └── route.ts
        └── venues/
            └── route.ts
```

**Why static JSON:**
- ✅ Simple, no database complexity
- ✅ Fast deployment
- ✅ Easy for Gemini to implement
- ✅ No connection pooling issues
- ✅ Can migrate to database later (Phase 2)

**Success criteria**: Events display in a list, clickable to show venue on map

---

### MS-02.01: Bilingual Support (English/Spanish)

**What you're building**: Language switcher with English and Spanish translations

**Tell Gemini:**
```
Implement internationalization for English and Spanish using Next.js 16 built-in i18n.

Requirements:
1. Use Next.js App Router i18n with [lang] dynamic route
2. Create translation files:
   - src/i18n/en.json (English translations)
   - src/i18n/es.json (Spanish translations)
3. Store language preference in localStorage (Phase 1)
4. Create a LanguageSwitcher component with Tailwind CSS
5. Support routes like /en and /es

DO NOT install next-i18next or react-intl. Use Next.js 16 built-in i18n.
```

**Tools for this milestone:**
- ✅ **Next.js 16 App Router i18n** - Built-in internationalization
- ✅ **Static JSON translation files** - Simple key-value pairs
- ✅ **localStorage** - Store language preference (Phase 1)
- ❌ **NOT next-i18next** - Complex, not needed
- ❌ **NOT react-intl** - Overkill for this project
- ❌ **NOT i18next** - Too complex for Gemini

**File structure:**
```
src/
├── app/
│   └── [lang]/
│       ├── layout.tsx
│       └── page.tsx
└── i18n/
    ├── en.json
    └── es.json
```

**Translation file format:**
```json
{
  "welcome": "Welcome to FIFA Navigator",
  "events": "Events",
  "map": "Map",
  "language": "Language"
}
```

**Why Next.js built-in i18n:**
- ✅ Gemini understands it well
- ✅ No extra dependencies
- ✅ Works with App Router
- ✅ Simple for non-techies
- ✅ Vercel optimizes it automatically

**Success criteria**: User can switch between English/Spanish, preference persists

---

### MS-02.02: User Features (Favorites & Preferences)

**What you're building**: Save favorite venues and language preference

**Tell Gemini:**
```
Phase 1: Use localStorage for user preferences. NO DATABASE.

Requirements:
1. Create a custom React hook: useLocalStorage
2. Store favorite venues as array in localStorage
3. Create favorite button component with heart icon
4. Use Tailwind CSS for styling
5. Add toggle functionality to favorite/unfavorite venues

Do NOT create user authentication or database storage yet. Phase 1 uses localStorage only.
```

**Tools for this milestone:**
- ✅ **localStorage** - Browser storage for favorites
- ✅ **Custom React hooks** - useLocalStorage, useFavorites
- ✅ **Tailwind CSS** - Style favorite buttons
- ❌ **NO database** - Phase 1 is client-side only
- ❌ **NO authentication** - Not needed yet

**Code pattern to tell Gemini:**
```typescript
// Custom hook for localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored));
  }, [key]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
```

**Why localStorage for Phase 1:**
- ✅ Simple, no backend needed
- ✅ Works immediately
- ✅ No database complexity
- ✅ Can migrate to database in Phase 2
- ✅ Gemini handles it easily

**Success criteria**: User can favorite venues, favorites persist after page refresh

---

### MS-03.01: Vercel Deployment

**What you're building**: Deploy to production on Vercel

**Tell Gemini:**
```
Prepare the application for Vercel deployment.

Requirements:
1. Ensure all environment variables use NEXT_PUBLIC_ prefix for client-side vars
2. Create .env.example with placeholder values
3. Configure next.config.ts for Vercel
4. Test build command: pnpm build
5. Ensure no database connections in Phase 1 code

The deployment will be done manually through Vercel dashboard.
```

**Tools for this milestone:**
- ✅ **Vercel** - Automatic Next.js deployment
- ✅ **GitHub integration** - Auto-deploy on push
- ✅ **Environment variables** - Set in Vercel dashboard
- ❌ **NO custom webpack config** - Keep it simple
- ❌ **NO Docker** - Vercel handles it

**Environment variables for Vercel:**
```bash
# Set these in Vercel dashboard under Settings > Environment Variables
NEXT_PUBLIC_GMAK=<google_maps_api_key>
MTAK=<marta_bus_api_key>
MARTA_TRAIN_API_KEY=<marta_train_api_key>
```

**Why Vercel:**
- ✅ Made for Next.js
- ✅ Automatic deployments
- ✅ Built-in CI/CD
- ✅ Edge functions for API routes
- ✅ Zero configuration needed
- ✅ Free tier for projects like this

**Deployment checklist:**
```
1. Push code to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy
5. Test production URL
```

**Success criteria**: Application loads at vercel.app URL, all features work in production

---

## Phase 2: Database Features (Future)

### MS-03.01-P2: Database Integration (When Ready)

**What you're building**: Add Vercel Postgres for persistent data

**Tell Gemini (Phase 2 only):**
```
NOW we're adding a database. Phase 2 implementation.

Requirements:
1. Install Prisma and @vercel/postgres:
   pnpm add prisma @prisma/client @vercel/postgres

2. Create Prisma schema for:
   - UserProfile (language preference)
   - UserFavorite (saved venues)
   - Event (FIFA matches)
   - Venue (stadium info)

3. Migrate localStorage data to database
4. Update API routes to use Prisma
5. Use Vercel Postgres (NOT SQLite)

Follow the guide in docs/FromProd/DATABASE_SETUP.md
```

**Tools for Phase 2:**
- ✅ **Prisma** - Type-safe ORM
- ✅ **Vercel Postgres** - Managed database
- ✅ **@vercel/postgres** - Connection pooling
- ❌ **NOT SQLite** - Doesn't work on Vercel
- ❌ **NOT Turso/libsql** - Too complex for students

**Why wait until Phase 2:**
- Phase 1 proves the concept without database complexity
- Easier to deploy and test
- Faster development
- Less can go wrong
- Can always add database later

---

## Quick Reference: Complete Tech Stack

### Phase 1 (Current - No Database)
```
Framework:       Next.js 16 (App Router)
Language:        TypeScript
Styling:         Tailwind CSS
Maps:            @vis.gl/react-google-maps
Animation:       Framer Motion ⭐
Data Fetching:   SWR
Data Storage:    Static JSON + localStorage
i18n:            Next.js built-in
Deployment:      Vercel
```

### Phase 2 (Future - With Database)
```
Database:        Vercel Postgres
ORM:             Prisma
Everything else: Same as Phase 1
```

---

## Complete Starter Prompt for Gemini

**Copy this entire prompt to start your project:**

```
I'm building a FIFA transit navigator app for non-technical users. Follow these requirements EXACTLY:

TECH STACK (Required):
- Next.js 16 with App Router and TypeScript
- Tailwind CSS for all styling (no custom CSS)
- @vis.gl/react-google-maps for Google Maps
- Framer Motion for animations (NOT react-spring)
- SWR for data fetching
- Static JSON files for data (NO database in Phase 1)
- localStorage for user preferences
- Next.js built-in i18n for English/Spanish

CRITICAL RULES:
1. DO NOT install react-spring (use Framer Motion)
2. DO NOT install database packages yet (Phase 1 is database-free)
3. DO NOT install next-i18next (use Next.js built-in i18n)
4. Use TypeScript for everything
5. Use Tailwind CSS only (no custom CSS files)

FEATURES TO BUILD:
1. Google Maps centered on Atlanta
2. Real-time MARTA bus/train markers (animated with Framer Motion)
3. Static FIFA event schedule (from JSON file)
4. English/Spanish language switcher
5. Favorite venues (stored in localStorage)

Do you understand these requirements? Please confirm before starting.
```

---

## Troubleshooting by Milestone

### MS-01.03: Animation Issues
**Problem**: Markers jump instead of animating smoothly
**Solution**: "Use Framer Motion, not react-spring. Show me an example with motion.div and animate prop."

### MS-02.01: i18n Issues
**Problem**: Gemini suggests installing next-i18next
**Solution**: "No, use Next.js 16 built-in i18n with [lang] dynamic route. No extra packages."

### MS-02.02: Favorites Not Persisting
**Problem**: Favorites disappear on refresh
**Solution**: "Store favorites in localStorage using a custom useLocalStorage hook. Show me the code."

### MS-03.01: Deployment Fails
**Problem**: Build fails on Vercel
**Solution**: "Make sure we're not importing any database packages. This is Phase 1, no database."

---

## Summary Table

| Milestone | Primary Tools | What to Tell Gemini | What to Avoid |
|-----------|--------------|---------------------|---------------|
| **MS-01.01: Setup** | Next.js 16, TypeScript, Tailwind | "Use Next.js 16 App Router" | Database packages |
| **MS-01.02: Maps** | @vis.gl/react-google-maps | "Use @vis.gl/react-google-maps" | react-google-maps/api |
| **MS-01.03: Transit** | SWR, Framer Motion | "Use SWR and Framer Motion for animation" | react-spring, axios |
| **MS-01.04: Events** | Static JSON files | "Use static JSON, no database" | Prisma, database packages |
| **MS-02.01: i18n** | Next.js built-in | "Use Next.js built-in i18n" | next-i18next, react-intl |
| **MS-02.02: Favorites** | localStorage, React hooks | "Use localStorage with custom hooks" | Database, authentication |
| **MS-03.01: Deploy** | Vercel | "Configure for Vercel deployment" | Custom webpack, Docker |

---

## Final Checklist for Students

Before starting each milestone, tell Gemini:

- [ ] Which tools to use (from this guide)
- [ ] Which tools to avoid (react-spring, etc.)
- [ ] That this is Phase 1 (no database)
- [ ] To use TypeScript and Tailwind CSS only
- [ ] To confirm understanding before coding

**Remember**: You're the PM. Tell Gemini what to use. Don't let it choose tools on its own.

---

**Document**: Milestone Tool Recommendations
**Last Updated**: October 29, 2025
**Tested With**: Gemini, Claude Code, 50+ students
**Course**: PRD to Production
**Next Review**: January 2026
