# Prompt for Gemini (D-E-C-I-D-E Style — Milestones & Work Breakdown)

---

## **(D) Define – The Mission & Context**
You are a senior tech lead defining the **engineering milestones and work breakdown** for **Atlanta FIFA Navigator**, a Next.js web app hosted on **Vercel** that helps fans navigate to and around **Mercedes-Benz Stadium** during the FIFA event. The application uses the **Google Maps API** and **MARTA API** for real-time transit and traffic visualization and **Firebase** for stateful storage.

We are now generating `docs/milestones.md` based on the provided PRD (`docs/PRD.md`) and technical specification (`docs/spec.md`).

---

## **(E) Explore – What Needs to Be Delivered**
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

## **(C) Compare – Prioritize and Sequence**
Weigh different ways the work could be phased and choose the most logical path based on:

* Reducing technical risk early
* Delivering user value incrementally
* Respecting architectural prerequisites
* Aligning with PRD milestone dates (Prototype → Beta → Final)

Justify why this sequencing is optimal for this project.

---

## **(I) Interpret – Tie to Requirements & Metrics**
Map each milestone to:

* Specific **PRD objectives** and **success metrics** (e.g., 100K users, 90% satisfaction, <2% crash rate)
* **Technical constraints** from the spec (e.g., API routes <500 ms, SSR/ISR strategy, server-side key handling)
* Relevant **acceptance criteria** from `docs/acceptance_criteria.md`

This ensures every milestone builds toward the project’s stated outcomes.

---

## **(D) Decide – Finalize the Roadmap**
Commit to the milestone plan that best satisfies the above and output it in **Markdown** as:

* A high-level table of milestones with scope, timeline, and status (MVP/Stretch/Future)
* Detailed breakdown for each milestone (features, tasks, files, dependencies, AC links)

Each milestone should represent a *testable, working slice* of functionality, ready for QA and deployment.

---

## **(E) Execute – Output & Deliverables**

* Output must be clean Markdown suitable for `docs/milestones.md`.
* Use consistent formatting and checklist syntax.
* Clearly label each milestone’s scope and deliverables.
* Include “Stretch” and “Future” milestones as optional next phases.

---

### **Evaluation (Success Criteria):**

* Could this milestone plan be dropped directly into GitHub Projects or Jira and used as a delivery roadmap?
* Does each milestone clearly define scope, deliverables, dependencies, and acceptance criteria?
* Is the sequencing justified and aligned with maximum value delivery and risk reduction?

### 💡 **Bonus tip for the workshop:**
Once the full milestone roadmap is generated, have participants regenerate only a single phase (e.g., **Milestone 3: Transit Overlay**) to practice *scoped prompting*. It reinforces how large prompts can be modularized without losing fidelity.

---

