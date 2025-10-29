# Class Notes: PRD to Production with AI Coding Assistants

> **Course**: PRD to Production
> **Audience**: Non-technical Product Managers
> **Tools**: Gemini, Claude Code, or similar AI coding assistants
> **Goal**: Product Manager drives, AI codes

## Overview

This course teaches product managers how to take a Product Requirements Document (PRD) and use AI coding assistants (like Gemini or Claude) to build and deploy a working application—without writing code themselves.

## Core Principle

**You (PM) are in charge. The AI is your engineer.**

- You make product decisions
- You review outputs
- You approve or reject changes
- The AI writes the code

## Quick Start Commands

### Create Next.js App (Accept All Defaults)

When starting a new Next.js project and you don't want to be prompted for every option:

```bash
pnpx create-next-app@latest your-project-name \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --eslint \
  --no-react-compiler \
  --no-turbopack
```

**What this does:**
- `--typescript` - Uses TypeScript (industry standard)
- `--tailwind` - Includes Tailwind CSS for styling
- `--app` - Uses Next.js App Router (modern approach)
- `--src-dir` - Puts code in `src/` folder (cleaner structure)
- `--import-alias "@/*"` - Allows clean imports like `@/components/Button`
- `--use-pnpm` - Uses pnpm package manager (faster, more efficient)
- `--eslint` - Includes code linting (catches errors)
- `--no-react-compiler` - Skips React Compiler (not needed for beginners)
- `--no-turbopack` - Uses standard webpack (Turbopack is experimental)

## Key Lessons

### Lesson 1: Start Simple (Phased Approach)

**❌ Don't do this:**
"Build me a full app with database, authentication, payments, and AI features"

**✅ Do this:**
"Let's build Phase 1: Just the map and real-time transit data. No database yet."

**Why?**
- Faster to see results
- Less can go wrong
- Easier to validate with users
- Can add complexity later

**See**: `docs/PHASED_APPROACH.md` for the FIFA Navigator example

### Lesson 2: Database = Complexity

**For beginners, avoid databases in Phase 1:**

**Phase 1 (Simple)**:
- Static JSON files for data
- Client-side localStorage for preferences
- Deploys to Vercel instantly

**Phase 2 (When ready)**:
- Add Vercel Postgres database
- User accounts and profiles
- Persistent cross-device data

**See**:
- `docs/ForCode/PHASE_1_IMPLEMENTATION.md` - No database approach
- `docs/FromProd/DATABASE_SETUP.md` - When you're ready for Phase 2

### Lesson 3: Choose the Right Libraries

**⚠️ IMPORTANT: Tell Gemini which libraries to use BEFORE it starts coding.**

Common mistakes:
- Letting Gemini choose animation libraries (often picks react-spring, which breaks)
- Not specifying styling approach (Gemini might create complex CSS)
- Accepting Gemini's first suggestion without questioning

**✅ Use the recommended tech stack:**
- **Animation**: Framer Motion (NOT react-spring)
- **Data Fetching**: SWR
- **Styling**: Tailwind CSS
- **Maps**: @vis.gl/react-google-maps

**See**:
- `docs/FromProd/GEMINI_TECH_STACK_RECOMMENDATIONS.md` - General tech stack guide
- `docs/FromProd/GEMINI_MILESTONE_TOOLS.md` - Tool recommendations for each milestone

**Starter prompt template:**
> "Use Next.js 16, Framer Motion for animations, SWR for data fetching, and Tailwind CSS. TypeScript only."

**Before starting each milestone**, check `GEMINI_MILESTONE_TOOLS.md` for specific prompts to give Gemini.

### Lesson 4: How to Talk to AI Assistants

#### Good Prompts for Product Managers

**✅ Clear requirements:**
> "I need a map showing real-time bus locations. Users should be able to click a bus to see its route number and next stop."

**✅ Reference documentation:**
> "Follow the implementation guide in docs/ForCode/PHASE_1_IMPLEMENTATION.md"

**✅ Specify what to avoid:**
> "Do NOT add a database. Use static JSON files like in the Phase 1 guide."

**✅ Ask for explanations:**
> "Explain what this code does in simple terms"

**❌ Vague requests:**
> "Make it better"

**❌ Assuming technical knowledge:**
> "Refactor the middleware to use edge runtime"

### Lesson 5: Deployment First

**Deploy early and often:**

1. Get something working on Vercel first
2. Then add features incrementally
3. Deploy after each major feature

**Why?**
- Proves your idea works
- You can share with stakeholders
- Catches deployment issues early

### Lesson 6: When You Get Stuck

**Common issues and solutions:**

| Problem | Solution |
|---------|----------|
| Build fails with database errors | You tried to use a database in Phase 1. Remove Prisma and follow Phase 1 guide |
| "Module not found" errors | Run `pnpm install` to install dependencies |
| API keys not working | Check environment variables in Vercel dashboard |
| Changes don't show up | Clear cache with `pnpm run build` or restart dev server |
| Too many errors | Start over with a clean project, follow guide step-by-step |

## Course Structure

### Week 1: Foundation
- **Day 1**: PRD writing basics
- **Day 2**: Setting up development environment (Codespaces)
- **Day 3**: Create your first Next.js app
- **Day 4**: Deploy to Vercel
- **Day 5**: Review and iteration

### Week 2: Building Features
- **Day 1**: Adding a map (Google Maps API)
- **Day 2**: Integrating external APIs (MARTA transit)
- **Day 3**: Static data and JSON files
- **Day 4**: Client-side interactivity
- **Day 5**: Testing and refinement

