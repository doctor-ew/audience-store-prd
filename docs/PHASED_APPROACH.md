# Phased Approach: Atlanta FIFA Navigator

> **Status**: Active | **Last Updated**: 2025-10-29 | **Decision**: Approved by PM

## Executive Summary

This document outlines a **two-phase development approach** for the Atlanta FIFA Navigator project. Phase 1 focuses on core map and transit functionality without database complexity, enabling faster deployment and iteration. Phase 2 adds database-backed user features once the foundation is proven.

## Strategic Rationale

### Why This Approach?

1. **Faster Time to Market**: Deploy core functionality (maps + MARTA) in days, not weeks
2. **Risk Mitigation**: Validate core value proposition before adding complexity
3. **Simpler Deployment**: Zero database configuration issues on Vercel
4. **Better Developer Experience**: No connection pooling, migrations, or adapter issues to debug
5. **Progressive Enhancement**: Add features incrementally based on user feedback

### What We Learned

During initial implementation, database setup became a blocking issue:
- SQLite doesn't work on Vercel serverless
- Turso/libsql requires complex webpack configuration and native modules
- Database migration and connection pooling added significant complexity
- **Core value (maps + transit) doesn't require a database initially**

## Phase Breakdown

---

## Phase 1: Core Maps & Transit (MVP)

**Goal**: Deploy a working maps application with real-time MARTA transit data

**Duration**: 3-5 days

**Deployment Target**: Vercel (no database required)

### Phase 1 Features

#### ✅ Must Have
- [x] Interactive Google Maps centered on Atlanta
- [x] Mercedes-Benz Stadium marker
- [x] Real-time MARTA bus positions (GTFS-RT API)
- [x] Real-time MARTA train positions (with Codespaces proxy)
- [x] Traffic layer overlay
- [x] Bilingual support (English/Spanish) via static JSON
- [x] Static FIFA event schedule (JSON file)
- [x] Static venue information (JSON file)
- [x] Responsive design (mobile-first)

#### ❌ Explicitly Out of Scope
- ~~User authentication~~
- ~~User profiles~~
- ~~Favorites persistence~~
- ~~Database queries~~
- ~~Dynamic event management~~
- ~~Server-side user preferences~~

### Phase 1 Technical Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js on Vercel                  │
├─────────────────────────────────────────────────┤
│  Frontend (React + Google Maps API)             │
│    - MapView component                          │
│    - Static event/venue data from JSON          │
│    - Client-side translations (i18n)            │
│    - localStorage for client preferences        │
├─────────────────────────────────────────────────┤
│  API Routes (Serverless Functions)              │
│    - /api/transit (MARTA bus + train)           │
│    - /api/events (static JSON)                  │
│    - /api/venues (static JSON)                  │
└─────────────────────────────────────────────────┘
           │                    │
           ▼                    ▼
    ┌──────────┐         ┌──────────┐
    │  MARTA   │         │  Google  │
    │   APIs   │         │ Maps API │
    └──────────┘         └──────────┘
```

### Phase 1 Data Storage

All data stored in static files:

```
/src/data/
  ├── events.json        # FIFA match schedules
  ├── venues.json        # Stadium/venue information
  └── translations/
      ├── en.json        # English translations
      └── es.json        # Spanish translations
```

**User Preferences**: Stored in browser `localStorage`
- Language selection
- Map zoom/center
- Favorited venues (client-side only)

### Phase 1 Environment Variables

```bash
# Required for Phase 1
NEXT_PUBLIC_GMAK=<Google Maps API Key>
MARTA_API_KEY=<MARTA Bus API Key>
MARTA_TRAIN_API_KEY=<MARTA Train API Key>

# Optional
USE_MOCK_MARTA_DATA=false
```

### Phase 1 Success Criteria

- [ ] Application deploys to Vercel without errors
- [ ] Map displays and is interactive
- [ ] Real-time MARTA buses and trains appear on map
- [ ] Events and venues display correctly
- [ ] Language switching works (English ↔ Spanish)
- [ ] Works in GitHub Codespaces (with MARTA proxy)
- [ ] Mobile responsive on iOS and Android
- [ ] Page load time < 3 seconds on 4G

### Phase 1 Acceptance Criteria

See `docs/acceptance_criteria.md` sections marked **[Phase 1]**

---

## Phase 2: Database & User Features

**Goal**: Add persistent data and user personalization

**Duration**: 4-6 days

**Prerequisites**: Phase 1 successfully deployed and validated

### Phase 2 Features

#### ✅ Will Add
- [ ] Vercel Postgres database
- [ ] User profiles (session-based or device ID)
- [ ] Persistent favorites (saved to database)
- [ ] Server-side language preference storage
- [ ] Dynamic event management (admin can update events)
- [ ] User activity tracking (optional analytics)
- [ ] Push notification preferences

### Phase 2 Technical Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js on Vercel                  │
├─────────────────────────────────────────────────┤
│  Frontend (React + Google Maps API)             │
│    - MapView component                          │
│    - Event/venue data from database             │
│    - User profile UI                            │
├─────────────────────────────────────────────────┤
│  API Routes (Serverless Functions)              │
│    - /api/transit (MARTA bus + train)           │
│    - /api/events (Prisma → DB)                  │
│    - /api/venues (Prisma → DB)                  │
│    - /api/user (CRUD user profile)              │
├─────────────────────────────────────────────────┤
│  Prisma ORM                                     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │ Vercel Postgres  │
         │   (Serverless)   │
         └──────────────────┘
```

