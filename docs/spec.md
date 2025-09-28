# Technical Specification: Audience Store

This document translates the product requirements for "Audience Store" into a technical design and implementation plan. It is intended for developers to build the application slice by slice.

## 1. Architecture Overview

The application will be a full-stack web application built with Next.js using the App Router.

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Database**: SQLite, managed via Prisma ORM. This is simple, file-based, and ideal for a self-contained demo environment like GitHub Codespaces.
-   **Authentication**: We will use `next-auth` for session management, storing session tokens in secure, HTTP-only cookies. Password hashing will be handled by `bcrypt`.
-   **Styling**: Tailwind CSS for utility-first styling.
-   **API**: Backend logic will be implemented as Server Actions or Route Handlers within the Next.js `app` directory. This keeps API routes colocated with the features that use them.
-   **Deployment**: The application is designed to be deployed on Vercel or a similar Node.js hosting platform.

## 2. Dependencies

The following dependencies will be added to the `package.json` and installed using `pnpm`.

-   `next`: Core framework
-   `react`, `react-dom`: UI library
-   `typescript`, `@types/react`, `@types/node`: Type safety
-   `prisma`: ORM for database access
-   `@prisma/client`: Prisma's query engine client
-   `next-auth`: Authentication handling
-   `bcrypt`, `@types/bcrypt`: Password hashing
-   `tailwindcss`, `postcss`, `autoprefixer`: Styling
-   `clsx`, `tailwind-merge`: Utility for conditional class names
-   `lucide-react`: Icon library

## 3. Data Model (Prisma Schema)

The database schema will be defined in `prisma/schema.prisma`. We will have three core models: `User`, `Item`, and `Purchase`.

```prisma
// file: prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  credits       Int       @default(100)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  itemsListed   Item[]    @relation("SellerItems")
  itemsPurchased Item[]   @relation("BuyerItems")
  purchases     Purchase[] @relation("BuyerPurchases")
  sales         Purchase[] @relation("SellerSales")
}

model Item {
  id            String    @id @default(cuid())
  name          String
  description   String
  price         Int
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sellerId      String
  seller        User      @relation("SellerItems", fields: [sellerId], references: [id])

  // An item is "sold" if purchasedById is not null
  purchasedById String?
  purchasedBy   User?     @relation("BuyerItems", fields: [purchasedById], references: [id])

  purchaseRecord Purchase?
}

model Purchase {
  id              String   @id @default(cuid())
  priceAtPurchase Int
  timestamp       DateTime @default(now())

  itemId          String   @unique // Each item can only be purchased once
  item            Item     @relation(fields: [itemId], references: [id])

  buyerId         String
  buyer           User     @relation("BuyerPurchases", fields: [buyerId], references: [id])

  sellerId        String
  seller          User     @relation("SellerSales", fields: [sellerId], references: [id])
}
```

## 4. API Routes & Server Actions

We will use a combination of Route Handlers for auth and Server Actions for data mutations.

-   **Authentication**
    -   `POST /api/auth/signup`: (Route Handler) Creates a new user. Hashes password.
    -   `POST /api/auth/signin`: (Route Handler via `next-auth`) Authenticates user and sets session cookie.
    -   `GET /api/auth/signout`: (Route Handler via `next-auth`) Clears session.
-   **Items**
    -   `app/sell/actions.ts#createItem`: (Server Action) Creates a new item listing, associating it with the logged-in user.
    -   `app/actions.ts#purchaseItem`: (Server Action) Executes the purchase transaction.
-   **Users**
    -   `app/profile/actions.ts#getUserProfile`: (Server Action) Fetches data for the current user's profile (credits, items listed, items purchased).

## 5. UI Pages & Components

The UI will be structured using the Next.js App Router.

-   **Pages (`src/app`)**
    -   `src/app/layout.tsx`: Root layout with header and footer.
    -   `src/app/page.tsx`: Main marketplace page. Lists all available items.
    -   `src/app/signup/page.tsx`: User registration page.
    -   `src/app/login/page.tsx`: User login page.
    -   `src/app/sell/page.tsx`: Form to create a new item listing.
    -   `src/app/profile/page.tsx`: Displays the logged-in user's credits, listed items, and purchased items.
-   **Components (`src/components`)**
    -   `Header.tsx`: Site-wide navigation, shows login/logout status and credit balance.
    -   `ItemCard.tsx`: Displays a single item in the marketplace. Includes a "Buy" button.
    -   `AuthForm.tsx`: A shared component for signup and login forms.
    -   `CreditBalance.tsx`: Displays the user's current credits.
    -   `Button.tsx`: A general-purpose styled button.

## 6. File Structure

