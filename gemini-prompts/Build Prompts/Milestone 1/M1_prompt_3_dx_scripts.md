Update package.json in ./audience-store to make setup simple:

- Add scripts:
    "dev": "next dev"
    "build": "next build"
    "start": "next start"
    "prisma:generate": "prisma generate"
    "db:push": "prisma db push"
    "db:seed": "tsx prisma/seed.ts"
    "db:setup": "npm run prisma:generate && npm run db:push && npm run db:seed"
- Do NOT run db push/seed automatically on install.
- Add dev dependencies if missing: prisma, @prisma/client, tsx

Show the changed package.json block.
