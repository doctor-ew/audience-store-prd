# Technical Specification: Atlanta FIFA Navigator

> Version 1.1 | Status: Draft | 2025-10-26
> Based on: Vercel + Next.js + Prisma Stack

## 1. Introduction

This document provides a detailed technical specification for the Atlanta FIFA Navigator application, translating the product requirements from `docs/FromProd/PRD.md` into an implementable design. This specification is tailored for a **Next.js and Vercel** architecture, avoiding AWS services as per the updated project constraints.

The primary development environment will be **GitHub Codespaces**, which introduces specific constraints, notably the need for a proxy for the MARTA Train API, as detailed in `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md`.

---

## 2. Architecture & Infrastructure

### 2.1. System Architecture Overview

The application is a monolithic **Next.js application** deployed on **Vercel**. The architecture leverages Next.js App Router for both the frontend UI and the backend API, creating a tightly integrated and efficient development experience.

-   **Frontend**: A server-rendered React application built with the Next.js App Router. Data fetching on the client-side will be handled by `SWR` for features requiring real-time updates (like the transit map).
-   **Backend**: Serverless functions implemented as **Next.js API Routes**. These handle all backend logic, including data fetching from external APIs (MARTA, FIFA) and database interactions via Prisma.
-   **Database**:
    -   **Development**: **SQLite** running locally within GitHub Codespaces for simplicity and rapid setup.
    -   **Production**: **Vercel Postgres**, a fully managed serverless PostgreSQL database that integrates seamlessly with Vercel deployments.
-   **Deployment**: The application will be deployed to **Vercel**, leveraging its CI/CD integration with GitHub for automated builds and deployments.

### 2.2. Technology Stack

| Category | Technology | Version/Specification | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `^14.0.0` | App Router, API Routes, Server Components. |
| **Language** | TypeScript | `^5.0.0` | Type safety and modern JavaScript features. |
| **UI Library** | React | `^18.0.0` | Component-based UI. |
| **Styling** | Tailwind CSS | `^3.0.0` | Utility-first CSS for rapid development. |
| **Data Fetching** | SWR | `^2.0.0` | Client-side data fetching, caching, and revalidation. |
| **ORM** | Prisma | `^5.0.0` | Type-safe database access for SQLite & Postgres. |
| **Database (Dev)** | SQLite | `^5.0.0` | Simple, file-based DB for Codespaces. |
| **Database (Prod)**| Vercel Postgres | `^0.5.0` | Managed serverless Postgres for production. |
| **Package Mgr** | pnpm | `^8.0.0` | Fast, disk-space efficient. |
| **Map Provider** | Google Maps API | `v3` | Industry standard for mapping. |

### 2.3. Repository File Structure

The project will follow Next.js App Router conventions.

```
/
├── .devcontainer/   # Codespaces configuration
├── .env.local       # Local environment variables (gitignored)
├── .gitignore
├── next.config.mjs  # Next.js configuration
├── package.json
├── pnpm-lock.yaml
├── prisma/
│   ├── schema.prisma  # Prisma data model
│   └── migrations/    # Database migration history
│   └── dev.db         # (dev only) SQLite database file
├── public/
│   └── assets/        # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── api/         # API Routes
│   │   │   ├── transit/
│   │   │   │   └── route.ts
│   │   │   └── user/
│   │   │       └── route.ts
│   │   ├── (main)/      # Main application pages
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── globals.css
│   ├── components/      # Shared UI components (e.g., MapView.tsx)
│   ├── lib/             # Core logic and utilities
│   │   ├── prisma.ts    # Prisma client instance
│   │   ├── marta.ts     # MARTA API client logic
│   │   └── codespaces.ts# Environment detection logic
│   └── i18n/            # Internationalization files (en.json, es.json)
└── tsconfig.json
```

### 2.4. Development Environment Plan (GitHub Codespaces)

-   **Database**: The `.devcontainer/postCreate.sh` script will run `pnpm prisma migrate dev` to initialize the SQLite database on Codespace creation.
-   **Environment Variables**: A `.env.example` file will be committed. Developers will create a `.env.local` file for their API keys (`GOOGLE_MAPS_API_KEY`, `MARTA_TRAIN_API_KEY`).
-   **MARTA Proxy**: The application logic will automatically detect the Codespaces environment and use a proxy for the MARTA Train API. This is non-negotiable due to port blocking.

---

## 3. Core Systems

### 3.1. Data Model (Prisma Schema)

**File**: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "postgresql" // Vercel Postgres
  url          = env("POSTGRES_PRISMA_URL")
  directUrl    = env("POSTGRES_URL_NON_POOLING")
  // For dev, this will be overridden by a local SQLite provider setup
}

model Event {
  id          String    @id @default(cuid())
  fifaEventId String    @unique
  name        String
  description String
  startTime   DateTime
  venueId     String
  venue       Venue     @relation(fields: [venueId], references: [id])
}

