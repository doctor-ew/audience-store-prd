
# Technical Specification: Atlanta FIFA Navigator

> Version 1.0 | Status: Draft | Date: 2025-10-18

## 1. Architecture Overview

The Atlanta FIFA Navigator is a Next.js application hosted on Vercel, designed to provide real-time navigation and event information.

### 1.1. Frontend

*   **Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with Shadcn UI components for rapid, accessible development.
*   **State Management:** React Context and `useSWR` for data fetching and caching.
*   **Map Rendering:** Google Maps JavaScript API, loaded asynchronously for performance.

### 1.2. API Layer

*   **Internal API:** Next.js API Routes will serve as a proxy to third-party services to protect API keys and handle data transformation.
*   **External APIs:**
    *   **Google Maps API:** Used for rendering maps, traffic layers, and calculating routes.
    *   **MARTA API:** Used for real-time transit data (bus and train schedules/locations).

### 1.3. Database

*   **Provider:** Firebase (Firestore)
*   **Usage:** Storing user preferences (e.g., favorite teams, language), and potentially caching non-critical API responses.
*   **Local Development:** SQLite with Prisma ORM for local prototyping and testing.

### 1.4. Third-Party Integrations

*   **Hosting:** Vercel for seamless Next.js deployment and CI/CD.
*   **Authentication (Future):** Firebase Authentication for personalized features.

### 1.5. Performance Considerations

*   **Bundle Size:** Aggressively code-split components and lazy-load non-critical assets (e.g., map library, language translations).
*   **Data Fetching:** Use Server-Side Rendering (SSR) or Incremental Static Regeneration (ISR) for key pages to ensure fast initial loads. Client-side data fetching will be handled with `useSWR` for automatic caching and revalidation.
*   **Image Optimization:** Use Next.js Image component to optimize images.

### 1.6. Security Guardrails

*   **API Keys:** All API keys (Google Maps, MARTA) will be stored as environment variables on Vercel and accessed only through server-side API routes. They will **never** be exposed to the client.
*   **Input Validation:** Use Zod for validating all API request payloads and form submissions.
*   **Cross-Site Scripting (XSS):** React's default JSX rendering provides protection. All user-generated content (if any in the future) will be sanitized.

## 2. Dependencies & External Services

*   **`@googlemaps/js-api-loader`**: To load the Google Maps JavaScript API.
*   **`swr`**: For client-side data fetching.
*   **`pnpm`**: Package manager.
*   **`prisma`**: For local database management.
*   **`sqlite3`**: SQLite driver for local development.
*   **`tailwindcss`**: CSS framework.
*   **`shadcn-ui`**: UI component library.
*   **`zod`**: Schema validation.
*   **`i18next` / `react-i18next`**: For internationalization (i18n).

## 3. Data Model

Entities will be simple, primarily reflecting data from external APIs.

```prisma
// schema.prisma - For local development with SQLite

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

// Example model for user preferences
model UserPreference {
  id        String   @id @default(cuid())
  userId    String   @unique // Could be a session ID or Firebase UID
  language  String   @default("en") // 'en' or 'es'
  favorites String[] // List of favorite event IDs or team names
}
```

## 4. API Routes & Endpoints

All internal API routes will be under `/api`.

### 4.1. `/api/traffic`

*   **Method:** `GET`
*   **Description:** Proxies requests to the Google Maps API to fetch traffic data. This is a placeholder, as the traffic layer is a client-side integration, but this endpoint could be used for server-side traffic analysis if needed.
*   **Payload (Response):** GeoJSON traffic data.

### 4.2. `/api/marta`

*   **Method:** `GET`
*   **Description:** Fetches real-time bus and train data from the MARTA API.
*   **Query Params:** `?type=bus|train`
*   **Payload (Response):**
    ```json
    {
      "vehicles": [
        {
          "id": "1234",
          "latitude": 33.75,
          "longitude": -84.4,
          "type": "bus",
          "route": "14th Street"
        }
      ]
    }
    ```

## 5. UI Pages & Components

### 5.1. Pages

*   **`/` (Home):** The main map view.
    *   **States:** Default, Loading, Data Loaded, Error.
    *   **Interactions:** Pan, zoom, click on icons.
*   **`/events`:** List of FIFA matches and other events.
    *   **States:** Loading, List displayed.
