# Acceptance Criteria: Atlanta FIFA Navigator

> **Version**: 2.0 | **Updated**: 2025-10-29 | **Status**: Active

## ⚠️ Phased Implementation

This project uses a two-phase approach. Criteria are marked as:
- **[Phase 1]** - MVP features (no database, static data)
- **[Phase 2]** - Advanced features (database, user profiles)

**Current Focus**: Phase 1 criteria only

This document outlines the acceptance criteria for the Atlanta FIFA Navigator project, ensuring that all features and requirements meet the definition of "done."

## Feature: Map Display and Navigation **[Phase 1]**

### User Story
As a fan, I want to find match schedules and navigate to stadiums easily so that I can get to my event on time.

### Acceptance Criteria

**Given** a user has opened the application
**When** they view the main map interface
**Then** the map should display their current location centered on Atlanta.

- [ ] **Condition**: The user grants location permissions.
- **Result**: The map centers on the user's current GPS location.
- **Acceptance**: A blue dot indicating the user's position is visible and accurate within 50 meters.
- **Traceability**: PRD 3.2, WBS 3.3

- [ ] **Condition**: The user denies location permissions.
- **Result**: The map defaults to a centered view of the Atlanta metropolitan area (e.g., Mercedes-Benz Stadium).
- **Acceptance**: The map is interactive and does not show a user location marker.
- **Traceability**: PRD 3.2, WBS 3.5

- [ ] **Condition**: A user selects a venue and requests directions.
- **Result**: The application displays walking and public transit routes.
- **Acceptance**: The routes are drawn on the map, and turn-by-turn directions are available. Estimated travel times are displayed and are accurate within 15% of actual travel time.
- **Traceability**: PRD 3.2, USER_STORY_MAPPING

## Feature: MARTA Transit Overlay **[Phase 1]**

### User Story
As a tourist, I want to see real-time MARTA train and bus locations so that I can plan my travel effectively.

### Acceptance Criteria

**Given** the user is viewing the main map
**When** they enable the "MARTA Transit" layer
**Then** all MARTA train and bus routes should be displayed on the map.

- [ ] **Condition**: MARTA Bus API (GTFS-RT) is responsive.
- **Result**: Real-time locations of MARTA buses are displayed as icons on the map, updating every 30 seconds.
- **Acceptance**: Bus icons move smoothly along their routes. Clicking a bus icon shows its route name and next major stop.
- **Traceability**: WBS 3.6.1, spec.md 4.3

- [ ] **Condition**: MARTA Train API is responsive.
- **Result**: Real-time locations of MARTA trains are displayed as icons on the map, updating every 30 seconds.
- **Acceptance**: Train icons move along the fixed rail lines. Clicking a train icon shows its line color, destination, and ETA for the next 3 stations.
- **Traceability**: WBS 3.6.2, spec.md 4.3

- [ ] **Condition**: The application is running in a GitHub Codespaces environment.
- **Result**: The app detects the environment and routes the MARTA Train API call (port 18096) through a CORS proxy.
- **Acceptance**: Real-time train data is successfully received and displayed in the Codespace environment without browser CORS errors, as per the logic in `src/lib/marta.ts`.
- **Traceability**: WBS 3.6.3, WBS 3.6.4, spec.md 4.2

- [ ] **Condition**: A MARTA API feed is down or unresponsive.
- **Result**: The application displays a user-friendly message indicating that live data is temporarily unavailable and hides the affected vehicle icons.
- **Acceptance**: The app does not crash. A toast notification appears stating, "Live MARTA data is currently unavailable. Please check back shortly."
- **Traceability**: WBS 3.6.5, spec.md 4.3

## Feature: Event and Venue Discovery **[Phase 1]**

### User Story
As a fan, I want to browse FIFA match schedules and find information about venues.

### Acceptance Criteria

**Given** the user opens the "Events" tab
**When** the event list is loaded
**Then** all upcoming FIFA matches and official fan events should be displayed in chronological order.

- [ ] **Condition**: User views the event list.
- **Result**: A scrollable list of events is displayed, with each item showing the event name, date, time, and venue.
- **Acceptance**: All official FIFA matches for the Atlanta area are present, sourced from static JSON file `src/data/events.json`.
- **Traceability**: PRD 3.1, WBS 3.5, spec.md 3.1

