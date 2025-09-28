# Acceptance Criteria: Audience Store

This document outlines the testable criteria for each milestone of the Audience Store application. Each item represents a verifiable feature or behavior that must be met for the milestone to be considered "DONE."

---

## Milestone 1: Project Setup & User Accounts

*Goal: Establish the project foundation and enable users to sign up, log in, and log out.*

### Setup & Deployment
- [ ] **Local Environment**: The application runs successfully using `npm run dev`.
- [ ] **Build**: The application builds without errors using `npm run build`.
- [ ] **Linting**: The codebase passes linting checks with `npm run lint`.
- [ ] **Deployment**: The application can be deployed to a Codespaces or Vercel environment and remains functional.

### User Signup
- [ ] **UI**: Visiting `/signup` displays a form with fields for `email` and `password`.
- [ ] **API (Success)**: Submitting a valid email and password to the form creates a new `User` record in the database.
- [ ] **DB Check**: The `User` record has a `passwordHash` that is not plaintext and a default `credits` value of 100.
- [ ] **API (Error)**: Attempting to sign up with an email that already exists returns an error message and does not create a new user.
- [ ] **UI**: After a successful signup, the user is redirected to the main marketplace page (`/`).

### User Login & Logout
- [ ] **UI**: Visiting `/login` displays a form with fields for `email` and `password`.
- [ ] **API (Success)**: Submitting correct credentials for an existing user establishes a session.
- [ ] **UI**: After logging in, the `Header` component updates to show the user's email and a "Logout" button.
- [ ] **API (Error)**: Submitting incorrect credentials displays an "Invalid credentials" error and does not log the user in.
- [ ] **UI**: Clicking the "Logout" button clears the user's session.
- [ ] **UI**: After logging out, the `Header` component reverts to showing "Login" and "Sign Up" links.

---

## Milestone 2: Marketplace & Item Listing

*Goal: Allow authenticated users to list items for sale and all users to view available items.*

### Item Creation
- [ ] **UI (Auth)**: A logged-in user can navigate to the `/sell` page to see a form for creating an item.
- [ ] **UI (No Auth)**: An unauthenticated user visiting `/sell` is redirected to the `/login` page.
- [ ] **UI**: The `/sell` page contains a form with fields for item `name`, `description`, and `price`.
- [ ] **API (Success)**: Submitting the form calls the `createItem` server action, creating a new `Item` record in the database linked to the seller's `userId`.
- [ ] **DB Check**: The new `Item` record has the correct `name`, `description`, `price`, and `sellerId`. Its `purchasedById` field is `null`.
- [ ] **API (Error)**: Submitting a form with invalid data (e.g., empty name, non-integer price) displays an error and does not create an item.

### Marketplace View
- [ ] **UI**: The homepage (`/`) displays a grid or list of all items where `purchasedById` is `null`.
- [ ] **UI**: Each `ItemCard` in the marketplace displays the item's `name`, `price`, and the `seller`'s email.
- [ ] **UI (Empty)**: If no items are available for sale, the marketplace displays a message like "No items for sale yet!"
- [ ] **UI (Sold Items)**: Items that have been sold **do not** appear in the main marketplace view.

---

## Milestone 3: Transactions & Account Page

*Goal: Enable the core "purchase" functionality and provide users a page to view their assets.*

### Item Purchase
- [ ] **UI**: A "Buy" button is visible on each `ItemCard` for logged-in users, unless the item belongs to them.
- [ ] **UI (Disabled)**: The "Buy" button is disabled or hidden if the user is not logged in.
- [ ] **UI (Disabled)**: The "Buy" button is disabled or hidden for an item listed by the current user.
- [ ] **API (Success)**: Clicking "Buy" on an available item successfully executes the `purchaseItem` transaction.
- [ ] **DB Check (Atomicity)**: After a successful purchase:
    - The buyer's `credits` are debited by the item `price`.
    - The seller's `credits` are credited by the item `price`.
    - The `Item`'s `purchasedById` is set to the buyer's ID.
    - A `Purchase` record is created linking the buyer, seller, and item.
- [ ] **API (Error - Insufficient Credits)**: If a user attempts to buy an item they cannot afford, the transaction fails, and a "You don't have enough credits" error is displayed. No database changes occur.
- [ ] **API (Error - Item Sold)**: If two users try to buy the same item, the first transaction succeeds, and the second one fails with an "Item is no longer available" error. The database correctly reflects only one sale.
- [ ] **UI**: After a successful purchase, the item is removed from the marketplace view.

### Account Page
- [ ] **UI (Auth)**: A logged-in user can navigate to `/profile`.
- [ ] **UI (No Auth)**: An unauthenticated user visiting `/profile` is redirected to `/login`.
- [ ] **UI**: The profile page displays the user's current `credit` balance.
- [ ] **UI**: The profile page displays a list of "Items I'm Selling" with their current status (Available/Sold).
- [ ] **UI**: The profile page displays a list of "Items I've Purchased."

---

## Milestone 4: Optional AI Enhancement

*Goal: Add the optional AI-powered description generator.*

- [ ] **UI**: A "Generate Description" button is present on the `/sell` page next to the `description` textarea.
- [ ] **API**: Clicking the button calls a server action that fetches a witty description from an external AI service.
- [ ] **UI**: The `description` textarea is populated with the AI-generated text.
- [ ] **Error Handling**: If the AI service call fails, a user-friendly error is shown, and the description field is not changed.