*   **`/settings`:** User preferences (language).

### 5.2. Components

*   **`Map`:** The main Google Map component.
    *   **Props:** `center`, `zoom`, `markers`.
    *   **Renders:** The map canvas, traffic layer, and transit icons.
*   **`TransitLayer`:** Toggles MARTA bus/train data on the map.
*   **`LanguageSwitcher`:** A dropdown to switch between English and Spanish.
*   **`EventCard`:** Displays information about a single event.

## 6. Error Handling & Edge Cases

*   **API Key Expiration:** The backend API proxy will catch 401/403 errors from Google/MARTA and return a graceful `503 Service Unavailable` error to the client. The UI will display a "Data currently unavailable" message.
*   **API Latency:** The UI will show loading spinners while data is being fetched. If a request times out, a "Request timed out" message will be shown.
*   **Data Gaps:** If the MARTA API returns no vehicles, the UI will show a "No transit data available" message.
*   **Geolocation Disabled:** If the user denies location permissions, the map will default to Mercedes-Benz Stadium.

## 7. Milestones & Work Breakdown

### Milestone 1: Foundational Setup (MVP)

*   **Goal:** Basic Next.js app with a map centered on the stadium.
*   **Acceptance Criteria:**
    *   [ ] A map is rendered on the homepage.
    *   [ ] The app is deployed to Vercel.
    *   [ ] The Google Maps API key is securely stored.

| Files to Create/Edit | Responsibility |
| --- | --- |
| `package.json` | Setup pnpm, Next.js, TypeScript |
| `app/layout.tsx` | Basic page structure |
| `app/page.tsx` | Homepage component |
| `components/Map.tsx` | Google Map rendering component |
| `.env.local` | Store `GOOGLE_MAPS_API_KEY` |

### Milestone 2: Core Map Rendering & Traffic (MVP)

*   **Goal:** Display the traffic layer on the map.
*   **Acceptance Criteria:**
    *   [ ] A button toggles the traffic layer.
    *   [ ] The traffic layer updates in real-time.

| Files to Create/Edit | Responsibility |
| --- | --- |
| `components/Map.tsx` | Add traffic layer logic |
| `components/TrafficToggle.tsx` | UI button to toggle traffic |

### Milestone 3: Transit Overlay (MVP)

*   **Goal:** Fetch and display MARTA data on the map.
*   **Acceptance Criteria:**
    *   [ ] `/api/marta` endpoint successfully fetches data.
    *   [ ] Bus and train icons are displayed on the map at their real-time locations.

| Files to Create/Edit | Responsibility |
| --- | --- |
| `app/api/marta/route.ts` | Backend proxy for MARTA API |
| `components/Map.tsx` | Fetch data from `/api/marta` and render markers |
| `hooks/useMartaData.ts` | SWR hook for fetching MARTA data |

### Milestone 4: User Experience Polish (Stretch)

*   **Goal:** Add language switching and user preferences.
*   **Acceptance Criteria:**
    *   [ ] UI text can be switched between English and Spanish.
    *   [ ] User language preference is saved (locally for now).

| Files to Create/Edit | Responsibility |
| --- | --- |
| `i18n.js` | i18next configuration |
| `public/locales/en/common.json` | English translations |
| `public/locales/es/common.json` | Spanish translations |
| `components/LanguageSwitcher.tsx` | UI for language selection |
| `store/usePreferences.ts` | Context/hook for user preferences |

### Milestone 5: Database Integration (Future)

*   **Goal:** Persist user preferences in Firebase.
*   **Acceptance Criteria:**
    *   [ ] User preferences are saved to and loaded from Firestore.

| Files to Create/Edit | Responsibility |
| --- | --- |
| `lib/firebase.ts` | Firebase SDK initialization |
| `app/api/preferences/route.ts` | API to save/load preferences |

## 8. Guardrails

*   **Response Times:** All API routes must respond in < 500ms.
*   **Fallback Behavior:** If the MARTA API fails, the transit layer toggle will be disabled and a message will be shown. If the Google Maps API fails, the entire map component will be replaced with an error message.
*   **Code Style:** Adhere to standard TypeScript and React best practices. Run `pnpm lint` before committing.
*   **Testing:** All new components should have basic unit tests. All API routes should have integration tests.
