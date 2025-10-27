# Guardrails: Atlanta FIFA Navigator

> Version 1.0 | Status: Active | 2025-10-26

This document defines the technical guardrails, constraints, and non-negotiable requirements for the Atlanta FIFA Navigator project. Its purpose is to ensure the project maintains high standards of quality, security, and performance while adhering to the chosen architecture.

---

## 1. Architecture & Technology Choices

### What we MUST do:
-   **Framework**: Use **Next.js (`^14.0.0`)** with the **App Router** for all frontend and backend logic.
-   **Language**: Use **TypeScript (`^5.0.0`)** in `strict` mode.
-   **Database**:
    -   **Development**: Use **Prisma ORM (`^5.0.0`)** with **SQLite**.
    -   **Production**: Use **Prisma ORM (`^5.0.0`)** with **Vercel Postgres**.
-   **Deployment**: All production deployments **must** target **Vercel**.
-   **Development Environment**: The primary development environment **must** be **GitHub Codespaces**.
-   **Styling**: Use **Tailwind CSS (`^3.0.0`)** for all UI styling.
-   **Data Fetching (Client)**: Use **SWR (`^2.0.0`)** for client-side data fetching that requires caching and revalidation (e.g., transit data).

### What we MUST NOT do:
-   **No other Cloud Providers**: Do not introduce any other cloud services (e.g., AWS, Google Cloud, Netlify). The entire stack runs on Vercel.
-   **No separate Backend**: Do not create a separate backend service (e.g., a standalone Express server). All API logic must be implemented as Next.js API Routes.
-   **No other Frameworks**: Do not introduce other frontend frameworks (e.g., Angular, Vue) or backend runtimes (e.g., Deno, Bun).
-   **No `any` type**: The use of the `any` type is forbidden in application code. Use `unknown` for type-safe unknowns.

---

## 2. Performance & Reliability

### Hard Limits
| Metric | Target | Measurement Tool | Why? |
| :--- | :--- | :--- | :--- |
| **TTFB (Time to First Byte)** | `< 1.5s` | Vercel Analytics | Ensures a fast server response for a good initial user experience. |
| **API Response Time** | `< 700ms` | Vercel Logs / Monitoring | Keeps the UI responsive, especially for real-time data like transit. |
| **Largest Contentful Paint (LCP)** | `< 2.5s` | Lighthouse / Vercel Analytics | Core Web Vital for perceived load speed. |
| **Uptime** | `99.9%` | Vercel Status | Standard availability target for a public-facing application. |

### Failure Handling
-   **Timeouts**: All external `fetch` calls (MARTA, FIFA APIs) **must** have a timeout of **10 seconds**.
-   **Fallbacks**: If an external API fails or times out, the system **must** gracefully degrade. For transit data, this means returning an empty dataset and displaying a user-friendly notification. The `USE_MOCK_MARTA_DATA` flag should be available for UI development.
-   **No Blocking UI**: No long-running synchronous operations are permitted on the main browser thread.

---

## 3. Security & Privacy

### Must Have:
-   **Server-Side Keys**: All API keys (`MARTA_TRAIN_API_KEY`, `POSTGRES_PRISMA_URL`) **must** be stored as environment variables and accessed only on the server-side (API Routes, Server Components).
-   **HTTPS**: HTTPS is enforced by Vercel and is non-negotiable.
-   **Input Validation**: All API routes that accept user input (e.g., search queries, user preferences) **must** validate and sanitize the input (e.g., using Zod).
-   **Rate Limiting**: Production API endpoints exposed to the public **must** have rate limiting configured via Vercel's firewall.
-   **No User Data Storage without Consent**: The MVP does not require user accounts, but any future feature that does **must** obtain explicit user consent before storing data.

### Must Not:
-   **No Client-Side Keys**: Do not expose private API keys in the client-side JavaScript bundle. The Google Maps API key is an exception but must be restricted to the production domain via Google Cloud Console.
-   **No Sensitive Logs**: Do not log any personally identifiable information (PII) or sensitive data.
-   **No Trusting the Client**: Server-side validation is mandatory. Do not rely on client-side validation alone for security.

