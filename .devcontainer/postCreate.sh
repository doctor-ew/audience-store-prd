#!/usr/bin/env bash
set -euo pipefail

echo "[postCreate] Node:"
node --version || true

echo "[postCreate] Enabling corepack & pnpm..."
corepack enable
corepack prepare pnpm@latest --activate
pnpm config set store-dir /workspaces/.pnpm-store

echo "[postCreate] Installing Gemini CLI (optional)..."
npm i -g @google/gemini-cli || true

echo "[postCreate] Installing Astral uv (Python toolchain & runner for Serena)..."
curl -LsSf https://astral.sh/uv/install.sh | sh
# Ensure uv on PATH for login shells
if ! grep -q 'HOME/.local/bin' "$HOME/.profile" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.profile"
fi
if ! grep -q 'HOME/.local/bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi

echo "[postCreate] uv version:"
~/.local/bin/uv --version || uv --version || true

if [ -f package.json ]; then
  echo "[postCreate] Skipping automatic pnpm install for faster boot. Run 'pnpm install' when ready."
fi

echo "[postCreate] Done."
