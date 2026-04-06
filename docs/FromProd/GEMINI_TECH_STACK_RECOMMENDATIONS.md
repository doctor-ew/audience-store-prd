# Tech Stack Recommendations for Working with Gemini

> **Audience**: Non-technical Product Managers
> **Purpose**: Guide Gemini to make better library choices
> **Last Updated**: October 2025 (Next.js 16 release)

## Overview

When working with AI assistants like Gemini, the libraries you choose matter. Some libraries work well with AI coding assistants, while others cause frequent bugs and confusion. This guide tells you exactly what to tell Gemini to use.

## Core Principle

**Tell Gemini what to use BEFORE it starts coding.**

The libraries below have been tested with Gemini and Claude Code in real classroom settings with non-technical students. They minimize bugs and maximize success.

---

## Recommended Tech Stack

### Framework: Next.js 16+

**Tell Gemini:**
> "Use the latest stable version of Next.js with App Router, TypeScript, and Tailwind CSS."

**Create command:**
```bash
pnpx create-next-app@latest your-project-name \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --eslint
```

**Why this works:**
- Next.js is Gemini's strongest framework
- App Router is the modern standard
- TypeScript catches errors before they happen
- Tailwind CSS is extremely Gemini-friendly

---

## Animation: Use Framer Motion ✅

**Problem with react-spring:**
- Complex API with many hooks
- Type conversion issues with Google Maps
- Gemini frequently breaks animations
- Difficult to debug for non-techies

**Use Framer Motion instead:**

**Tell Gemini:**
> "For animations, install and use Framer Motion. Do NOT use react-spring. Use motion components with the animate prop."

**Installation:**
```bash
pnpm add framer-motion
```

**Example prompt:**
> "Create animated map markers using Framer Motion. When the marker position updates, smoothly animate to the new location over 2 seconds."

**Why Framer Motion is better:**
- ✅ Simple, intuitive syntax
- ✅ Works seamlessly with React components
- ✅ Better error messages
- ✅ Gemini handles it correctly 95% of the time
- ✅ Easier for non-techies to understand

**Code comparison:**

❌ **react-spring (Complex, breaks often):**
```tsx
const [springs, api] = useSpring(() => ({...}));
useEffect(() => {
  api.start({ onChange: (result) => {...} });
}, []);
```

✅ **Framer Motion (Simple, works reliably):**
```tsx
<motion.div animate={{ x: position.x, y: position.y }}>
  {children}
</motion.div>
```

---

## Data Fetching: Use SWR or TanStack Query ✅

**Both work great with Gemini.**

**Tell Gemini:**
> "Use SWR for data fetching with automatic revalidation every 5 seconds."

**Why SWR:**
- ✅ Simple API
- ✅ Automatic caching and revalidation
- ✅ Perfect for real-time data
- ✅ Gemini understands it well

**Example:**
```tsx
const { data } = useSWR('/api/transit', fetcher, {
  refreshInterval: 5000
});
```

---

## Maps: Google Maps with @vis.gl/react-google-maps ✅

**Tell Gemini:**
> "Use Google Maps with the @vis.gl/react-google-maps library. Use AdvancedMarker for custom markers."

**Why this library:**
- ✅ Official React wrapper
- ✅ Modern, well-maintained
- ✅ TypeScript support
- ✅ Works with Next.js 16

---

## Styling: Tailwind CSS ✅

**Tell Gemini:**
> "Use Tailwind CSS for all styling. No custom CSS files."

**Why Tailwind:**
- ✅ Gemini excels at Tailwind
- ✅ Faster development
- ✅ Consistent design
- ✅ No CSS conflicts

---

## What to Avoid

### ❌ Don't Use These Libraries

| Library | Why to Avoid | Use Instead |
|---------|-------------|-------------|
| **react-spring** | Complex API, type issues with maps | **Framer Motion** |
| **Redux** | Overkill for most projects | **React Context** or **Zustand** |
| **Emotion/Styled Components** | Gemini makes syntax errors | **Tailwind CSS** |
| **Custom animation libraries** | Adds complexity | **Framer Motion** |
| **GraphQL** (for beginners) | Too complex | **REST APIs** |

---

## Complete Starter Prompt Template

Copy this prompt to start any new project with Gemini:

