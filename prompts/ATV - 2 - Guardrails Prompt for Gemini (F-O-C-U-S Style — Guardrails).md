# Prompt for Gemini (F-O-C-U-S Style — Milestones & Work Breakdown)

## **Frame**  
You are a senior tech lead writing `docs/milestones.md` for **Atlanta FIFA Navigator** — a Next.js web application hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The app uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

Generate a milestone plan derived directly from the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`) so engineers, project leads, and AI agents can follow a clear roadmap from MVP to stretch goals.  
**Sources:**

- PRD
    
- TECH_SPEC
    

---

## **Objective**  
Produce a complete, structured milestone plan that divides delivery into logical, sequential phases with clear deliverables, dependencies, and acceptance criteria. Each milestone must represent a testable, deployable slice of functionality and align with both product goals and architectural constraints.

The milestone plan should include:

- **Milestone Definition:** Name, purpose, goal, and key outcomes.
    
- **Work Breakdown:** Major tasks, components, and files to create or modify.
    
- **Dependencies:** Technical and sequencing dependencies, including external APIs.
    
- **Acceptance Criteria Alignment:** Which criteria each milestone satisfies.
    
- **Scope Classification:** Label each milestone as **MVP**, **Stretch**, or **Future**.
    
- **Risk & Mitigation Notes:** Known risks and how they’ll be addressed.
    
- **Stretch & Future Enhancements:** Suggested follow-on phases.
    

---

## **Constraints**

- Respect PRD timeline milestones (Prototype → Beta → Final).
    
- Follow architectural priorities in the spec (Foundational Setup → Core Map Rendering → Transit Overlay → UX Polish → Database Integration).
    
- Each milestone must deliver a working, testable increment of functionality.
    
- Reflect PRD success metrics (100K+ users, 90%+ satisfaction, <2% crash rate) and non-functional requirements (**<2 s** response time, **<500 ms** API latency, **WCAG 2.1 AA**, **99.9%** uptime).
    
- Include sequencing logic that prioritizes **risk reduction** and **user value** early.
    

---

## **Users**  
Engineering leads, delivery managers, and AI agents (e.g., Serena MCP) who will use this roadmap to track project progress and guide implementation.

---

## **Steps**

1. **Milestone List:** Break the project into sequential, named milestones, each with purpose and deliverables.
    
2. **Work Breakdown:** For each milestone, list major tasks, files, components, and APIs.
    
3. **Dependencies:** Identify technical prerequisites and sequencing logic.
    
4. **Acceptance Criteria Link:** Connect each milestone to specific acceptance criteria from `docs/acceptance_criteria.md`.
    
5. **Scope Labels:** Mark milestones as **MVP**, **Stretch**, or **Future**.
    
6. **Risk Planning:** Note potential risks, external dependencies, and mitigation strategies.
    
7. **Output Format:** Present the result as Markdown with a high-level table and detailed per-milestone sections (checklists included).
    

---

**Evaluation (Success Criteria)**

- Can this plan be imported into a project board (e.g., GitHub Projects or Jira) as a delivery roadmap?
    
- Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
    
- Is sequencing justified by technical dependencies, risk reduction, and user value delivery?
    

---

💡 **Bonus tip for the workshop:**  
Have participants _start with this full F-O-C-U-S prompt_, then iterate by narrowing scope — e.g., “Generate **Milestone 2 only**” or “Show **Stretch Goals only**.” This teaches modular prompting and shows how scaffolding can zoom in or out without losing fidelity.

---
