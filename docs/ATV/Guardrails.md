
# Guardrails for Atlanta FIFA Navigator

> Version 1.0 | Status: Active | Date: 2025-10-18

This document outlines the key guardrails, constraints, and validation points for the Atlanta FIFA Navigator project. These rules are designed to ensure performance, reliability, security, and a high-quality user experience. All development, whether by engineers or AI agents, must adhere to these standards.

## 1. Performance & Reliability

Non-functional requirements are critical to user satisfaction and project success.

| Metric | Threshold | Measurement | Notes |
| --- | --- | --- | --- |
| **Server Response Time** | < 2 seconds | Vercel Analytics | Time to first byte (TTFB) for all server-rendered pages. |
| **API Latency** | < 500 ms | Vercel Functions Logs | P95 latency for all internal `/api` routes. |
| **Uptime** | 99.9% | Vercel Status | Monitored via Vercel's built-in reporting. |
| **Crash Rate** | < 2% | Sentry / Vercel Analytics | Percentage of user sessions that end in a crash. |

### Fallback Behavior

- **MARTA API Failure:** If the MARTA API is unavailable or returns an error, the transit layer toggle in the UI will be disabled, and a user-friendly message (e.g., "Transit data is currently unavailable") will be displayed. The application must not crash.
- **Google Maps API Failure:** If the Google Maps JavaScript API fails to load or initialize, the entire map component will be replaced with a clear error message. The rest of the application (e.g., navigation, settings) should remain functional if possible.
- **Geolocation Disabled:** If the user denies location permissions, the map will gracefully default to a fixed location (Mercedes-Benz Stadium) without causing errors.

## 2. Code Quality & Style

Consistency and maintainability are enforced through automated tooling.

- **Package Manager:** All development must use `pnpm`. The `pnpm-lock.yaml` file is the source of truth for dependencies.
- **Linting:** Code must pass linting checks before being committed. Run `pnpm lint` to check for issues.
- **Formatting:** Code is automatically formatted on save using Prettier.
- **TypeScript:** Adhere to strict TypeScript standards. Avoid `any` where possible and leverage modern language features.
- **React Best Practices:** Use functional components with Hooks. Follow established patterns for state management and component composition.

## 3. Security

Security is a primary concern, especially when handling API keys and user data.

- **API Keys:** All third-party API keys (Google Maps, MARTA) **must** be stored as environment variables on Vercel. They are only to be accessed via server-side Next.js API routes. **Under no circumstances should API keys be exposed to the client-side browser.**
- **Input Validation:** All incoming data from API requests and form submissions must be validated using **Zod**. This prevents malformed data and provides a layer of security against injection attacks.
- **Cross-Site Scripting (XSS):** While React's JSX rendering provides default protection, any direct rendering of HTML (e.g., `dangerouslySetInnerHTML`) is forbidden unless explicitly reviewed and approved.
- **Dependencies:** Regularly audit dependencies for known vulnerabilities using `pnpm audit`.

## 4. Accessibility

The application must be usable by everyone, including people with disabilities.

- **WCAG Standard:** The target accessibility standard is **WCAG 2.1 Level AA**.
- **Semantic HTML:** Use semantic HTML5 elements (`<nav>`, `<main>`, `<button>`, etc.) to ensure proper document structure.
- **ARIA Roles:** Use ARIA (Accessible Rich Internet Applications) roles and attributes where necessary, especially for dynamic components provided by Shadcn UI.
- **Keyboard Navigation:** All interactive elements must be focusable and operable via keyboard.
- **Color Contrast:** Ensure text and background colors meet minimum contrast ratios as defined by WCAG.

## 5. Testing

A comprehensive testing strategy ensures stability and allows for confident refactoring.

- **Unit Tests:** All new UI components and utility functions should have corresponding unit tests written with Jest/RTL.
- **Integration Tests:** All API routes (`/api/*`) must have integration tests to verify their behavior and connection to external services.
- **End-to-End (E2E) Tests (Future):** E2E tests will be implemented using Playwright or Cypress to simulate user journeys.

## 6. Version Control & Deployment

- **Branching Strategy:** Follow a GitFlow-like model (e.g., `feature/...`, `fix/...`). All work must be done in feature branches and merged into `main` via Pull Requests.
- **Pull Requests (PRs):** All PRs must be reviewed by at least one other team member before merging. Automated checks (linting, testing, Vercel preview build) must pass.
- **Deployment:** The `main` branch is automatically deployed to production by Vercel.
