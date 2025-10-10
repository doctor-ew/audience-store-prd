#!/usr/bin/env bash
set -eu

node --version
corepack enable
corepack prepare pnpm@latest --activate

pnpm config set store-dir /workspaces/.pnpm-store

npm i -g @google/gemini-cli || true

# Auto-install advanced tools if API keys are present (smart lazy-loading)
echo "Checking for advanced tool API keys..."

if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "✓ ANTHROPIC_API_KEY found - installing Codex CLI..."
  npm i -g @anthropic/codex-cli || echo "⚠️  Codex install failed, can retry later"
else
  echo "⏸️  Codex CLI skipped (no ANTHROPIC_API_KEY)"
fi

# Note: Zen MCP and Serena MCP don't need installation, they're configured via devcontainer.json
# They'll auto-enable in Claude Code if API keys are present

if [ -f package.json ]; then
  echo "Skipping automatic pnpm install for faster boot. Run 'pnpm install' when ready."
fi

echo "Post-create complete."
