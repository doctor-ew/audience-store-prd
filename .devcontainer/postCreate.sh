#!/usr/bin/env bash
set -eu

node --version
corepack enable
corepack prepare pnpm@latest --activate

pnpm config set store-dir /workspaces/.pnpm-store

npm i -g @google/gemini-cli || true

if [ -f package.json ]; then
  echo "Skipping automatic pnpm install for faster boot. Run 'pnpm install' when ready."
fi

echo "Post-create complete."
