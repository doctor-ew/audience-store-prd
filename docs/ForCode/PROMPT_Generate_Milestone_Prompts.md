# Prompt: Generate Milestone Implementation Prompts

You are a prompt engineering expert creating structured prompts for AI-assisted development.

## Pre-Reading Required

Review every source before drafting prompts. Pull milestone context from each document and keep them open while writing.

1. `docs/FromProd/PRD.md` – Product goals, audience, and business rationale
2. `docs/FromProd/WBS.md` – Work breakdown structure with milestone numbering (M1, M1-01, etc.)
3. `docs/spec.md` – Technical specification with milestone tasks and dependencies
4. `docs/acceptance_criteria.md` – Feature acceptance criteria that must be copied into prompts
5. `docs/guardrails.md` – Technical constraints and non-negotiable requirements
6. `docs/FromProd/prompt_framework.gif` – 8 prompting frameworks (C-R-A-F-T, D-E-C-I-D-E, I-D-E-A, F-O-C-U-S, P-R-O-M-P-T, M-A-P-S, S-P-A-R-K, S-T-A-G-E)

## Context

- **Project**: Atlanta FIFA Navigator
- **Stack**: Next.js + Vercel + Prisma + GitHub Codespaces
- **Goal**: Generate individual prompts for each milestone in the spec
- **Approach**: Use appropriate prompting frameworks for different milestone types
- **Output**: One prompt file per milestone

### Milestone Hierarchy and Learning Focus

- **Milestone (e.g., M1)**: Epic-level outcome covering a major unit in the curriculum.
- **Sub-milestone (e.g., M1-01)**: Story-level deliverable that advances the epic while teaching a specific concept.
- **Sub-sub milestone (e.g., M1-01-A)**: Single-unit, actionable implementation task (setup integration, build component, wire API). Break down work until each sub-sub milestone can be completed in one focused coding session.
- Treat every prompt as both a build plan and a lesson plan—call out what the learner gains, why it matters for the class, and how it connects to earlier milestones.

## Your Job

For each milestone number listed in `docs/FromProd/WBS.md` and detailed in `docs/spec.md`, create a standalone implementation prompt that an AI coding assistant (Claude Code, Cursor, Gemini, Cursor, etc.) can execute autonomously. Every prompt must weave together:

- Product intent and user value captured in `docs/FromProd/PRD.md`
- Structural breakdown and numbering from `docs/FromProd/WBS.md`
- Technical scope and tasks from `docs/spec.md`
- Acceptance details from `docs/acceptance_criteria.md`
- Constraints and non-negotiables from `docs/guardrails.md`

### Framework Selection Guide

Choose the appropriate framework based on milestone type:

**C-R-A-F-T** - Use for creative/UI work
- Map rendering with custom styling
- Component design and layout
- User experience features

**D-E-C-I-D-E** - Use for technical decisions
- Database schema design
- API architecture choices
- Technology selection

**F-O-C-U-S** - Use for problem-solving features
- MARTA API integration with Codespaces proxy
- Error handling and fallback logic
- Performance optimization

**S-P-A-R-K** - Use for step-by-step implementation
- Project setup and configuration
- Database migrations
- Deployment processes

**S-T-A-G-E** - Use for complete features with constraints
- Bilingual i18n implementation
- User authentication
- Complete feature rollout

**I-D-E-A** - Use for brainstorming/exploration
- Alternative approaches to a problem
- Feature enhancement ideas
- Optimization strategies

**P-R-O-M-P-T** - Use for specific output generation
- API route implementation
- Data transformation logic
- Utility function creation

**M-A-P-S** - Use for user-focused features
- User profile management
- Favorites/preferences
- Personalization features

### Milestone Prompt Template

