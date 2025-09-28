You are a senior tech lead writing a professional software specification.

Context: We have a PRD in docs/PRD.md that describes "Audience Store," a teaching demo app.

Your job:
1. Write a **technical specification (spec.md)** that translates the PRD into an implementable design.  
   - Include: architecture overview, dependencies, data model, API routes, UI pages/components, and error handling.  
   - Show file structure (Next.js App Router + src/ directory).  
   - Call out edge cases and concurrency risks explicitly.  
   - Note which parts are optional/future (AI witty descriptions).

2. Produce a **work breakdown** for implementation:  
   - Slice features into milestones (e.g., Accounts → Marketplace → Transactions → AI).  
   - For each milestone, list the files to create/edit, responsibilities, and acceptance criteria.  
   - Output in checklist format that we can track in Git.

3. Output should be:
   - Markdown only, suitable for docs/spec.md.  
   - Clear enough that we can hand it to Claude Code to implement slice by slice.  
   - Assume pnpm + Prisma + SQLite in a GitHub Codespaces + Next.js environment.

Do not write any code yet. Focus on the spec and work plan only.
