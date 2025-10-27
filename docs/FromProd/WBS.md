# Work Breakdown Structure: Atlanta FIFA Navigator

> Version 1.0 | Draft | October 2025

## 1. Introduction

This Work Breakdown Structure (WBS) provides a detailed breakdown of tasks, milestones, and deliverables for the development and deployment of the **Atlanta FIFA Navigator**, a web and mobile application designed to assist visitors in navigating the city during FIFA events.

---

## 2. Project Scope

The project includes planning, designing, building, testing, deploying, and maintaining the Atlanta FIFA Navigator platform. The platform will provide real-time navigation, venue information, language support, and key event logistics for visitors attending FIFA matches in Atlanta.

---

## 3. Major Phases and Work Packages

### Phase 1: Project Planning and Requirements (Weeks 1–2)

- **Task 1.1:** Finalize project charter and objectives
- **Task 1.2:** Define stakeholder requirements
- **Task 1.3:** Develop PRD and initial specifications
- **Task 1.4:** Identify MVP feature set and constraints
- **Deliverable:** Approved PRD and feature list

### Phase 2: Design and Architecture (Weeks 3–4)

- **Task 2.1:** UX/UI wireframes and prototypes
- **Task 2.2:** Define system architecture (frontend, backend, APIs)
- **Task 2.3:** Define infrastructure (Vercel, Prisma db, github codespaces)
- **Task 2.4:** Multilingual content and accessibility requirements
- **Deliverable:** Finalized design mockups and architecture diagrams

### Phase 3: Core Development (Weeks 5–10)

- **Task 3.1:** Frontend development (React/Next.js)
- **Task 3.2:** Backend services (Node.js, TypeScript, API Gateway)
- **Task 3.3:** Integration with Nextjs, vercel services
- **Task 3.4:** Multilingual support (English & Spanish)
- **Task 3.5:** Event data ingestion and real-time updates
- **Task 3.6:** MARTA Transit API integration
  - **Subtask 3.6.1:** Implement MARTA Bus API (GTFS-RT) integration
  - **Subtask 3.6.2:** Implement MARTA Train API integration
  - **Subtask 3.6.3:** Environment detection for GitHub Codespaces
  - **Subtask 3.6.4:** CORS proxy implementation for non-standard ports
  - **Subtask 3.6.5:** Fallback logic and mock data handling
  - **Technical Note:** See `TECH_NOTE_Codespaces_API_Testing.md` for API verification
- **Deliverable:** Functional MVP build

### Phase 4: Testing and Quality Assurance (Weeks 11–12)

- **Task 4.1:** Unit, integration, and end-to-end testing
- **Task 4.2:** Load and performance testing
- **Task 4.3:** Security and compliance review (OWASP, GDPR)
- **Deliverable:** QA sign-off report

### Phase 5: Deployment and Launch (Weeks 13–14)

- **Task 5.1:** Production infrastructure setup
- **Task 5.2:** CI/CD pipeline configuration
- **Task 5.3:** DNS and SSL provisioning
- **Task 5.4:** Beta testing and stakeholder review
- **Deliverable:** Production release (v1.0)

### Phase 6: Post-Launch and Maintenance (Ongoing)

- **Task 6.1:** Monitoring and analytics setup (CloudWatch, Datadog)
- **Task 6.2:** Bug fixes and minor updates
- **Task 6.3:** Feature backlog grooming and future enhancements
- **Deliverable:** Post-launch performance report

---

## 4. Milestones

| Milestone | Description                    | Target Date |
| --------- | ------------------------------ | ----------- |
| M1        | PRD Approved                   | Week 2      |
| M2        | Architecture & Design Complete | Week 4      |
| M3        | MVP Feature Complete           | Week 10     |
| M4        | QA Sign-off                    | Week 12     |
| M5        | Production Launch              | Week 14     |

---

## 5. Dependencies

- Availability of venue and event data APIs
- Timely content delivery (translations, branding)
- Access to AWS infrastructure and SES configuration
- Stakeholder review cycles

---

## 6. Risks and Mitigations

| Risk                                                | Mitigation Strategy                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| API changes from FIFA or third-party data providers | Implement abstraction layer and fallback logic                          |
| Performance under high traffic                      | Load test early, implement autoscaling                                  |
| Translation delays                                  | Use placeholder text and staged rollout                                 |
| Security vulnerabilities                            | Continuous scanning, OWASP Top 10 audits                                |
| GitHub Codespaces blocking non-standard ports       | Environment detection + CORS proxy for port 18096 (MARTA Train API)     |
| Third-party proxy service downtime (allOrigins)     | Direct connection in production, mock data fallback in all environments |

---

## 7. Acceptance Criteria

- Application delivers real-time navigation and event data
- English and Spanish fully supported across UI and content
- All core AWS infrastructure deployed with IaC (CDK)
- No P1 or P2 bugs at launch
- Performance benchmarks met (TTFB < 200ms, 99.9% uptime)

---

## 8. Conclusion

This WBS serves as the roadmap for delivering a robust, scalable, multilingual event navigation platform ahead of FIFA events in Atlanta. Following these structured phases ensures predictable progress, stakeholder visibility, and a timely, successful launch.
