# Prompt: Generate Technical Specification from PRD

You are a senior tech lead writing a professional software specification for a teaching demo environment.

## Context
- **PRD Location**: `docs/FromProd/PRD.md` - Product Requirements Document for "Atlanta FIFA Navigator"
- **WBS Reference**: `docs/FromProd/WBS.md` - Work Breakdown Structure with existing task breakdown
- **Environment**: GitHub Codespaces + Next.js App Router + pnpm + Prisma + SQLite
- **Key Constraint**: Codespaces blocks non-standard ports (see `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md`)
- **Teaching Context**: This is a demo app for teaching PRD → WBS → Milestones → Implementation workflow

## Your Job

### 1. Write Technical Specification (`docs/spec.md`)
Translate the PRD into an implementable design document including:

**Architecture & Infrastructure:**
- System architecture overview (Next.js App Router, API routes, data layer)
- Technology stack with specific versions (Next.js, TypeScript, Prisma, etc.)
- File structure following Next.js App Router + `src/` directory convention
- Development environment setup (Codespaces considerations)

**Core Systems:**
- **Data Model**: Prisma schema with relationships, indexes, and migrations
- **API Routes**: RESTful endpoints with request/response shapes
- **UI Pages & Components**: Component hierarchy and page structure
- **External Integrations**:
  - MARTA Bus API (GTFS-RT on port 443)
  - MARTA Train API (port 18096 - requires Codespaces proxy strategy)
  - Google Maps API

**Implementation Details:**
- Environment detection for Codespaces (see existing `TECH_NOTE_Codespaces_API_Testing.md`)
- CORS proxy strategy for non-standard ports
- Error handling patterns (API failures, network timeouts, fallback data)
- Edge cases and concurrency risks
- Performance considerations (caching, rate limiting)
- Security considerations (API key management, input validation)

**Feature Categorization:**
- MVP features (required for initial launch)
- Future features (AI descriptions, advanced analytics, etc.)
- Known limitations and technical debt

### 2. Work Breakdown Structure

Create implementation milestones that align with `docs/FromProd/WBS.md` Phase 3 tasks:

**Milestone Format:**
```markdown
## Milestone X.Y: [Feature Name]
**Goal:** [One sentence description]
**Dependencies:** [Previous milestones or setup tasks]
**Duration:** [Estimated time]

### Tasks
- [ ] Task 1: [Description]
  - Files: `path/to/file.ts`, `path/to/component.tsx`
  - Acceptance: [Specific, testable criteria]

- [ ] Task 2: [Description]
  - Files: `path/to/file.ts`
  - Acceptance: [Specific, testable criteria]

### Testing Checklist
- [ ] Unit tests for [component/function]
- [ ] Integration test for [workflow]
- [ ] Manual test: [specific user flow]
```

**Required Milestones** (align with WBS Task 3.6):
1. **MS-01.01**: Project setup (Next.js, Prisma, dependencies)
2. **MS-01.02**: Map rendering with Google Maps
3. **MS-01.03**: MARTA Transit API integration
   - Subtask A: Bus API (GTFS-RT)
   - Subtask B: Train API with Codespaces detection
   - Subtask C: Map markers and real-time updates
4. **MS-02.01**: UX polish (i18n, accessibility)
5. **MS-03.01**: Database integration (user preferences)

**For Each Milestone:**
- List specific files to create/edit
- Define clear acceptance criteria (testable, observable)
- Note dependencies on previous milestones
- Flag Codespaces-specific considerations
- Include error scenarios and fallback behavior

### 3. Output Requirements

**Format:**
- Pure Markdown suitable for `docs/spec.md`
- Use tables for data models and API specs
- Use code blocks for file structure examples
- Use checkboxes for task tracking

**Level of Detail:**
- Detailed enough for Claude Code to implement autonomously
- Include example code snippets for complex patterns (Codespaces detection, CORS proxy)
- Reference existing docs (TECH_NOTE, WBS) where applicable
- Call out teaching/learning opportunities

**Tone:**
- Professional and implementable (not academic)
- Explicit about edge cases and "gotchas"
- Note where we're making opinionated choices
- Flag areas that might need stakeholder decisions

## Important Constraints

1. **Do NOT write implementation code** - focus on specification only
2. **Do reference existing docs**: WBS.md, TECH_NOTE_Codespaces_API_Testing.md, PRD.md
3. **Do account for Codespaces**: Environment detection, proxy strategy, port restrictions
4. **Do create trackable milestones**: Each should produce working, testable functionality
5. **Do align with teaching workflow**: PRD → Spec → Milestones → Prompts → Code

## Success Criteria

Your spec is successful if:
- A developer can implement each milestone independently
- Each milestone has clear, testable acceptance criteria
- The spec accounts for the Codespaces environment
- MARTA API integration (including port 18096 workaround) is fully specified
- The work breakdown aligns with WBS.md Phase 3
- Error handling and fallback strategies are explicit
- File structure follows Next.js App Router best practices

---

## Pre-Reading Required

**Start by reading**:
1. `docs/FromProd/PRD.md` - Understand product requirements
2. `docs/FromProd/WBS.md` - See existing work breakdown (especially Task 3.6)
3. `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md` - Understand MARTA API constraints

Then produce `docs/spec.md` with the technical specification and milestone breakdown.