### Week 3: Polish and Launch
- **Day 1**: Internationalization (multiple languages)
- **Day 2**: Mobile responsiveness
- **Day 3**: Performance optimization
- **Day 4**: Final deployment
- **Day 5**: Presentation and demo

## Files You Need to Understand

### For Product Managers (docs/FromProd/)
- `GEMINI_TECH_STACK_RECOMMENDATIONS.md` - **START HERE** - Core library recommendations
- `GEMINI_MILESTONE_TOOLS.md` - **ESSENTIAL** - Tool recommendations for each feature milestone
- `PRD.md` - Product Requirements Document template
- `USER_STORY_MAPPING.md` - How to write user stories
- `DATABASE_SETUP.md` - Database guide (Phase 2)
- `CODESPACES_SETUP.md` - Development environment

### For AI Assistants (docs/ForCode/)
- `PHASE_1_IMPLEMENTATION.md` - Step-by-step implementation guide
- `SETUP_DATABASE_FOR_VERCEL.md` - Database setup (Phase 2)
- `DATABASE_QUICK_REFERENCE.md` - Quick lookup

### Project Planning (docs/)
- `PHASED_APPROACH.md` - How to split work into phases
- `spec.md` - Technical specification
- `acceptance_criteria.md` - How to verify features work

## Checklist: PM Responsibilities

As the PM, you are responsible for:

### Before Coding
- [ ] Write a clear PRD with user stories
- [ ] Decide on Phase 1 vs Phase 2 features
- [ ] Set up Vercel account and get API keys
- [ ] Review phased approach document

### During Development
- [ ] Give clear instructions to AI assistant
- [ ] Review code explanations (don't just accept blindly)
- [ ] Test features as they're built
- [ ] Make product decisions (colors, text, features)
- [ ] Keep documentation updated

### Before Launch
- [ ] Verify all acceptance criteria are met
- [ ] Test on mobile and desktop
- [ ] Check all environment variables are set
- [ ] Review performance (page load speed)
- [ ] Get feedback from test users

## Red Flags 🚩

**Stop and ask for help if:**

- AI suggests adding authentication when you didn't ask for it
- Build process takes longer than 5 minutes
- AI starts installing database packages in Phase 1
- Deployment fails more than 3 times
- AI suggests complex webpack configurations
- You see errors about "native modules" or "adapters"
- **AI installs react-spring for animations** (use Framer Motion instead)
- **AI creates custom CSS files** (use Tailwind instead)
- **Animation keeps breaking after each change** (wrong library choice)

**These usually mean**: The AI went off track. Go back to the guide and specify the correct libraries.

## Success Metrics

**You're on track if:**
- First deployment happens within 2 days
- Each new feature deploys successfully
- Build time is under 2 minutes
- You can explain what each feature does
- Test users can complete key workflows

## Resources

### Getting Help
- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs
- Google Maps API: https://developers.google.com/maps/documentation
- GitHub Issues: Document problems for async help

### Example Projects
- This FIFA Navigator app (Phase 1 approach)
- Check `docs/PHASED_APPROACH.md` for architecture

## Class Exercise: "Make it Real"

### Day 1 Challenge
Take your PRD and:
1. Create a new Next.js app with the command above
2. Deploy it to Vercel (even if it's just the default page)
3. Share the URL with the class

**Goal**: Prove you can deploy SOMETHING. Features come next.

### Week 1 Challenge
Build Phase 1 of your project:
1. Main feature only (no database)
2. Static data
3. Works on mobile
4. Deployed to Vercel

### Final Project
Present your working application:
1. Live demo (not slides)
2. Explain product decisions you made
3. Show code the AI wrote (and explain what it does)
4. Discuss what you'd do differently

## Common PM Mistakes

### Mistake 1: Trying to Learn Coding
**You don't need to learn JavaScript!**
- Focus on product decisions
- Let AI handle implementation
- Ask AI to explain in simple terms

### Mistake 2: Adding Too Many Features
**Build the simplest version first**
- One core feature
- No database
- Deploy it

### Mistake 3: Accepting Everything AI Suggests
**You're the product manager!**
- AI might suggest features you don't need
- Review and question suggestions
- Say "no, let's keep it simple"

### Mistake 4: Not Testing Yourself
**Use your own product!**
- Click every button
- Try it on your phone
- Share with friends
- Fix what's broken

## Tips from Successful Students

> "I thought I needed to understand the code. I don't. I just need to test if it works and make product decisions." - Sarah, PM

> "Starting with NO database was the best advice. I got my app live in 3 days." - Mike, Founder

> "I learned to ask AI to explain things like I'm 5 years old. Much better answers." - Jessica, Designer

> "Deploy early. I deployed on Day 1 even though it was just a blank page. It forced me to figure out deployment before building features." - Tom, PM

## Final Advice

**Your superpower as a non-technical PM:**
- You focus on what users need
- You don't get distracted by cool tech
- You ship faster because you keep it simple
- You make product decisions, not technical ones

**Remember:**
- Gemini/Claude is your engineer
- You are the product manager
- Make it work first
- Make it perfect later

---

**Class**: PRD to Production
**Instructor**: [Your Name]
**Course Materials**: `/docs` folder
**Questions**: Post in class discussion board

**Next Class**: We'll walk through creating your first Next.js app together using the command above.
