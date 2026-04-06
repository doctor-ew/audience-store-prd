
# SPEC Prompt for Gemini (S-T-A-G-E Style – Info-Dense & Ready to Run)

## **Setup:**
You are a senior tech lead writing a professional software specification. We are building **Atlanta FIFA Navigator**, a Next.js web application hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. We will use the **Google Maps API** and **MARTA API** (``) for real-time transit data and traffic visualization.

* Latitude/Longitude of Mercedes-Benz Stadium: `33.754542, -84.402492`
* Frontend: Next.js (App Router)
* Hosting: Vercel
* Database: Firebase (for any stateful storage needs)
* Sample traffic layer reference: [Google Maps Sample](https://github.com/googlemaps/js-samples/tree/sample-layer-traffic)

---

## **Target:**
Generate a complete `spec.md` that translates the provided PRD (`docs/PRD.md`) and WBS (`docs/WBS.md`) into a detailed technical plan.

---

## **Actions (What to produce):**

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

## **Guardrails:**

* Must output clean Markdown suitable for `docs/spec.md`.
* Assume `pnpm`, `Prisma`, and `SQLite` for local development.
* Organize milestones from foundational setup → core map rendering → transit overlay → user experience polish.
* Explicitly note what is **MVP**, what is **stretch**, and what is **future**.

---

## **Evaluation (Success Criteria):**

* Can this spec be handed to Claude Code or Serena MCP to implement feature-by-feature?
* Does it cover architecture, edge cases, and acceptance criteria clearly enough to guide autonomous agent work?

---

### 💡 **Bonus tip for the workshop:**
Have participants *start with this exact S-T-A-G-E prompt*, then iterate by swapping sections (“Milestones only,” “Data model only,” etc.) to teach modular prompting.