---

## 4. Data & APIs

### External API Usage
-   **MARTA Proxy**: The MARTA Train API (port 18096) **must** be proxied when running in GitHub Codespaces. The `allorigins` proxy is approved for this development-only scenario.
-   **Caching**:
    -   MARTA transit data fetched on the server **must** be cached for a maximum of **30 seconds** to balance freshness and rate-limit avoidance.
    -   Client-side `SWR` should revalidate transit data every **20 seconds**.
-   **Quotas**: Google Maps API usage **must** be monitored to stay within the free tier for this demo project. Use lazy loading for map components where possible.

### Data Handling
-   **Data Validation**: All data from external APIs **must** be validated (e.g., with Zod schemas) before being processed or stored to prevent errors from malformed responses.
-   **Privacy**: User preferences (e.g., language) should be fetched from the database on-demand and not stored in `localStorage` to ensure data is fresh and private.

---

## 5. User Experience

### Non-Negotiable
-   **Mobile-First Design**: All UI components and pages **must** be designed for mobile screens first and then scale up to desktop.
-   **Accessibility**: The application **must** meet **WCAG 2.1 Level AA** compliance. This includes keyboard navigation, screen reader support (ARIA labels), and sufficient color contrast.
-   **Loading States**: Every asynchronous operation (data fetching, form submission) **must** display a loading state (e.g., skeleton loader, spinner).
-   **Bilingual Support**: All user-facing text **must** be available in both English and Spanish.

### Performance Budget
| Metric | Target | Why? |
| :--- | :--- | :--- |
| **Total Page Weight** | `< 2MB` | Ensures fast initial load times on mobile networks. |
| **JS Bundle Size** | `< 300KB (gzipped)` | Reduces script parsing time. |
| **Time to Interactive (TTI)** | `< 3.5s` | Ensures the UI becomes responsive quickly. |

---

## 6. Code Quality & Development

### Standards
-   **Linting & Formatting**: **ESLint** and **Prettier** are enforced. Code **must** pass all linting rules to be merged.
-   **Component Props**: All React components **must** have their props typed using TypeScript interfaces or types.
-   **Directory Structure**: Adhere to the file structure defined in `docs/spec.md`. Core logic in `lib/`, reusable components in `components/`, etc.

### Testing Requirements
-   **Unit Tests**: All utility functions and complex business logic in the `lib/` directory **must** have unit tests (e.g., using Vitest).
-   **Integration Tests**: All API routes **must** have integration tests to verify their behavior, including error states.
-   **CI Checks**: All pull requests **must** pass automated checks (linting, testing, type checking) before being merged.

---

## 7. Scope & Feature Flags

### In Scope (MVP)
-   Interactive map display with stadium markers.
-   Real-time MARTA bus and train overlay.
-   Display of FIFA event schedules and venue information.
-   Bilingual UI (English/Spanish).
-   Ability for users to favorite venues.

### Out of Scope
-   **Native Mobile Apps**: This is a web-only project.
-   **User Authentication**: No user accounts, logins, or passwords.
-   **Offline Functionality**: The application requires an active internet connection.
-   **Payment Processing**: No ticketing or payment features.

### Future Considerations
-   Point-to-point routing directions.
-   Push notifications.
-   AR-based navigation features.

---

## 8. Environment-Specific Constraints

### GitHub Codespaces (Development)
-   **Database**: **Must** use the local `prisma/dev.db` SQLite file.
-   **MARTA API**: **Must** use the proxy solution for the Train API on port 18096.
-   **Environment Variables**: **Must** be loaded from a `.env.local` file. No production secrets are allowed in this file.

### Vercel (Production)
-   **Database**: **Must** connect to the provisioned **Vercel Postgres** database.
-   **Environment Variables**: All secrets and keys **must** be configured in the Vercel project dashboard.
-   **Serverless Limits**: Be aware of Vercel's serverless function limits (e.g., **10-second execution timeout** for Hobby plan). API routes must complete within this time.
