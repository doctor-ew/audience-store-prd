# ATV PRD

## Creating SPEC


** SPEC → S-T-A-G-E (Setup, Target, Actions,  Evaluation)
** Guardrails → F-O-C-U-S (Frame, Objective, Constraints, Users, Steps)
** Acceptance Criteria → C-R-A-F-T

** Milestones from Spec & AC → D-E-C-I-D-E (Define, Explore, Compare, Interpret, Decide, Execute)



https://doctorew.com/shuttlebay/YC/Screen-Capture-2025-10-18-14-32-35.png

https://doctorew.com/shuttlebay/YC/Screen-Capture-2025-10-18-14-34-02.png



Why Prisma (+ SQLite) for this project
Deterministic, check-in-able schema: schema.prisma and migrations live in Git; every dev/agent spins up the exact same DB with pnpm prisma migrate dev. No console clicks, no drift.
Ephemeral & fast: SQLite works anywhere (Vercel preview, Codespaces, CI) with zero infra. Perfect for a maps/transit demo where we mostly cache API results rather than own complex data.


* Google API: AIzaSyBJXjNpV27u5kRWc_6SvbPt5kc0sTFsMQ0
* MARTA API: 87f1b834-e983-4b3f-8d4e-533fb9fc758e
* Latitude/Longitude of Mercedes-Benz Stadium: `33.754542, -84.402492`


###  

# SPEC Prompt for Gemini (S-T-A-G-E Style – Info-Dense & Ready to Run)

**Setup:**
You are a senior tech lead writing a professional software specification. We are building **Atlanta FIFA Navigator**, a Next.js web application hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. We will use the **Google Maps API** and **MARTA API** (``) for real-time transit data and traffic visualization.