```
audience-store/
├── prisma/
│   └── schema.prisma
├── public/
│   └── ...
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── profile/page.tsx
│   │   ├── sell/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   └── ItemCard.tsx
│   └── lib/
│       ├── auth.ts       # Next-auth configuration
│       ├── prisma.ts     # Prisma client instance
│       └── actions.ts    # Global server actions (e.g., purchase)
├── .env                  # For database URL and NEXTAUTH_SECRET
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 7. Error Handling, Edge Cases & Concurrency

-   **Error Handling**: Server Actions will use `try/catch` blocks to handle errors. The UI will display user-friendly error messages (e.g., "Insufficient credits"). Next.js `error.tsx` files can be used for unrecoverable route-level errors.
-   **Edge Cases**:
    -   A user cannot buy their own item.
    -   A user cannot buy an item they cannot afford.
    -   A user cannot buy an item that is already sold.
    -   User input (forms) must be validated on the server.
-   **Concurrency Risk**: Two users attempting to buy the same item simultaneously.
    -   **Mitigation**: The `purchaseItem` server action **must** use `Prisma.$transaction`. The transaction will read the item's state, check if it's available, decrement the buyer's credits, increment the seller's credits, and update the item's status to "sold" in a single, atomic operation. If the item is already sold when the transaction attempts to commit, Prisma will throw an error, preventing the double purchase.

## 8. Future Work (Optional)

-   **AI Witty Descriptions**: This feature will be implemented as a separate server action. A button on the `/sell` page will trigger a call to this action, which in turn calls an external LLM API (e.g., Google's Gemini API). The result will be streamed back to populate the description field. This is non-critical and can be added after the core functionality is complete.

---

# Work Breakdown

This work is broken down into milestones. Each milestone includes a checklist of tasks.

## Milestone 1: Project Setup & User Accounts

*Goal: Establish the project foundation and enable users to sign up, log in, and log out.*

- [ ] **Project Init**: Initialize `pnpm` and install base dependencies (`next`, `react`, `typescript`, `tailwindcss`).
- [ ] **Prisma Setup**:
    - `pnpm add -D prisma` and `pnpm add @prisma/client`.
    - Run `pnpm prisma init`.
    - Define `User`, `Item`, and `Purchase` models in `prisma/schema.prisma`.
    - Run `pnpm prisma generate` and `pnpm prisma db push` to create the initial SQLite database.
- [ ] **Authentication**:
    - `pnpm add next-auth bcrypt @types/bcrypt`.
    - Create `src/lib/auth.ts` to configure `next-auth` with the Credentials provider.
    - Create `src/app/api/auth/[...nextauth]/route.ts`.
    - Implement the `signup` route handler with password hashing.
- [ ] **UI - Auth Pages**:
    - Create `src/app/(auth)/signup/page.tsx` and `src/app/(auth)/login/page.tsx`.
    - Build a reusable `src/components/AuthForm.tsx`.
- [ ] **UI - Layout & Header**:
    - Create `src/components/Header.tsx` that shows "Login/Sign Up" or "Logout" and user email based on session state.
    - Add Header to `src/app/layout.tsx`.

**Acceptance Criteria:**
- A new user can create an account, and their data (with a hashed password) is saved in the database.
- An existing user can log in and out.
- The header correctly reflects the user's authentication state.

## Milestone 2: Marketplace & Item Listing

*Goal: Allow authenticated users to list items for sale and all users to view available items.*

- [ ] **API - Create Item**:
    - Create a server action in `src/app/sell/actions.ts`.
    - The `createItem` action should validate input and create a new `Item` record in the database, linked to the logged-in seller.
- [ ] **UI - Sell Page**:
    - Create `src/app/sell/page.tsx` with a form for `name`, `description`, and `price`.
    - The form should submit to the `createItem` server action.
- [ ] **API - List Items**:
    - In `src/app/page.tsx`, fetch all `Item` records where `purchasedById` is `null`.
- [ ] **UI - Marketplace**:
    - Create `src/components/ItemCard.tsx` to display an item's details.
    - On the main page (`page.tsx`), map over the fetched items and render an `ItemCard` for each.

**Acceptance Criteria:**
- A logged-in user can navigate to `/sell`, fill out the form, and create a new item listing.
- The new item appears on the homepage for all users.
- The homepage only displays items that have not been sold.

## Milestone 3: Transactions & User Profile

*Goal: Enable the core "purchase" functionality and provide users a page to view their assets.*

- [ ] **API - Purchase Item**:
    - Create a server action `purchaseItem` in `src/lib/actions.ts`.
    - This action must use `Prisma.$transaction` to ensure atomicity.
    - The transaction must:
        1. Verify the buyer has sufficient credits.
        2. Verify the item is not already sold.
        3. Verify the buyer is not the seller.
        4. Decrement the buyer's `credits`.
        5. Increment the seller's `credits`.
        6. Update the `Item` record to set the `purchasedById`.
        7. Create a `Purchase` record to log the transaction.
- [ ] **UI - Purchase Button**:
    - Add a "Buy" button to `src/components/ItemCard.tsx`.
    - This button should be disabled if the user is not logged in or is the seller.
    - Clicking the button invokes the `purchaseItem` server action.
- [ ] **UI - Profile Page**:
    - Create `src/app/profile/page.tsx`.
    - Fetch and display the current user's `credits`.
    - Fetch and display a list of items the user has listed for sale.
    - Fetch and display a list of items the user has purchased.

**Acceptance Criteria:**
- A user can click "Buy" on an item.
- The buyer's credits are debited, and the seller's credits are credited.
- The purchased item is removed from the main marketplace view.
- The user's profile page accurately reflects their credit balance and item history.
- The atomic transaction prevents double-spending or buying a sold item.

## Milestone 4: Future - AI Descriptions

*Goal: Add the optional AI-powered description generator.*

- [ ] **API - AI Action**:
    - Create a new server action, e.g., `generateDescription`.
    - This action will take a product name as input.
    - It will make a fetch call to an external AI service API (e.g., Google AI).
    - It will return the generated text.
- [ ] **UI - Integration**:
    - On the `/sell` page, add a "Generate Description" button next to the description field.
    - On click, call the `generateDescription` action and populate the textarea with the result.

**Acceptance Criteria:**
- Clicking the "Generate" button on the sell page fills the description field with AI-generated text.
