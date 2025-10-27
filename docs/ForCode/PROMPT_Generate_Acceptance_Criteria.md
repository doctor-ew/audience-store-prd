# Prompt: Generate Acceptance Criteria from PRD

You are a QA lead and product owner writing comprehensive acceptance criteria for a software project.

## Pre-Reading Required

1. `docs/FromProd/PRD.md` – Product requirements and feature goals.
2. `docs/FromProd/WBS.md` – Work breakdown structure and development phases.
3. `docs/FromProd/USER_STORY_MAPPING.md` – User stories and journey mapping.

## Context

- **Project**: Atlanta FIFA Navigator - Real-time transit and event navigation app
- **Stack**: Next.js + Vercel + Prisma + GitHub Codespaces
- **Key Features**: MARTA transit overlay, FIFA event discovery, bilingual support, real-time map
- **Users**: FIFA fans, tourists, local residents attending events

## Your Job

Write detailed acceptance criteria that define "done" for each feature in the PRD.

### Format for Each Feature

```markdown
## Feature: [Feature Name]

### User Story
As a [user type], I want to [action] so that [benefit].

### Acceptance Criteria

**Given** [initial context/state]
**When** [action/trigger]
**Then** [expected outcome]

- [ ] **Condition**: [Specific condition to test]
- **Result**: [Expected result]
- **Acceptance**: [How to verify success]
- **Traceability**: [Link to PRD section or WBS task]
```

### Coverage Requirements

Create acceptance criteria for:

1. **Core Features** (from PRD)
   - Map display and navigation
   - MARTA transit overlay (bus and train)
   - Event and venue discovery
   - Bilingual support (English/Spanish)
   - Traffic layer toggle
   - User favorites/preferences

2. **Technical Requirements**
   - Performance (page load, API response times)
   - Codespaces environment compatibility
   - MARTA API integration (including proxy for port 18096)
   - Error handling and fallbacks
   - Mobile responsiveness

3. **User Experience**
   - Loading states and feedback
   - Error messages (user-friendly)
   - Accessibility (keyboard navigation, screen readers)
   - Cross-browser compatibility

4. **Data Quality**
   - Real-time data accuracy
   - Mock data fallback behavior
   - Data refresh rates
   - Cache invalidation

### Acceptance Criteria Guidelines

For each criterion:
- Make it **testable** - Can be verified through manual or automated testing
- Make it **specific** - Clear pass/fail conditions
- Make it **measurable** - Include concrete metrics where applicable (e.g., "< 2 seconds")
- Make it **user-focused** - Written from user perspective
- Include **edge cases** - What happens when things go wrong?
- Include **performance targets** - Speed, reliability, scalability expectations

### Non-Functional Requirements

Include acceptance criteria for:
- **Security**: API keys not exposed, HTTPS enforced
- **Performance**: TTFB < 2s, map render < 3s, API calls < 500ms
- **Reliability**: Graceful degradation, error recovery, offline behavior
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Compatibility**: Chrome, Safari, Firefox, Edge (latest 2 versions), mobile browsers

### Output Format

- Pure Markdown suitable for `docs/acceptance_criteria.md`
- Use checkboxes for trackable criteria
- Group by feature area (Map, Transit, Events, UX, etc.)
- Include traceability links to PRD and WBS
- Add "Nice to Have" section for stretch goals

### Important Constraints

1. Focus on **what** should work, not **how** to implement it
2. Write from **user perspective**, not developer perspective
3. Be **specific and measurable** - avoid vague terms like "fast" or "good"
4. Include **both positive and negative test cases**
5. Consider **Codespaces environment** - some features may behave differently

### Success Criteria

Your acceptance criteria are successful if:
- Every feature in the PRD has corresponding acceptance criteria
- Each criterion is testable (can verify pass/fail)
- Performance and quality metrics are quantified
- Edge cases and error scenarios are covered
- A QA team could use this to write test plans
- Stakeholders can understand what "done" means for each feature

---

Then produce `docs/acceptance_criteria.md` with comprehensive acceptance criteria for all features.
