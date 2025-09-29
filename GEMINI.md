# GEMINI.md

## Project Overview

This is a Next.js project called "Audience Store," a teaching demo app. The project is set up to use Next.js 15, React 19, and TypeScript. It also includes Tailwind CSS for styling. The project is configured to be developed in a GitHub Codespaces environment, using pnpm and Prisma with SQLite for the database.

The goal of the project is to build a marketplace application with features like user accounts, a marketplace, and transactions. It also has a plan to incorporate AI for witty descriptions.

## Building and Running

To get started with the development environment, you'll need to have Node.js and pnpm installed.

**Running the development server:**

```bash
pnpm install
pnpm dev
```

This will start the development server on [http://localhost:3000](http://localhost:3000).

**Building the project:**

```bash
pnpm build
```

**Running tests:**

```bash
pnpm lint
```

## Development Conventions

*   **Framework:** The project uses the Next.js App Router, and the source code is located in the `src/` directory.
*   **Language:** The project is written in TypeScript.
*   **Styling:** Tailwind CSS is used for styling.
*   **Linting:** ESLint is set up to enforce code quality.
*   **Package Manager:** pnpm is the package manager for this project.
*   **Database:** The project uses Prisma with a SQLite database.