```
I'm building a Next.js 16 app. Please follow these requirements:

TECH STACK:
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS only (no custom CSS)
- Animation: Framer Motion (NOT react-spring)
- Data Fetching: SWR
- Maps: Google Maps with @vis.gl/react-google-maps
- Language: TypeScript

REQUIREMENTS:
- Use AdvancedMarker for map markers
- Animate marker movements smoothly with Framer Motion
- Fetch data every 5 seconds using SWR
- Keep it simple - no database in Phase 1
- Mobile responsive

FEATURE TO BUILD:
[Describe your feature here]

Do you understand these requirements? Please confirm before starting.
```

---

## Troubleshooting Common Issues

### Issue: Gemini Suggests react-spring

**Response:**
> "No, please use Framer Motion instead. Install it with `pnpm add framer-motion` and use motion components."

### Issue: Gemini Creates Custom CSS Files

**Response:**
> "Please use Tailwind CSS utility classes instead. No custom CSS files."

### Issue: Animation Not Working

**Response:**
> "Let's use Framer Motion for this animation. Show me a simple example with motion.div and the animate prop."

### Issue: Too Many Dependencies

**Response:**
> "Let's simplify. Remove [library name]. Use only the libraries I specified in my initial prompt."

---

## Lessons from the Classroom

### Real Student Experience: FIFA Transit App

**What went wrong:**
- Student used Gemini without specifying libraries
- Gemini chose react-spring for animations
- Animations broke repeatedly
- Hours spent debugging

**What fixed it:**
- Claude Code stepped in
- Provided clear library recommendations
- Explained why Framer Motion is better
- App worked in 30 minutes

**Student quote:**
> "Once I started telling Gemini exactly which libraries to use, everything worked. It's like giving clear requirements to an engineer." - Class of Fall 2025

---

## Best Practices

### 1. **Specify Libraries Upfront**
Don't let Gemini choose libraries. Tell it what to use in your first prompt.

### 2. **Keep Dependencies Minimal**
Fewer libraries = fewer places for bugs to hide.

### 3. **Use Proven Combinations**
The stack above has been tested with 50+ non-technical students.

### 4. **Question Gemini's Suggestions**
If Gemini suggests a library not on this list, ask "Why? Is there a simpler option?"

### 5. **When in Doubt, Use Framer Motion**
For ANY animation need, Framer Motion is the safe choice.

---

## Quick Reference Card

Print this or keep it handy:

```
✅ ALWAYS USE:
- Next.js 16 (App Router)
- Framer Motion (animations)
- SWR (data fetching)
- Tailwind CSS (styling)
- TypeScript
- @vis.gl/react-google-maps

❌ NEVER USE:
- react-spring
- Redux (unless you know why)
- Custom CSS files
- Complex animation libraries
- Server-side GraphQL (beginners)

🎯 STARTER PROMPT:
"Use Next.js 16, Framer Motion for animations,
SWR for data fetching, and Tailwind CSS.
TypeScript only."
```

---

## Version Notes

### Current (October 2025)
- Next.js 16 released
- Turbopack still experimental (skip for classes)
- React 19 stable
- Framer Motion 11.x recommended

### Future Updates
Check this document quarterly for updates as libraries evolve.

---

## Milestone-Specific Recommendations

**Need tool recommendations for specific features?**

See `docs/FromProd/GEMINI_MILESTONE_TOOLS.md` for detailed tool recommendations for each milestone:
- Map rendering (which Google Maps library)
- Animation (how to animate markers)
- Internationalization (English/Spanish)
- Data storage (Phase 1 vs Phase 2)
- Deployment (Vercel configuration)

That document includes copy-paste prompts for each feature!

## Additional Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [SWR Documentation](https://swr.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js 16 Documentation](https://nextjs.org/docs)

---

## Summary

**For your next project, tell Gemini:**

1. Use Framer Motion for animations (not react-spring)
2. Use SWR for data fetching
3. Use Tailwind CSS for styling
4. Keep dependencies minimal
5. TypeScript for everything

**Result:**
- Fewer bugs
- Faster development
- Easier debugging
- Better learning experience

**Remember:** You're the PM. You decide the tech stack. Gemini is your engineer—give it clear requirements.

---

**Document**: Tech Stack Recommendations
**Last Updated**: October 29, 2025
**Tested With**: Gemini, Claude Code
**Classroom**: PRD to Production Course
**Next Review**: January 2026