model Venue {
  id        String   @id @default(cuid())
  name      String
  address   String
  latitude  Float
  longitude Float
  events    Event[]
  favorites UserFavorite[]
}

model UserProfile {
  id        String    @id @default(cuid()) // Corresponds to a session ID or device ID
  language  String    @default("en")
  favorites UserFavorite[]
  createdAt DateTime  @default(now())
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

### 3.2. API Routes (Next.js)

#### Get Transit Data
-   **Endpoint**: `GET /api/transit`
-   **Description**: Fetches real-time data from MARTA Bus and Train APIs. Contains Codespaces proxy logic.
-   **Response (200)**:
    ```json
    {
      "buses": [{ "id": "bus1", "lat": 33.7, "lon": -84.3, "route": "1" }],
      "trains": [{ "id": "train1", "lat": 33.8, "lon": -84.4, "line": "RED" }]
    }
    ```

#### Get User Profile & Favorites
-   **Endpoint**: `GET /api/user?userId=<session_id>`
-   **Description**: Retrieves user profile and their favorited venues.
-   **Response (200)**:
    ```json
    {
      "id": "user123",
      "language": "es",
      "favorites": [{ "venueId": "venue_mb_stadium", "name": "Mercedes-Benz Stadium" }]
    }
    ```

### 3.3. UI Pages & Component Hierarchy

-   **Page: `/` (Home Dashboard)**
    -   `MapView.tsx`: Main interactive map component (client-side).
        -   `TransitMarker.tsx`: Component for rendering bus (bus icon) and train (train icon) icons.
        -   `VenueMarker.tsx`: Component for rendering stadium/venue icons (soccer ball).
    -   `EventList.tsx`: A sidebar listing upcoming FIFA matches.
-   **Component: `LanguageSwitcher.tsx`**
    -   Allows users to toggle between 'en' and 'es'.

### 3.4. External Integrations

-   **MARTA Bus API**: `https://gtfs-rt.itsmarta.com/.../vehiclepositions.pb` (Port 443)
-   **MARTA Train API**: `https://developerservices.itsmarta.com:18096/...` (Port 18096, **requires proxy in Codespaces**)
-   **Google Maps API**: For map tiles, traffic layer, and potentially routing.
-   **FIFA Data Source**: A placeholder API or JSON file for match schedules.

---

## 4. Implementation Details

### 4.1. Codespaces Environment Detection

**File**: `src/lib/codespaces.ts`
```typescript
export function isRunningInCodespaces(): boolean {
  return process.env.CODESPACES === 'true' ||
         !!process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
}
```

### 4.2. MARTA Train API Proxy Logic

**File**: `src/lib/marta.ts`
```typescript
import { isRunningInCodespaces } from './codespaces';

const TRAIN_API_URL = `https://developerservices.itsmarta.com:18096/...&apiKey=${process.env.MARTA_TRAIN_API_KEY}`;

export function getTrainApiEndpoint(): string {
  if (isRunningInCodespaces()) {
    // Use a reliable CORS proxy for the demo environment
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(TRAIN_API_URL)}`;
  }
  return TRAIN_API_URL;
}
```

### 4.3. Transit Data Resilience

-   **Parallel Fetch**: The `/api/transit` route will use `Promise.allSettled` to fetch bus and train data simultaneously.
-   **Caching**: The client (`MapView.tsx`) will use `SWR` to fetch from `/api/transit`, providing automatic caching and re-fetching on an interval (e.g., 20 seconds) to create a real-time moving marker experience.
-   **Fallback**: If the MARTA APIs fail, the API route will return empty arrays. The frontend will show a toast notification indicating that live data is unavailable. A `USE_MOCK_MARTA_DATA=true` env var can force mock data for UI development.

### 4.4. Security

-   **API Keys**: All API keys (`GOOGLE_MAPS_API_KEY`, `MARTA_TRAIN_API_KEY`, `POSTGRES_PRISMA_URL`) will be stored in `.env.local` and Vercel environment variables. They will only be accessed server-side within API routes.
-   **Rate Limiting**: Vercel's built-in rate limiting can be applied to API routes to prevent abuse.

---

## 5. Feature Categorization

-   **MVP Features**:
    -   Interactive map with traffic layer.
    -   Real-time MARTA bus and train markers.
    -   Display of FIFA event schedules and venue locations.
    -   Bilingual UI (English/Spanish).
    -   Ability for users to "favorite" venues.
-   **Future Enhancements**:
    -   Point-to-point routing.
    -   Push notifications for event reminders.
    -   AR features for venue navigation.
-   **Known Limitations**:
    -   The MARTA Train API proxy adds latency in Codespaces.
    -   User profiles are tied to a session/device ID, not a full authentication system.

---

## 6. Work Breakdown & Milestones

### Milestone MS-01.01: Project Setup
**Goal**: Initialize the Next.js project with Prisma, dependencies, and environment configuration.
**Duration**: 3 hours

-   **[ ] Task 1**: Initialize Next.js App Router project.
    -   Files: `package.json`, `next.config.mjs`, `tsconfig.json`
    -   Acceptance: `pnpm dev` runs the default app.
-   **[ ] Task 2**: Configure Prisma for SQLite (dev) and Vercel Postgres (prod).
    -   Files: `prisma/schema.prisma`, `.env.example`
    -   Acceptance: `pnpm prisma migrate dev --name init` creates the SQLite DB.
-   **[ ] Task 3**: Set up `.devcontainer` for Codespaces.
    -   Files: `.devcontainer/devcontainer.json`, `.devcontainer/postCreate.sh`
    -   Acceptance: A new Codespace builds successfully and runs the DB migration.

### Milestone MS-01.02: Map Rendering
**Goal**: Display a full-screen Google Map centered on Atlanta with a marker for the main stadium.
**Duration**: 3 hours

-   **[ ] Task 1**: Create the main `MapView` component.
    -   Files: `src/components/MapView.tsx`, `src/app/(main)/page.tsx`
    -   Acceptance: A Google Map renders and fills the screen.
-   **[ ] Task 2**: Add a static marker for Mercedes-Benz Stadium.
    -   Files: `src/components/VenueMarker.tsx`
    -   Acceptance: A custom icon for the stadium appears on the map.

### Milestone MS-01.03: MARTA Transit Overlay
**Goal**: Fetch and display real-time MARTA bus and train data on the map.
**Duration**: 6 hours

-   **[ ] Subtask A**: Integrate MARTA Bus API.
    -   Files: `src/lib/marta.ts`, `src/app/api/transit/route.ts`
    -   Acceptance: The API route fetches and returns parsed bus data.
-   **[ ] Subtask B**: Integrate MARTA Train API with Codespaces proxy.
    -   Files: `src/lib/codespaces.ts`, `src/lib/marta.ts`
    -   Acceptance: The API route returns train data correctly in both local and Codespaces environments.
-   **[ ] Subtask C**: Create real-time map markers.
    -   Files: `src/components/MapView.tsx`, `src/components/TransitMarker.tsx`
    -   Acceptance: The map polls the `/api/transit` endpoint via SWR and displays moving bus/train icons.

### Milestone MS-01.04: Event & Venue Data
**Goal**: Model and display FIFA schedule and venue information.
**Duration**: 4 hours

-   **[ ] Task 1**: Update Prisma schema for Events and Venues.
    -   Files: `prisma/schema.prisma`
    -   Acceptance: `pnpm prisma migrate dev` updates the schema.
-   **[ ] Task 2**: Create a seed script to populate with sample FIFA data.
    -   Files: `prisma/seed.ts`
    -   Acceptance: `pnpm prisma db seed` populates the database with events.
-   **[ ] Task 3**: Display event data in the UI.
    -   Files: `src/app/(main)/page.tsx`
    -   Acceptance: A list of upcoming matches appears next to the map.

### Milestone MS-02.01: Bilingual Support
**Goal**: Implement i18n for English and Spanish.
**Duration**: 4 hours

-   **[ ] Task 1**: Set up Next.js internationalization middleware.
    -   Files: `src/middleware.ts`
    -   Acceptance: The app supports `/en` and `/es` routes.
-   **[ ] Task 2**: Create translation files and a `LanguageSwitcher` component.
    -   Files: `src/i18n/en.json`, `src/i18n/es.json`, `src/components/LanguageSwitcher.tsx`
    -   Acceptance: UI text changes when the language is switched.

### Milestone MS-02.02: User Features
**Goal**: Allow users to favorite venues and save their language preference.
**Duration**: 5 hours

-   **[ ] Task 1**: Update Prisma schema for `UserProfile` and `UserFavorite`.
    -   Files: `prisma/schema.prisma`
    -   Acceptance: `pnpm prisma migrate dev` updates the schema.
-   **[ ] Task 2**: Create API routes for user actions.
    -   Files: `src/app/api/user/route.ts`
    -   Acceptance: API can get/update user preferences and favorites.
-   **[ ] Task 3**: Connect UI to the user API.
    -   Files: `src/components/LanguageSwitcher.tsx`, `src/components/VenueMarker.tsx`
    -   Acceptance: Clicking a "favorite" icon on a venue saves the preference. Language selection is persisted.

### Milestone MS-03.01: Database Integration
**Goal**: Finalize database setup and deploy to Vercel.
**Duration**: 3 hours

-   **[ ] Task 1**: Provision a Vercel Postgres database.
    -   Files: Vercel project settings
    -   Acceptance: Connection strings are available in Vercel environment variables.
-   **[ ] Task 2**: Configure production environment variables.
    -   Files: Vercel project settings
    -   Acceptance: `POSTGRES_PRISMA_URL` and other keys are set for the production branch.
-   **[ ] Task 3**: Deploy to Vercel and run production migrations.
    -   Files: `package.json` (add post-install script for `prisma generate`)
    -   Acceptance: The application successfully deploys and connects to the production database.
