# Prompt for Gemini (C-R-A-F-T Style — Acceptance Criteria)

## **Context:**
You are acting as a **QA engineer** writing `docs/acceptance_criteria.md` for the **Atlanta FIFA Navigator** project — a Next.js app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during FIFA events. The application uses the **Google Maps API** and **MARTA API** for real-time traffic and transit visualization and **Firebase** for stateful storage.

Your task is to derive detailed **acceptance criteria** directly from the PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

## **Role:**
Act as a **QA agent** responsible for verifying whether each feature meets the requirements defined in the PRD and Spec. Each acceptance criterion must be **clear, atomic, measurable, and testable** — usable in automated tests, manual QA scripts, or CI checks.

---

## **Actions:**
Apply the **C-R-A-F-T** model to produce the output:

1. **C – Conditions:** Describe the preconditions or setup required for the feature (e.g., “Given a user with location services enabled…”).
2. **R – Results:** Define the expected outcomes or behaviors that must occur (“…then the map centers on Mercedes-Benz Stadium within 2s”).
3. **A – Acceptance:** State the specific pass/fail criteria for the test (binary success conditions).
4. **F – Functional & Non-Functional:** Include both kinds of criteria — feature-specific behaviors and broader constraints (performance budgets, compliance requirements, etc.).
5. **T – Traceability:** Link each criterion back to the PRD section, user story, or spec element it validates.

---


## **Format:**

* Output as a **Markdown checklist** grouped by feature category.
* Each item must include **Condition → Result → Acceptance**, and where relevant, **Traceability**.
* Include both **functional** (UI, API, user interaction) and **non-functional** (performance, accessibility, availability) criteria.

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
## **constrainTs:**

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

### **Evaluation (Success Criteria):**

* Can this document serve as the “definition of done” for QA and engineering teams?
* Would an AI code agent or junior engineer know **exactly** when a feature is ready for production based on these criteria?
* Are all criteria binary, measurable, and directly linked back to the PRD/spec?

### 💡 **Bonus tip for the workshop:**
After generating the full AC set, have participants *narrow scope by feature* (e.g., “Transit Overlay only” or “Language switching only”) to teach **granular prompting** and modular QA thinking.


---