```markdown
# Milestone [X.Y]: [Milestone Name]

## Framework: [Framework Name - e.g., F-O-C-U-S]

### [Framework Component 1]
[Detailed content following the framework structure]

### [Framework Component 2]
[Detailed content following the framework structure]

[Continue for all framework components...]

---

## Learning Outcomes

- Outcome 1: [What the learner gains by completing this milestone]
- Outcome 2: [How it connects to prior/future work]
- Outcome 3: [Why it matters for the class]

---

## Context from Source Docs

**Business Rationale (PRD)**: [Key objective or user value]
**WBS Alignment**: [Milestone → Sub-milestone → Sub-sub milestone references]
**Dependencies**: [List prerequisite milestones]
**Files to Create/Modify**: [List from spec]
**Acceptance Criteria**: [Copy from acceptance_criteria.md]

---

## Guardrails

[Copy relevant guardrails from guardrails.md]
- Technology constraints
- Performance requirements
- Security requirements
- Scope boundaries

---

## Implementation Checklist

From spec.md milestone tasks:
- [ ] Task 1: [Description]
  - Files: [paths]
  - Acceptance: [criteria]
- [ ] Task 2: [Description]
  - Files: [paths]
  - Acceptance: [criteria]

---

## Testing Requirements

- [ ] Unit tests: [What to test]
- [ ] Integration tests: [What to test]
- [ ] Manual verification: [How to verify]

---

## Success Criteria

This milestone is complete when:
1. [Specific, measurable outcome]
2. [Specific, measurable outcome]
3. All tests pass
4. Acceptance criteria are met
```

### Example: MS-01.03-B (MARTA Train API with Codespaces Proxy)

Use **F-O-C-U-S** framework:

```markdown
# Milestone 01.03-B: MARTA Train API Integration with Codespaces Detection

## Framework: F-O-C-U-S

### Frame: Describe the situation or problem

GitHub Codespaces blocks outbound connections to non-standard ports (anything other than 80/443). The MARTA Train API runs on port 18096, which causes connection timeouts in Codespaces. We need environment-aware code that detects Codespaces and automatically routes Train API requests through a CORS proxy (allorigins.win) while using direct connections in local/production environments.

### Objective: Define the main goal

Implement MARTA Train API integration that:
- Detects Codespaces environment automatically
- Routes requests through proxy when in Codespaces
- Uses direct connection in local/production
- Handles timeouts and failures gracefully
- Falls back to mock data when API unavailable

### Constraints: State budget, tech limits

**Technology**:
- Must use Next.js API routes (no external backend)
- Must use environment variables for detection
- Proxy must use standard HTTPS port (443)

**Performance**:
- API timeout: 10 seconds maximum
- Accept 200-500ms additional latency in Codespaces (proxy overhead)
- Cache responses for 30 seconds maximum (real-time data)

**Environment**:
- Codespaces: Port 18096 blocked, must use proxy
- Local: Direct connection preferred
- Production (Vercel): Direct connection required

### Users: Who it's for

- Developers working in GitHub Codespaces
- End users viewing real-time train positions on the map
- QA team testing in different environments

### Steps: Roadmap to achieve it

1. Create environment detection utility
2. Implement Train API fetch with conditional proxy
3. Add timeout and error handling
4. Implement mock data fallback
5. Add console logging for debugging
6. Test in Codespaces, local, and production

---

## Context from Spec

**Dependencies**:
- MS-01.03-A (MARTA Bus API) must be complete
- Environment variables configured (.env)

**Files to Create/Modify**:
- `app/api/marta/route.ts` - Add train API integration
- `lib/utils/environment.ts` - Environment detection utility (optional)

**Acceptance Criteria**:
- In Codespaces: Console shows "CODESPACES DETECTED" and "PROXIED via allOrigins"
- In local/prod: Console shows "DIRECT"
- Train positions display on map in all environments
- API failures fall back to mock data
- Response time < 10 seconds (including timeout)

---

## Guardrails

**Technology Stack**:
- Use fetch API (native)
- No additional dependencies for HTTP requests
- Environment detection via process.env only

**Security**:
- MARTA_TRAIN_API_KEY must be server-side only
- Never expose API key in client bundle
- Proxy URL construction must use encodeURIComponent

**Performance**:
- Timeout after 10 seconds maximum
- Parallel fetch with Bus API (use Promise.all)
- Don't block page render

**Scope**:
- Train API only (Bus API separate)
- Mock data fallback required
- No retry logic (keep simple for demo)

---

## Implementation Checklist

- [ ] Add Codespaces detection logic
  - Files: `app/api/marta/route.ts`
  - Acceptance: Detects CODESPACES and GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN env vars

- [ ] Implement conditional proxy routing
  - Files: `app/api/marta/route.ts`
  - Acceptance: Uses allorigins.win proxy in Codespaces, direct in other envs

- [ ] Add console logging for debugging
  - Files: `app/api/marta/route.ts`
  - Acceptance: Logs "CODESPACES DETECTED" and proxy status

- [ ] Process train API response
  - Files: `app/api/marta/route.ts`
  - Acceptance: Parses JSON, deduplicates by TRAIN_ID, returns TransitVehicle[]

- [ ] Implement mock data fallback
  - Files: `app/api/marta/route.ts`
  - Acceptance: Returns mock data on timeout or error

---

## Testing Requirements

- [ ] Unit tests:
  - Environment detection returns correct boolean
  - Proxy URL constructed correctly with encodeURIComponent

- [ ] Integration tests:
  - API route returns 200 with valid data structure
  - Timeout triggers fallback to mock data

- [ ] Manual verification:
  - Test in Codespaces: Check console logs, verify trains display
  - Test locally: Check console logs, verify direct connection
  - Test with MARTA API down: Verify mock data fallback

---

## Success Criteria

This milestone is complete when:
1. Train positions display on map in Codespaces, local, and production
2. Console logs clearly show environment detection and proxy status
3. API failures gracefully fall back to mock data
4. No API keys exposed in client bundle
5. All acceptance criteria met
6. Code review approved

---

## Reference Documentation

- Technical details: `docs/FromProd/TECH_NOTE_Codespaces_API_Testing.md`
- Working curl examples in TECH_NOTE
- MARTA Train API format: JSON array with TRAIN_ID, LATITUDE, LONGITUDE, LINE
```