- [ ] **Condition**: User taps on a specific event.
- **Result**: The application navigates to a detailed view of the event.
- **Acceptance**: The detail screen shows an expanded event description, a link to the venue on the map, and options for "Add to Favorites."
- **Traceability**: PRD 3.1, PRD 3.3

- [ ] **Condition**: User taps on a venue from the map or an event detail page.
- **Result**: A venue information screen is displayed.
- **Acceptance**: The screen shows the venue name, address, a photo, and a list of amenities (restrooms, concessions, etc.).
- **Traceability**: PRD 3.1

## Feature: Bilingual Support (English/Spanish) **[Phase 1]**

### User Story
As a tourist, I want bilingual support so that I can use the application in my preferred language.

### Acceptance Criteria

**Given** the user is anywhere in the application
**When** they access the language settings
**Then** they should be able to switch between English and Spanish.

- [ ] **Condition**: User selects "Español" from the `LanguageSwitcher.tsx` component.
- **Result**: The entire UI immediately re-renders in Spanish.
- **Acceptance**: All static UI text (buttons, labels, menus) is translated using data from `src/data/translations/es.json`. The user's language preference is persisted in `localStorage`.
- **Traceability**: PRD 3.4, WBS 3.4, USER_STORY_MAPPING, spec.md 3.3

- [ ] **Condition**: User's device is set to Spanish as the default language.
- **Result**: The application automatically loads in Spanish on the first launch.
- **Acceptance**: The app correctly detects the `Accept-Language` browser header and sets the initial language without user intervention.
- **Traceability**: PRD 3.4

## Technical Requirements **[Phase 1]**

### Performance
- [ ] **Condition**: User loads the application for the first time.
- **Result**: The main map and UI should be interactive in under 3 seconds.
- **Acceptance**: TTFB (Time to First Byte) is less than 2 seconds. Map tiles and initial data load completely within 3 seconds on a standard 4G connection.
- **Traceability**: PRD 6.0, WBS 7.0

- [ ] **Condition**: The application makes an API call to a backend service (e.g., `/api/transit`).
- **Result**: The API response should be received in under 500ms.
- **Acceptance**: P95 latency for all critical API calls is below 500ms under simulated peak load.
- **Traceability**: PRD 6.0, spec.md 4.4

### Codespaces Environment Compatibility
- [ ] **Condition**: A developer runs `pnpm dev` in a new GitHub Codespace.
- **Result**: The application starts successfully without requiring database setup.
- **Acceptance**: All features, including the proxied MARTA Train API, are fully functional within the Codespace environment for development and testing.
- **Traceability**: WBS 3.6.3, spec.md 2.4

### Database **[Phase 2 Only]**
- [ ] **Condition**: The application is deployed to Vercel (production) in Phase 2.
- **Result**: Prisma client connects to the Vercel Postgres database.
- **Acceptance**: The application reads and writes data to the production database successfully. The `POSTGRES_PRISMA_URL` environment variable is correctly used.
- **Traceability**: spec.md 2.1, spec.md 3.1
- **Note**: Not applicable for Phase 1

### Security
- [ ] **Condition**: A developer inspects the client-side code.
- **Result**: No API keys or secrets are exposed.
- **Acceptance**: All sensitive keys are used exclusively in server-side Next.js API routes and are loaded from environment variables.
- **Traceability**: spec.md 4.4

## Nice to Have

### Phase 1
- [ ] **Condition**: User favorites a venue.
- **Result**: The venue is marked as favorite in localStorage and highlighted on the map.
- **Acceptance**: The favorite state is stored in `localStorage` and persists across page refreshes. The venue marker changes appearance to indicate its favorited state.
- **Traceability**: PRD 3.3, spec.md 3.1

### Phase 2 Only
- [ ] **Condition**: User favorites a venue (Phase 2).
- **Result**: The venue is added to the user's profile in the database and highlighted on the map.
- **Acceptance**: A `POST` request to `/api/user` successfully creates a `UserFavorite` record in the database. Favorites sync across devices.
- **Traceability**: PRD 3.3, spec.md 3.1

- [ ] **Condition**: User enables a traffic layer.
- **Result**: A real-time traffic overlay is displayed on the map.
- **Acceptance**: The map shows color-coded lines (green, yellow, red) indicating current traffic conditions, sourced from the Google Maps API.
- **Traceability**: PRD - Mentioned in feature lists but not core MVP.
