Update package.json in ./audience-store to make setup simple:

- Add scripts:
    "dev": "next dev"
    "build": "next build"
    "start": "next start"
    "mcp:db:create": "echo 'Use Serena MCP to create database tables'"
    "mcp:db:seed": "echo 'Use Serena MCP to seed demo data'"
    "mcp:db:verify": "echo 'Use Serena MCP to verify database setup'"
    "db:setup": "npm run mcp:db:create && npm run mcp:db:seed && npm run mcp:db:verify"
    # Fallback Prisma scripts (if MCP unavailable):
    "prisma:generate": "prisma generate"
    "db:push": "prisma db push"
    "db:seed:prisma": "tsx prisma/seed.ts"
    "db:setup:prisma": "npm run prisma:generate && npm run db:push && npm run db:seed:prisma"
- Do NOT run db push/seed automatically on install.
- With Serena MCP, database operations are handled directly - no ORM setup needed
- Add dev dependencies if using Prisma fallback: prisma, @prisma/client, tsx

Show the changed package.json block and explain how MCP simplifies database setup.
