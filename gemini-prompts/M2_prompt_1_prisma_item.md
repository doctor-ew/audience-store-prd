We are in ./audience-store (Next.js App Router + TS + Prisma/SQLite).

Task: extend the DB for marketplace listings.

- Update prisma/schema.prisma to add model Item:
  id cuid @id @default(cuid())
  name string
  description string
  price int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sellerId string
  purchasedById string?  // null => still for sale
  relations:
    seller User @relation("SellerItems", fields: [sellerId], references: [id])
    purchasedBy User? @relation("BuyerItems", fields: [purchasedById], references: [id])

- Update User relations in schema to include:
  itemsListed Item[] @relation("SellerItems")
  itemsPurchased Item[] @relation("BuyerItems")

- Update prisma/seed.ts to create 3 unsold Items for the seller user.

Return the full updated files (schema.prisma and seed.ts). Do not run any commands.

Remind the Human In The Loop (HITL) to run `npm run db:push && npm run db:seed`