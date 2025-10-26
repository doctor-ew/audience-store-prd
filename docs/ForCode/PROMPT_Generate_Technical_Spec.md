# Prompt: Generate Technical Specification from PRD

You are a senior tech lead writing a professional software specification for a teaching demo environment.

## Pre-Reading Required
1. `docs/FromProd/PRD.md` – Product requirements and feature goals.
2. `docs/FromProd/WBS.md` – Development phases, AWS service expectations, and MARTA integration tasks.
3. `docs/FromProd/USER_STORY_MAPPING.md` – User stories and journey mapping.
4. `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md` – MARTA connectivity constraints inside Codespaces.

## Context
- **PRD Location**: `docs/FromProd/PRD.md` – Product Requirements Document for "Atlanta FIFA Navigator"
- **WBS Reference**: `docs/FromProd/WBS.md` – Work Breakdown Structure with Phase 3 development tasks
- **Infrastructure Target**: Next.js App Router frontend + AWS Serverless backend (API Gateway, Lambda, DynamoDB, ElastiCache/Redis, SNS, SES, Cognito)
- **Data Feeds**: MARTA (bus/train), FIFA schedule, City of Atlanta open data, partner promotions
- **Key Constraint**: Codespaces blocks non-standard ports (see `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md`)
- **Teaching Context**: Demonstrate end-to-end flow from PRD → Spec → Milestones → Implementation suitable for autonomous coding agents

## Your Job

### 1. Write Technical Specification (`docs/spec.md`)
Translate the PRD into an implementable design document that a delivery team (or code agent) can follow.

**Architecture & Infrastructure**
- End-to-end system architecture describing how the Next.js frontend interacts with AWS API Gateway + Lambda microservices, DynamoDB, Redis, SNS/SES, and Cognito.
- Technology stack table that covers web, backend, data, messaging, and infrastructure tooling with versions and rationale.
- Repository/file structure showing division between `apps/`, `services/`, `infra/`, and shared packages.
- Development environment plan for GitHub Codespaces, including local emulators (DynamoDB Local, Redis), seeding scripts, and testing workflows.

**Core Systems**
- Data model definition for events, venues, transit snapshots, user profiles, itineraries, alert rules, localization bundles (primarily DynamoDB + S3 + Redis).
- Data ingestion pipelines for FIFA schedule, partner content, MARTA bus/train feeds (with Codespaces proxy logic), and optional rideshare ETAs.
- API surface (REST + WebSocket) covering events/venues, transit, personalization, notifications, and partner content. Include request/response shapes or examples.
- UI pages & component hierarchy for home dashboard, events, venues, transit center, alerts center, and profile management.
- External integrations: MARTA APIs, Google Maps (maps + routing), city data, rideshare aggregator, AWS SNS/SES for notifications.

**Implementation Details**
- Environment detection utilities for Codespaces and MARTA proxy selection.
- Transit resilience (parallel fetch, caching, fallback) and geospatial storage strategy.
- Event localization workflow, partner content overrides, and data freshness rules.
- Geofencing, routing, notification delivery, and personalization flows (anonymous sessions + Cognito upgrade).
- Security, privacy, and compliance considerations (GDPR retention, consent logging), plus observability/monitoring strategy.

**Feature Categorization**
- MVP features that satisfy the PRD (event discovery, venue guidance, real-time navigation, bilingual support, favorites/itineraries, geofenced notifications).
- Future enhancements (AR, additional languages, analytics, ticketing) and known limitations or technical debt.

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
1. **MS-01.01**: Platform Foundations
2. **MS-01.02**: Event & Venue Discovery Module
3. **MS-01.03**: Real-Time Navigation & Transit Services
4. **MS-02.01**: Personalized Experience & Favorites
5. **MS-02.02**: Notifications & Alerts
6. **MS-03.01**: Bilingual Support & Accessibility

For each milestone:
- List concrete tasks with file paths and acceptance criteria.
- Include Codespaces, proxy, and AWS infrastructure considerations where relevant.
- Provide a testing checklist (unit, integration, manual) that proves the milestone is complete.

### 3. Output Requirements
- Produce pure Markdown suitable for `docs/spec.md`.
- Use tables for data models and API references; code blocks for file structures and key snippets.
- Use checkboxes for milestone task tracking and testing checklist.
- Reference supporting docs (`TECH_NOTE`, `WBS`, `PRD`) where helpful.
- Level of detail must enable an autonomous agent to implement the system safely.

### 4. Important Constraints
1. Do **not** write production code—focus on the specification.
2. Always account for Codespaces limitations (train API proxy, local emulators).
3. Ensure architecture aligns with AWS services outlined in the WBS.
4. Make opinionated choices explicit and flag areas needing stakeholder decisions.
5. Maintain clear separation between MVP scope and future enhancements.

### 5. Success Criteria
- The spec aligns with PRD objectives and WBS deliverables.
- Architecture covers Next.js frontend and AWS backend integration.
- MARTA integration (bus/train plus Codespaces proxy) and geofenced notifications are fully specified.
- Milestones include verifiable acceptance criteria and testing guidance.
- Security, compliance, and observability practices are documented.
- Developers (or AI agents) can implement each milestone independently.

---

Then produce `docs/spec.md` with the technical specification and milestone breakdown.