### Output Requirements

For each milestone in `docs/spec.md`, create:
- One prompt file: `docs/ForCode/Milestones/MS-[XX.YY]-[Name].md`
- Use appropriate framework from the 8 options
- Include all sections from template
- Make it standalone (AI can execute without rereading supporting docs)
- Reference the PRD, WBS, spec, acceptance criteria, and guardrails everywhere they influence scope
- Highlight learner-facing outcomes and why the work matters for the class
- Break milestones into sub-milestones (M1-01) and sub-sub milestones (M1-01-A, M1-01-B, etc.) until each file drives one actionable implementation unit

### Prompt Generation Strategy

**Align with source documents**:
- Start with `docs/FromProd/PRD.md` to restate the learner-facing objective and success measures.
- Confirm numbering and dependencies in `docs/FromProd/WBS.md` before drafting each prompt.

**Break down large milestones**:
- If a milestone has >5 tasks, consider breaking into subtasks (A, B, C)
- Example: MS-01.03 has subtasks A (Bus API), B (Train API), C (Map Markers)

**Order prompts logically**:
- Respect dependencies (can't do MS-01.03-B before MS-01.03-A)
- Group related features
- Foundation → Features → Polish

**Make prompts executable**:
- Include all necessary context
- Specify exact files to modify
- Provide code examples for complex patterns
- Reference existing code when building on previous milestones
- Call out what the learner should understand or be able to demonstrate after completing the milestone

### Important Constraints

1. One prompt = one milestone (or sub-/sub-sub milestone) from the WBS
2. Explicitly reference the PRD, WBS, spec, acceptance criteria, and guardrails wherever they inform decisions
3. Include acceptance criteria and guardrails in every prompt
4. Make prompts standalone (no "see spec for details")
5. Keep implementation scope focused and achievable
6. Frame outcomes as instructional wins for the learner

### Success Criteria

Your milestone prompts are successful if:
- Each prompt uses an appropriate framework from the 8 options
- Prompts are standalone and executable by an AI assistant
- Dependencies and prerequisites are clear
- Acceptance criteria are specific and testable
- Guardrails prevent scope creep and enforce standards
- A developer can implement the milestone using only the prompt
- The prompt follows the framework structure exactly

---

Generate milestone prompts for all milestones in `docs/spec.md`, saving each as a separate file in `docs/ForCode/Milestones/`.
