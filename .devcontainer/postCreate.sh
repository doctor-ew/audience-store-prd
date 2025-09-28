#!/usr/bin/env bash
set -eu

# Sanity
node --version
python3 --version || true
bun --version || true
gh --version || true

# PNPM
corepack enable
corepack prepare pnpm@latest --activate

# Gemini CLI (optional)
npm i -g @google/gemini-cli || true

# Install uv (Python tool manager) + put on PATH
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
if ! grep -q 'HOME/.local/bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi

# Install Spec-Kit (Specify CLI) from github/spec-kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify --version

# Project deps if present
if [ -f package.json ]; then
  pnpm install || true
fi
