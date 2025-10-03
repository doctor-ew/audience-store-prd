Add NextAuth (credentials) for Audience Store:

## With Serena MCP Enhancement:
- Use MCP to verify user exists in database during authentication
- Log authentication events to external service via MCP (e.g., Slack webhook for monitoring)
- Use MCP to check for rate limiting against Redis/memory store

## Core Implementation:
- Add `src/lib/auth.ts` using database queries (via MCP or Prisma) + bcrypt
- Add `app/api/auth/[...nextauth]/route.ts` using that config
- Add `app/api/auth/signup/route.ts`:
  - Zod validation for input
  - bcrypt password hash
  - Safe logging (no PII)
  - Rate limiting (use MCP to track attempts or simple in-memory helper)
  - Use MCP to notify Slack on new signups (optional)

## MCP Benefits:
- Real-time user verification against live database
- External service integration for monitoring/alerts
- Distributed rate limiting across instances

Show file contents and explain how MCP enhances security monitoring.