* Latitude/Longitude of Mercedes-Benz Stadium: `33.754542, -84.402492`
* Frontend: Next.js (App Router)
* Hosting: Vercel
* Database: Firebase (for any stateful storage needs)
* Sample traffic layer reference: [Google Maps Sample](https://github.com/googlemaps/js-samples/tree/sample-layer-traffic)

---

**Target:**
Generate a complete `spec.md` that translates the provided PRD (`docs/PRD.md`) and WBS (`docs/WBS.md`) into a detailed technical plan.

---

**Actions (What to produce):**

1. **Architecture Overview**

   * Frontend, API layer, database, and third-party integrations.
   * Explain how the Google Maps and MARTA APIs will be used.
   * Call out performance considerations and security guardrails.

2. **Dependencies & External Services**

   * List all external libraries, SDKs, and APIs required.

3. **Data Model**

   * Show key entities (e.g., routes, stops, events) and their relationships.

4. **API Routes & Endpoints**

   * Define all internal and external API endpoints and their expected payloads.

5. **UI Pages & Components**

   * List all major pages/components, their states, and interactions.

6. **Error Handling & Edge Cases**

   * Identify likely failure points (e.g., API latency, data gaps, expired keys) and how they’ll be handled.

7. **Milestones & Work Breakdown**

   * Use the WBS to create milestone-driven development phases.
   * For each milestone, list files to create/edit, responsibilities, and acceptance criteria in checklist format.

8. **Guardrails**

   * Define constraints and validation points (e.g., response times <500ms, fallback behavior if APIs fail).

---

**Guardrails:**

* Must output clean Markdown suitable for `docs/spec.md`.
* Assume `pnpm`, `Prisma`, and `SQLite` for local development.
* Organize milestones from foundational setup → core map rendering → transit overlay → user experience polish.
* Explicitly note what is **MVP**, what is **stretch**, and what is **future**.

---

**Evaluation (Success Criteria):**

* Can this spec be handed to Claude Code or Serena MCP to implement feature-by-feature?
* Does it cover architecture, edge cases, and acceptance criteria clearly enough to guide autonomous agent work?

---

💡 **Bonus tip for the workshop:**
Have participants *start with this exact S-T-A-G-E prompt*, then iterate by swapping sections (“Milestones only,” “Data model only,” etc.) to teach modular prompting.


###


# Prompt for Gemini (F-O-C-U-S Style — Guardrails)
 You are a senior tech lead writing docs/guardrails.md for Atlanta FIFA Navigator (Next.js on Vercel with Google Maps + MARTA; Firebase for stateful storage; bilingual EN/ES). Generate guardrails derived from the PRD and the technical spec so engineers and AI agents make the same decisions a senior architect would. Use docs/PRD.md and docs/spec.md as sources. 
PRD
TECH_SPEC
Objective Produce a comprehensive, enforceable guardrails document that encodes non-negotiables across:
	•	Security (secrets, API key handling, input validation, XSS/CSRF, server/client boundaries)
	•	Performance (budgets, caching, SSR/ISR strategy, image & bundle constraints)
	•	Compliance & Accessibility (GDPR/data handling, WCAG 2.1 AA, uptime/availability targets)
	•	Architecture & Code Quality (directory conventions, typing, testing, CI/CD, linting)
	•	Failure & Fallbacks (3P outages, expired keys, timeouts, geolocation denial, empty datasets)
Each rule must be written as “Must…” / “Must not…”, with a brief rationale and a validation method (lint rule, unit/integration test, CI check, runtime monitor).
Constraints
	•	Respect PRD NFRs: sub-2s core UX, WCAG 2.1 AA, 99.9% availability, GDPR-aligned data handling. PRD 
	•	Respect spec decisions: server-side key custody via env vars on Vercel, Zod input validation, SSR/ISR + SWR, API proxy for third-party calls, API routes target <500 ms. TECH_SPEC 
	•	Bilingual UX (EN/ES) must not be degraded by guardrails; i18n pipelines and content loading must remain within budgets. PRD 
Users Engineers, QA, platform owners, and AI code-gen agents (e.g., Claude Code, Serena MCP). The output should double as a code-review and CI checklist.
Steps
	1	Sectioned Output: Create headings for Security, Performance, Compliance & Accessibility, Architecture & Code Quality, Failure & Fallbacks.
	2	Rule Format: Under each, emit checkbox items:
	◦	Rule: “Must/Must not …”
	◦	Rationale: one sentence
	◦	Validation: tool/test/monitor that proves compliance
	3	Budgets & Thresholds: Encode numeric targets explicitly (e.g., API routes <500 ms, core flows <2 s TTI, map page ≤ X KB critical CSS/JS, image optimization requirements). TECH_SPEC PRD 
	4	Enforcement Map: Add a table mapping rule → enforcement (ESLint/TypeScript, Vitest/Playwright, CI job, Vercel protection, monitoring alert).
	5	Failure Playbooks: Define observable failure modes (e.g., MARTA 5xx, Maps quota, geolocation denied) and the graceful behavior and status codes/UI states to use. TECH_SPEC 
	6	Traceability: For each section, include a short line “Ties to PRD/Spec:” citing the relevant requirement(s).


---

Bonus tip for the workshop:
Have participants start with this exact F-O-C-U-S prompt, then iterate by narrowing scope — e.g., “Security guardrails only” or “Fallback behavior only.” This teaches modular prompting and helps them see how large prompt structures can be split into reusable sub-templates.


###
ž
---

### Prompt for Gemini (C-R-A-F-T Style — Acceptance Criteria)

**Context:**
You are acting as a **QA engineer** writing `docs/acceptance_criteria.md` for the **Atlanta FIFA Navigator** project — a Next.js app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during FIFA events. The application uses the **Google Maps API** and **MARTA API** for real-time traffic and transit visualization and **Firebase** for stateful storage.

Your task is to derive detailed **acceptance criteria** directly from the PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**Role:**
Act as a **QA agent** responsible for verifying whether each feature meets the requirements defined in the PRD and Spec. Each acceptance criterion must be **clear, atomic, measurable, and testable** — usable in automated tests, manual QA scripts, or CI checks.

---

**Actions:**
Apply the **C-R-A-F-T** model to produce the output:

1. **C – Conditions:** Describe the preconditions or setup required for the feature (e.g., “Given a user with location services enabled…”).
2. **R – Results:** Define the expected outcomes or behaviors that must occur (“…then the map centers on Mercedes-Benz Stadium within 2s”).
3. **A – Acceptance:** State the specific pass/fail criteria for the test (binary success conditions).
4. **F – Functional & Non-Functional:** Include both kinds of criteria — feature-specific behaviors and broader constraints (performance budgets, compliance requirements, etc.).
5. **T – Traceability:** Link each criterion back to the PRD section, user story, or spec element it validates.

---

**Constraints:**

* All criteria must align with PRD success metrics: **100K+ users**, **<2% crash rate**, **90%+ usability**, **50% bilingual feature usage**.
* Reflect non-functional requirements: **<2s response**, **<500 ms API latency**, **WCAG 2.1 AA compliance**, **99.9% uptime**, and **GDPR-aligned data handling**.
* Cover all major feature areas:

  * Event & Venue Discovery
  * Real-Time Navigation & Transit
  * Personalization
  * Bilingual Support
  * Security & Performance
  * Compliance & Accessibility

---

**Format:**

* Output as a **Markdown checklist** grouped by feature category.
* Each item must include **Condition → Result → Acceptance**, and where relevant, **Traceability**.
* Include both **functional** (UI, API, user interaction) and **non-functional** (performance, accessibility, availability) criteria.

---

**Evaluation (Success Criteria):**

* Can this document serve as the “definition of done” for QA and engineering teams?
* Would an AI code agent or junior engineer know **exactly** when a feature is ready for production based on these criteria?
* Are all criteria binary, measurable, and directly linked back to the PRD/spec?

💡 **Bonus tip for the workshop:**
After generating the full AC set, have participants *narrow scope by feature* (e.g., “Transit Overlay only” or “Language switching only”) to teach **granular prompting** and modular QA thinking.

---

Would you like me to jump into the **Milestones prompt** now, or pause and tighten this one more first?
Oh yes — **CRAFT** is actually *perfect* for Acceptance Criteria because it mirrors how a QA engineer or test automation agent thinks. If FOCUS is about “what must be true,” CRAFT is about “how we’ll prove it’s true.” Here’s how that looks 👇

---

### Prompt for Gemini (C-R-A-F-T Style — Acceptance Criteria)

**Context:**
You are acting as a **QA engineer** writing `docs/acceptance_criteria.md` for the **Atlanta FIFA Navigator** project — a Next.js app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during FIFA events. The application uses the **Google Maps API** and **MARTA API** for real-time traffic and transit visualization and **Firebase** for stateful storage.

Your task is to derive detailed **acceptance criteria** directly from the PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**Role:**
Act as a **QA agent** responsible for verifying whether each feature meets the requirements defined in the PRD and Spec. Each acceptance criterion must be **clear, atomic, measurable, and testable** — usable in automated tests, manual QA scripts, or CI checks.

---

**Actions:**
Apply the **C-R-A-F-T** model to produce the output:

1. **C – Conditions:** Describe the preconditions or setup required for the feature (e.g., “Given a user with location services enabled…”).
2. **R – Results:** Define the expected outcomes or behaviors that must occur (“…then the map centers on Mercedes-Benz Stadium within 2s”).
3. **A – Acceptance:** State the specific pass/fail criteria for the test (binary success conditions).
4. **F – Functional & Non-Functional:** Include both kinds of criteria — feature-specific behaviors and broader constraints (performance budgets, compliance requirements, etc.).
5. **T – Traceability:** Link each criterion back to the PRD section, user story, or spec element it validates.

---

**Constraints:**

* All criteria must align with PRD success metrics: **100K+ users**, **<2% crash rate**, **90%+ usability**, **50% bilingual feature usage**.
* Reflect non-functional requirements: **<2s response**, **<500 ms API latency**, **WCAG 2.1 AA compliance**, **99.9% uptime**, and **GDPR-aligned data handling**.
* Cover all major feature areas:

  * Event & Venue Discovery
  * Real-Time Navigation & Transit
  * Personalization
  * Bilingual Support
  * Security & Performance
  * Compliance & Accessibility

---

**Format:**

* Output as a **Markdown checklist** grouped by feature category.
* Each item must include **Condition → Result → Acceptance**, and where relevant, **Traceability**.
* Include both **functional** (UI, API, user interaction) and **non-functional** (performance, accessibility, availability) criteria.

---

**Evaluation (Success Criteria):**

* Can this document serve as the “definition of done” for QA and engineering teams?
* Would an AI code agent or junior engineer know **exactly** when a feature is ready for production based on these criteria?
* Are all criteria binary, measurable, and directly linked back to the PRD/spec?

💡 **Bonus tip for the workshop:**
After generating the full AC set, have participants *narrow scope by feature* (e.g., “Transit Overlay only” or “Language switching only”) to teach **granular prompting** and modular QA thinking.

---

Would you like me to jump into the **Milestones prompt** now, or pause and tighten this one more first?
Oh yes — **CRAFT** is actually *perfect* for Acceptance Criteria because it mirrors how a QA engineer or test automation agent thinks. If FOCUS is about “what must be true,” CRAFT is about “how we’ll prove it’s true.” Here’s how that looks 👇

---

### Prompt for Gemini (C-R-A-F-T Style — Acceptance Criteria)

**Context:**
You are acting as a **QA engineer** writing `docs/acceptance_criteria.md` for the **Atlanta FIFA Navigator** project — a Next.js app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during FIFA events. The application uses the **Google Maps API** and **MARTA API** for real-time traffic and transit visualization and **Firebase** for stateful storage.

Your task is to derive detailed **acceptance criteria** directly from the PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**Role:**
Act as a **QA agent** responsible for verifying whether each feature meets the requirements defined in the PRD and Spec. Each acceptance criterion must be **clear, atomic, measurable, and testable** — usable in automated tests, manual QA scripts, or CI checks.

---

**Actions:**
Apply the **C-R-A-F-T** model to produce the output:

1. **C – Conditions:** Describe the preconditions or setup required for the feature (e.g., “Given a user with location services enabled…”).
2. **R – Results:** Define the expected outcomes or behaviors that must occur (“…then the map centers on Mercedes-Benz Stadium within 2s”).
3. **A – Acceptance:** State the specific pass/fail criteria for the test (binary success conditions).
4. **F – Functional & Non-Functional:** Include both kinds of criteria — feature-specific behaviors and broader constraints (performance budgets, compliance requirements, etc.).
5. **T – Traceability:** Link each criterion back to the PRD section, user story, or spec element it validates.

---

**Format:**

* Output as a **Markdown checklist** grouped by feature category.
* Each item must include **Condition → Result → Acceptance**, and where relevant, **Traceability**.
* Include both **functional** (UI, API, user interaction) and **non-functional** (performance, accessibility, availability) criteria.

---

**constrainTs:**

* All criteria must align with PRD success metrics: **100K+ users**, **<2% crash rate**, **90%+ usability**, **50% bilingual feature usage**.
* Reflect non-functional requirements: **<2s response**, **<500 ms API latency**, **WCAG 2.1 AA compliance**, **99.9% uptime**, and **GDPR-aligned data handling**.
* Cover all major feature areas:

  * Event & Venue Discovery
  * Real-Time Navigation & Transit
  * Personalization
  * Bilingual Support
  * Security & Performance
  * Compliance & Accessibility

---

**Evaluation (Success Criteria):**

* Can this document serve as the “definition of done” for QA and engineering teams?
* Would an AI code agent or junior engineer know **exactly** when a feature is ready for production based on these criteria?
* Are all criteria binary, measurable, and directly linked back to the PRD/spec?

💡 **Bonus tip for the workshop:**
After generating the full AC set, have participants *narrow scope by feature* (e.g., “Transit Overlay only” or “Language switching only”) to teach **granular prompting** and modular QA thinking.


###

# Prompt for Gemini (D-E-C-I-D-E Style — Milestones & Work Breakdown)

---

**(D) Define – The Mission & Context**
You are a senior tech lead defining the **engineering milestones and work breakdown** for **Atlanta FIFA Navigator**, a Next.js web app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The application uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

We are now generating `docs/milestones.md` based on the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**(E) Explore – What Needs to Be Delivered**
Break the project into clear, actionable **milestones** that capture the journey from MVP to stretch goals.
For each milestone, capture:

* Name, purpose, and goal
* Key features delivered
* Files/modules likely to be created or edited
* Dependencies and sequencing considerations
* Associated acceptance criteria
* Whether it is **MVP**, **Stretch**, or **Future**

Also explore risks, external dependencies (e.g., third-party APIs), and logical sequencing trade-offs.

---

**(C) Compare – Prioritize and Sequence**
Weigh different ways the work could be phased and choose the most logical path based on:

* Reducing technical risk early
* Delivering user value incrementally
* Respecting architectural prerequisites
* Aligning with PRD milestone dates (Prototype → Beta → Final)

Justify why this sequencing is optimal for this project.

---

**(I) Interpret – Tie to Requirements & Metrics**
Map each milestone to:

* Specific **PRD objectives** and **success metrics** (e.g., 100K users, 90% satisfaction, <2% crash rate)
* **Technical constraints** from the spec (e.g., API routes <500 ms, SSR/ISR strategy, server-side key handling)
* Relevant **acceptance criteria** from `docs/acceptance_criteria.md`

This ensures every milestone builds toward the project’s stated outcomes.

---

**(D) Decide – Finalize the Roadmap**
Commit to the milestone plan that best satisfies the above and output it in **Markdown** as:

* A high-level table of milestones with scope, timeline, and status (MVP/Stretch/Future)
* Detailed breakdown for each milestone (features, tasks, files, dependencies, AC links)

Each milestone should represent a *testable, working slice* of functionality, ready for QA and deployment.

---

**(E) Execute – Output & Deliverables**

* Output must be clean Markdown suitable for `docs/milestones.md`.
* Use consistent formatting and checklist syntax.
* Clearly label each milestone’s scope and deliverables.
* Include “Stretch” and “Future” milestones as optional next phases.

---

**Evaluation (Success Criteria):**

* Could this milestone plan be dropped directly into GitHub Projects or Jira and used as a delivery roadmap?
* Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
* Is the sequencing justified and aligned with maximum value delivery and risk reduction?

💡 **Bonus tip for the workshop:**
Once the full milestone roadmap is generated, have participants regenerate only a single phase (e.g., **Milestone 3: Transit Overlay**) to practice *scoped prompting*. It reinforces how large prompts can be modularized without losing fidelity.

---

Would you like me to do the same treatment (explicit headings) for the **Guardrails** or **Acceptance Criteria** prompts too? (It makes them way more “teachable” in a seminar deck.)
Oh absolutely — and honestly, doing that is a killer move for your workshop. It makes the structure *explicit* and teaches participants how to use frameworks as **prompt scaffolds** instead of just buzzwords.

Here’s that same **Milestones prompt**, rewritten with **D-E-C-I-D-E** as the top-level headings:

---

### 

# MILESTONES Prompt for Gemini (D-E-C-I-D-E Style — Milestones & Work Breakdown)

---

**(D) Define – The Mission & Context**
You are a senior tech lead defining the **engineering milestones and work breakdown** for **Atlanta FIFA Navigator**, a Next.js web app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The application uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

We are now generating `docs/milestones.md` based on the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**(E) Explore – What Needs to Be Delivered**
Break the project into clear, actionable **milestones** that capture the journey from MVP to stretch goals.
For each milestone, capture:

* Name, purpose, and goal
* Key features delivered
* Files/modules likely to be created or edited
* Dependencies and sequencing considerations
* Associated acceptance criteria
* Whether it is **MVP**, **Stretch**, or **Future**

Also explore risks, external dependencies (e.g., third-party APIs), and logical sequencing trade-offs.

---

**(C) Compare – Prioritize and Sequence**
Weigh different ways the work could be phased and choose the most logical path based on:

* Reducing technical risk early
* Delivering user value incrementally
* Respecting architectural prerequisites
* Aligning with PRD milestone dates (Prototype → Beta → Final)

Justify why this sequencing is optimal for this project.

---

**(I) Interpret – Tie to Requirements & Metrics**
Map each milestone to:

* Specific **PRD objectives** and **success metrics** (e.g., 100K users, 90% satisfaction, <2% crash rate)
* **Technical constraints** from the spec (e.g., API routes <500 ms, SSR/ISR strategy, server-side key handling)
* Relevant **acceptance criteria** from `docs/acceptance_criteria.md`

This ensures every milestone builds toward the project’s stated outcomes.

---

**(D) Decide – Finalize the Roadmap**
Commit to the milestone plan that best satisfies the above and output it in **Markdown** as:

* A high-level table of milestones with scope, timeline, and status (MVP/Stretch/Future)
* Detailed breakdown for each milestone (features, tasks, files, dependencies, AC links)

Each milestone should represent a *testable, working slice* of functionality, ready for QA and deployment.

---

**(E) Execute – Output & Deliverables**

* Output must be clean Markdown suitable for `docs/milestones.md`.
* Use consistent formatting and checklist syntax.
* Clearly label each milestone’s scope and deliverables.
* Include “Stretch” and “Future” milestones as optional next phases.

---

**Evaluation (Success Criteria):**

* Could this milestone plan be dropped directly into GitHub Projects or Jira and used as a delivery roadmap?
* Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
* Is the sequencing justified and aligned with maximum value delivery and risk reduction?

💡 **Bonus tip for the workshop:**
Once the full milestone roadmap is generated, have participants regenerate only a single phase (e.g., **Milestone 3: Transit Overlay**) to practice *scoped prompting*. It reinforces how large prompts can be modularized without losing fidelity.


### Prompt for Gemini (D-E-C-I-D-E Style — Milestones & Work Breakdown)

---

**(D) Define – The Mission & Context**
You are a senior tech lead defining the **engineering milestones and work breakdown** for **Atlanta FIFA Navigator**, a Next.js web app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The application uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

We are now generating `docs/milestones.md` based on the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**(E) Explore – What Needs to Be Delivered**
Break the project into clear, actionable **milestones** that capture the journey from MVP to stretch goals.
For each milestone, capture:

* Name, purpose, and goal
* Key features delivered
* Files/modules likely to be created or edited
* Dependencies and sequencing considerations
* Associated acceptance criteria
* Whether it is **MVP**, **Stretch**, or **Future**

Also explore risks, external dependencies (e.g., third-party APIs), and logical sequencing trade-offs.

---

**(C) Compare – Prioritize and Sequence**
Weigh different ways the work could be phased and choose the most logical path based on:

* Reducing technical risk early
* Delivering user value incrementally
* Respecting architectural prerequisites
* Aligning with PRD milestone dates (Prototype → Beta → Final)

Justify why this sequencing is optimal for this project.

---

**(I) Interpret – Tie to Requirements & Metrics**
Map each milestone to:

* Specific **PRD objectives** and **success metrics** (e.g., 100K users, 90% satisfaction, <2% crash rate)
* **Technical constraints** from the spec (e.g., API routes <500 ms, SSR/ISR strategy, server-side key handling)
* Relevant **acceptance criteria** from `docs/acceptance_criteria.md`

This ensures every milestone builds toward the project’s stated outcomes.

---

**(D) Decide – Finalize the Roadmap**
Commit to the milestone plan that best satisfies the above and output it in **Markdown** as:

* A high-level table of milestones with scope, timeline, and status (MVP/Stretch/Future)
* Detailed breakdown for each milestone (features, tasks, files, dependencies, AC links)

Each milestone should represent a *testable, working slice* of functionality, ready for QA and deployment.

---

**(E) Execute – Output & Deliverables**

* Output must be clean Markdown suitable for `docs/milestones.md`.
* Use consistent formatting and checklist syntax.
* Clearly label each milestone’s scope and deliverables.
* Include “Stretch” and “Future” milestones as optional next phases.

---

**Evaluation (Success Criteria):**

* Could this milestone plan be dropped directly into GitHub Projects or Jira and used as a delivery roadmap?
* Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
* Is the sequencing justified and aligned with maximum value delivery and risk reduction?

💡 **Bonus tip for the workshop:**
Once the full milestone roadmap is generated, have participants regenerate only a single phase (e.g., **Milestone 3: Transit Overlay**) to practice *scoped prompting*. It reinforces how large prompts can be modularized without losing fidelity.

---

Would you like me to do the same treatment (explicit headings) for the **Guardrails** or **Acceptance Criteria** prompts too? (It makes them way more “teachable” in a seminar deck.)
Oh absolutely — and honestly, doing that is a killer move for your workshop. It makes the structure *explicit* and teaches participants how to use frameworks as **prompt scaffolds** instead of just buzzwords.

Here’s that same **Milestones prompt**, rewritten with **D-E-C-I-D-E** as the top-level headings:

---

### 

# MILESTONES Prompt for Gemini (D-E-C-I-D-E Style — Milestones & Work Breakdown)

---

**(D) Define – The Mission & Context**
You are a senior tech lead defining the **engineering milestones and work breakdown** for **Atlanta FIFA Navigator**, a Next.js web app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The application uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

We are now generating `docs/milestones.md` based on the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

**(E) Explore – What Needs to Be Delivered**
Break the project into clear, actionable **milestones** that capture the journey from MVP to stretch goals.
For each milestone, capture:

* Name, purpose, and goal
* Key features delivered
* Files/modules likely to be created or edited
* Dependencies and sequencing considerations
* Associated acceptance criteria
* Whether it is **MVP**, **Stretch**, or **Future**

Also explore risks, external dependencies (e.g., third-party APIs), and logical sequencing trade-offs.

---

**(C) Compare – Prioritize and Sequence**
Weigh different ways the work could be phased and choose the most logical path based on:

* Reducing technical risk early
* Delivering user value incrementally
* Respecting architectural prerequisites
* Aligning with PRD milestone dates (Prototype → Beta → Final)

Justify why this sequencing is optimal for this project.

---

**(I) Interpret – Tie to Requirements & Metrics**
Map each milestone to:

* Specific **PRD objectives** and **success metrics** (e.g., 100K users, 90% satisfaction, <2% crash rate)
* **Technical constraints** from the spec (e.g., API routes <500 ms, SSR/ISR strategy, server-side key handling)
* Relevant **acceptance criteria** from `docs/acceptance_criteria.md`

This ensures every milestone builds toward the project’s stated outcomes.

---

**(D) Decide – Finalize the Roadmap**
Commit to the milestone plan that best satisfies the above and output it in **Markdown** as:

* A high-level table of milestones with scope, timeline, and status (MVP/Stretch/Future)
* Detailed breakdown for each milestone (features, tasks, files, dependencies, AC links)

Each milestone should represent a *testable, working slice* of functionality, ready for QA and deployment.

---

**(E) Execute – Output & Deliverables**

* Output must be clean Markdown suitable for `docs/milestones.md`.
* Use consistent formatting and checklist syntax.
* Clearly label each milestone’s scope and deliverables.
* Include “Stretch” and “Future” milestones as optional next phases.

---

**Evaluation (Success Criteria):**

* Could this milestone plan be dropped directly into GitHub Projects or Jira and used as a delivery roadmap?
* Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
* Is the sequencing justified and aligned with maximum value delivery and risk reduction?

💡 **Bonus tip for the workshop:**
Once the full milestone roadmap is generated, have participants regenerate only a single phase (e.g., **Milestone 3: Transit Overlay**) to practice *scoped prompting*. It reinforces how large prompts can be modularized without losing fidelity.