### Phase 2 Database Schema

```prisma
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
```

### Phase 2 Migration Strategy

**From Phase 1 Static Data to Phase 2 Database:**

1. Create Vercel Postgres database
2. Set up Prisma schema (see `docs/FromProd/DATABASE_SETUP.md`)
3. Seed database with data from Phase 1 JSON files
4. Update API routes to query database instead of JSON
5. Migrate localStorage favorites to database (client-side migration script)
6. Deploy with zero downtime (feature flags if needed)

### Phase 2 Environment Variables

```bash
# Phase 1 variables (carry forward)
NEXT_PUBLIC_GMAK=<Google Maps API Key>
MARTA_API_KEY=<MARTA Bus API Key>
MARTA_TRAIN_API_KEY=<MARTA Train API Key>

# Phase 2 additions (automatically set by Vercel)
POSTGRES_URL=<Vercel Postgres connection string>
POSTGRES_PRISMA_URL=<Pooled connection>
POSTGRES_URL_NON_POOLING=<Direct connection>
```

### Phase 2 Success Criteria

- [ ] Database successfully provisioned and connected
- [ ] User can save favorites and they persist across sessions
- [ ] Language preference persists after browser close
- [ ] Events and venues can be updated dynamically
- [ ] Migration from Phase 1 is seamless for existing users
- [ ] No performance degradation from database queries

### Phase 2 Acceptance Criteria

See `docs/acceptance_criteria.md` sections marked **[Phase 2]**

---

## Implementation Guidelines

### For Engineers (Claude Code)

**Phase 1 Implementation**:
- See `docs/ForCode/PHASE_1_IMPLEMENTATION.md`
- Focus on static data and client-side features
- No Prisma, no database, no adapters
- Use localStorage for any client preferences

**Phase 2 Implementation**:
- See `docs/ForCode/SETUP_DATABASE_FOR_VERCEL.md`
- Add Prisma + Vercel Postgres
- Migrate static data to database
- Add user API routes

### For Product Team

**Phase 1 Validation Questions**:
- Does the map load quickly and smoothly?
- Is real-time transit data accurate and helpful?
- Do users understand the event schedule?
- Is the bilingual experience seamless?
- What features do users request most?

**Phase 2 Decision Criteria**:
- User feedback indicates need for persistent favorites
- Event data needs to be updated frequently
- Analytics show repeat users (indicating profile value)
- Product team has bandwidth to manage dynamic data

## Risk Assessment

### Phase 1 Risks

| Risk | Mitigation |
|------|------------|
| MARTA API downtime | Mock data fallback, error handling |
| Google Maps quota exceeded | Monitor usage, implement caching |
| Static data becomes stale | Document update process, automate if possible |
| Users want favorites to persist | Clearly communicate Phase 2 timeline |

### Phase 2 Risks

| Risk | Mitigation |
|------|------------|
| Database connection issues | Follow Vercel Postgres best practices |
| Migration loses user data | Test migration thoroughly, have rollback plan |
| Performance degradation | Implement query optimization, caching layer |
| Increased complexity | Thorough testing, monitoring, error tracking |

## Timeline

```
Week 1:
├─ Days 1-2: Phase 1 implementation (maps + MARTA)
├─ Days 3-4: Phase 1 testing and refinement
└─ Day 5: Phase 1 deployment to Vercel

Week 2:
├─ Days 1-2: User feedback and analytics review
├─ Day 3: Phase 2 decision checkpoint
└─ Days 4-7: Phase 2 implementation (if approved)

Week 3:
├─ Days 1-2: Phase 2 testing
├─ Day 3: Data migration and deployment
└─ Days 4-5: Phase 2 validation and monitoring
```

## Documentation References

### Phase 1 Resources
- `docs/ForCode/PHASE_1_IMPLEMENTATION.md` - Step-by-step Phase 1 guide
- `docs/spec.md` - Updated with phase indicators
- `docs/acceptance_criteria.md` - Phase 1 criteria

### Phase 2 Resources
- `docs/FromProd/DATABASE_SETUP.md` - Production database guide
- `docs/ForCode/SETUP_DATABASE_FOR_VERCEL.md` - Implementation guide
- `docs/ForCode/DATABASE_QUICK_REFERENCE.md` - Quick lookup

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-10-29 | Adopt phased approach | Database setup blocking deployment; core value doesn't require DB |
| 2025-10-29 | Phase 1: Static data + localStorage | Fastest path to validated product |
| 2025-10-29 | Phase 2: Vercel Postgres | Best integration for Vercel deployments |

---

**Approved By**: Product Management
**Next Review**: After Phase 1 deployment
**Questions**: Contact PM team

