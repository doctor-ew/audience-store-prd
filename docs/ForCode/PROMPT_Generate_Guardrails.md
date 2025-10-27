# Prompt: Generate Guardrails from PRD

You are a technical architect and security lead establishing guardrails and constraints for a software project.

## Pre-Reading Required

1. `docs/FromProd/PRD.md` – Product requirements and feature goals.
2. `docs/FromProd/WBS.md` – Work breakdown structure and development phases.
3. `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md` – Technical constraints and limitations.

## Context

- **Project**: Atlanta FIFA Navigator - Real-time transit and event navigation app
- **Stack**: Next.js + Vercel + Prisma + GitHub Codespaces
- **Environment**: Development (Codespaces), Production (Vercel)
- **External APIs**: MARTA (bus/train), Google Maps, FIFA data, City of Atlanta data
- **Users**: Public-facing web app for FIFA event attendees

## Your Job

Define technical guardrails, constraints, and non-negotiable requirements that ensure the project stays on track and maintains quality, security, and performance standards.

### Guardrail Categories

Create guardrails for each of the following areas:

#### 1. Architecture & Technology Choices

**What we MUST do:**
- Technology stack limitations (approved: Next.js, Vercel, Prisma)
- Deployment targets (Vercel only, no AWS)
- Development environment (GitHub Codespaces)
- Framework versions and compatibility

**What we MUST NOT do:**
- Technologies explicitly forbidden or out of scope
- Anti-patterns to avoid
- Deprecated approaches

#### 2. Performance & Reliability

**Hard Limits:**
- Page load time: TTFB < 2 seconds
- API response time: < 500ms for transit data
- Map render time: < 3 seconds on 3G
- Uptime target: 99.9%

**Failure Handling:**
- All external API calls must have timeouts
- All external API calls must have fallback/mock data
- No blocking operations in UI thread
- Graceful degradation required for all features

#### 3. Security & Privacy

**Must Have:**
- All API keys server-side only (never in client bundle)
- HTTPS enforced everywhere
- No user data stored without consent
- Input validation on all user inputs
- Rate limiting on public endpoints

**Must Not:**
- Expose internal API structure
- Log sensitive user data
- Store passwords in plain text
- Trust client-side validation alone

#### 4. Data & APIs

**External API Usage:**
- MARTA APIs: Respect rate limits, implement caching
- Google Maps: Monitor quota usage, implement lazy loading
- All APIs: Circuit breaker pattern for failures
- Codespaces: Use proxy for non-standard ports (MARTA Train API)

**Data Handling:**
- Cache transit data for max 30 seconds (stale = inaccurate)
- Never cache user preferences client-side (privacy)
- Always validate external data before display
- Handle missing/malformed API responses gracefully

#### 5. User Experience

**Non-Negotiable:**
- Mobile-first responsive design
- Accessibility: WCAG 2.1 AA compliance minimum
- Loading states for all async operations
- Error messages must be user-friendly (not stack traces)
- Bilingual support (English/Spanish) for all user-facing text

**Performance Budget:**
- Total page weight: < 2MB initial load
- JavaScript bundle: < 300KB gzipped
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

#### 6. Code Quality & Development

**Standards:**
- TypeScript strict mode enabled
- ESLint + Prettier enforced
- No `any` types in production code
- All components must have prop types
- All API routes must have input validation

**Testing Requirements:**
- Unit tests for business logic
- Integration tests for API routes
- Manual testing checklist for UI
- No deployment without passing tests

#### 7. Scope & Feature Flags

**MVP Scope (Must Have):**
- Map display with stadium marker
- Real-time MARTA transit overlay
- Basic event/venue information
- Bilingual UI (English/Spanish)

**Future/Optional (Nice to Have):**
- Push notifications
- AR features
- Advanced routing
- Ticketing integration
- Analytics dashboard

**Out of Scope:**
- Native mobile apps (web only)
- Offline-first functionality
- Real-time chat/messaging
- Payment processing

#### 8. Environment-Specific Constraints

**Codespaces:**
- Must handle port 18096 blocking (MARTA Train API)
- SQLite for development database
- Environment variables via .env files
- No production secrets in Codespaces

**Vercel Production:**
- Vercel Postgres for production database
- Environment variables via Vercel dashboard
- Serverless function limits: 10s timeout, 50MB size
- Edge caching strategy for static assets

### Output Format

```markdown
# Guardrails: Atlanta FIFA Navigator

## 1. Architecture Guardrails

### Technology Stack (APPROVED)
- [List approved technologies with versions]

### Technology Stack (FORBIDDEN)
- [List forbidden technologies with reasons]

### Deployment Constraints
- [Vercel-specific requirements]

## 2. Performance Guardrails

### Hard Limits
| Metric | Target | Measurement |
|--------|--------|-------------|
| TTFB | < 2s | Vercel Analytics |

### Failure Modes
- [How system must behave during failures]

## 3. Security Guardrails
[Continue for each category...]

## 4. Scope Boundaries

### In Scope (MVP)
- [Must-have features]

### Out of Scope
- [Explicitly excluded features]

### Future Considerations
- [Nice-to-have features for later]
```

### Important Constraints

1. Be **specific and measurable** - Use concrete numbers, not vague terms
2. Explain **why** each guardrail exists - Context helps enforcement
3. Make guardrails **testable** - Can verify compliance
4. Include **both positive and negative** - What to do AND what not to do
5. Consider **real-world constraints** - Codespaces, Vercel limits, API quotas

### Success Criteria

Your guardrails are successful if:
- Technical decisions are clear and unambiguous
- Team knows what technologies are approved/forbidden
- Performance targets are quantified and measurable
- Security requirements are explicit and verifiable
- Scope boundaries prevent feature creep
- Development team can self-police compliance
- Stakeholders understand trade-offs and limitations

---

Then produce `docs/guardrails.md` with comprehensive guardrails for the project.
