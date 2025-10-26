# Prompt: Generate Technical Specification from PRD

You are a senior tech lead writing a professional software specification for a teaching demo environment.

## Pre-Reading Required

1. `docs/FromProd/PRD.md` – Product requirements and feature goals.
2. `docs/FromProd/WBS.md` – Development phases and MARTA integration tasks.
3. `docs/FromProd/USER_STORY_MAPPING.md` – User stories and journey mapping.
4. `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md` – MARTA connectivity constraints inside Codespaces.
5. `docs/FromProd/prompt_framework.gif` – Visual guide for prompt engineering framework to structure milestone prompts.

## Context

- **PRD Location**: `docs/FromProd/PRD.md` – Product Requirements Document for "Atlanta FIFA Navigator"
- **WBS Reference**: `docs/FromProd/WBS.md` – Work Breakdown Structure with Phase 3 development tasks
- **Infrastructure Target**: Next.js App Router + Vercel deployment + GitHub Codespaces development environment
- **Data Stack**: Prisma ORM + SQLite (development) + Vercel Postgres (production)
- **Data Feeds**: MARTA (bus/train), FIFA schedule, City of Atlanta open data, partner promotions
- **Key Constraint**: Codespaces blocks non-standard ports (see `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md`)
- **Teaching Context**: Demonstrate end-to-end flow from PRD → Spec → Milestones → Implementation suitable for autonomous coding agents

## Your Job

### 1. Write Technical Specification (`docs/spec.md`)

Translate the PRD into an implementable design document that a delivery team (or code agent) can follow.

**Architecture & Infrastructure**

- End-to-end system architecture using Next.js App Router with API routes, Prisma ORM, and Vercel deployment.
- Technology stack table: Next.js, TypeScript, Prisma, SQLite (dev), Vercel Postgres (prod), SWR for data fetching, Google Maps API, MARTA APIs.
- Repository/file structure following Next.js App Router conventions with `app/`, `components/`, `lib/`, `prisma/` directories.
- Development environment plan for GitHub Codespaces including SQLite setup, environment variables, and MARTA API proxy configuration.

**Core Systems**

- Data model definition using Prisma schema for events, venues, transit data, user profiles, itineraries, preferences.
- Data ingestion/fetching for FIFA schedule, partner content, MARTA bus/train feeds (with Codespaces proxy logic), City of Atlanta open data.
- API routes (Next.js API routes) for events/venues, transit data, user preferences, partner content. Include request/response shapes.
- UI pages & component hierarchy: home dashboard, events list, venue details, transit center, user profile.
- External integrations: MARTA Bus API (GTFS-RT), MARTA Train API (port 18096 with proxy), Google Maps API, FIFA data sources, City data APIs.

**Implementation Details**

- Environment detection utilities for Codespaces and MARTA Train API proxy selection.
- Transit data resilience: parallel fetch for bus/train, SWR caching, timeout handling, fallback to mock data.
- Data fetching patterns for FIFA schedule, venue information, partner promotions.
- Real-time map updates with transit vehicle markers, route display, and stadium location.
- Bilingual support (i18n) for English and Spanish.
- Performance optimization: client-side caching, efficient re-rendering, API response optimization.
- Security considerations: API key management (server-side only), rate limiting, error handling.
- Deployment strategy: Vercel for production, GitHub Codespaces for development, environment variable management.

**Feature Categorization**

- MVP features: Map display, real-time MARTA transit overlay, event/venue discovery, bilingual UI, traffic layer, user favorites.
- Future enhancements: Routing directions, push notifications, AR features, ticketing integration, analytics.
- Known limitations: Codespaces requires proxy for MARTA Train API, mock data fallback when APIs unavailable.

### 2. Work Breakdown Structure

Create implementation milestones that align with WBS Phase 3 goals and reflect the updated scope.

**Milestone Format**

```markdown
## Milestone X.Y: [Feature Name]

**Goal:** [One sentence description]
**Dependencies:** [Previous milestones or setup tasks]
**Duration:** [Estimated time]

### Tasks

- [ ] Task 1: [Description]
  - Files: `path/to/file.ts`
  - Acceptance: [Specific, testable criteria]

### Testing Checklist

- [ ] Unit tests for [...]
- [ ] Integration test [...]
- [ ] Manual test [...]
```

**Required Milestones**

1. **MS-01.01**: Project Setup (Next.js, Prisma, dependencies, environment configuration)
2. **MS-01.02**: Map Rendering (Google Maps integration, stadium marker, basic UI)
3. **MS-01.03**: MARTA Transit Overlay
   - Subtask A: MARTA Bus API integration (GTFS-RT)
   - Subtask B: MARTA Train API with Codespaces detection and proxy
   - Subtask C: Real-time map markers and updates
4. **MS-01.04**: Event & Venue Data (FIFA schedule, venue info, data model)
5. **MS-02.01**: Bilingual Support (i18n setup, English/Spanish translations)
6. **MS-02.02**: User Features (favorites, preferences, profile)
7. **MS-03.01**: Database Integration (Prisma schema, migrations, CRUD operations)

For each milestone:

- List concrete tasks with file paths and acceptance criteria.
- Include Codespaces proxy considerations, Vercel deployment requirements, and environment variables where relevant.
- Provide a testing checklist (unit, integration, manual) that proves the milestone is complete.
- Structure each milestone following the prompt engineering framework shown in `docs/FromProd/prompt_framework.gif` to ensure milestones can be converted into effective AI prompts.

### 3. Output Requirements

- Produce pure Markdown suitable for `docs/spec.md`.
- Use tables for data models and API references; code blocks for file structures and key snippets.
- Use checkboxes for milestone task tracking and testing checklist.
- Reference supporting docs (`TECH_NOTE`, `WBS`, `PRD`) where helpful.
- Level of detail must enable an autonomous agent to implement the system safely.

### 4. Important Constraints

1. Do **not** write production code—focus on the specification.
2. Always account for Codespaces limitations (MARTA Train API port 18096 proxy requirement).
3. Use Vercel + Next.js + Prisma stack only (no AWS services).
4. Make opinionated choices explicit and flag areas needing stakeholder decisions.
5. Maintain clear separation between MVP scope and future enhancements.

### 5. Success Criteria

- The spec aligns with PRD objectives and WBS deliverables.
- Architecture uses Vercel + Next.js + Prisma stack (no AWS).
- MARTA integration (bus/train plus Codespaces proxy) is fully specified with working curl examples.
- FIFA schedule, venue data, and partner content integration is specified.
- Bilingual support (English/Spanish) approach is documented.
- Milestones include verifiable acceptance criteria and testing guidance.
- Security practices are documented (API key management, error handling).
- Developers (or AI agents) can implement each milestone independently.

---

Then produce `docs/spec.md` with the technical specification and milestone breakdown.
