#!/usr/bin/env bash
set -eu

node --version
corepack enable
corepack prepare pnpm@latest --activate

pnpm config set store-dir /workspaces/.pnpm-store

npm i -g @google/gemini-cli || true

# Install Vercel CLI globally for deployment
echo "Installing Vercel CLI..."
npm i -g vercel || echo "⚠️  Vercel CLI install failed, can retry later"

# Auto-install Claude CLI if key present
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "✓ ANTHROPIC_API_KEY found - installing Claude CLI..."
  npm i -g @anthropic-ai/claude-code || echo "⚠️  Claude CLI install failed, can retry later"
else
  echo "⏸️  Claude CLI skipped (no ANTHROPIC_API_KEY)"
fi

# Auto-install advanced tools if API keys are present (smart lazy-loading)
echo "Checking for advanced tool API keys..."

if [ -n "$OPENAI_API_KEY" ]; then
  echo "✓ OPENAI_API_KEY found - installing OpenAI Codex CLI..."
  npm i -g @openai/codex || echo "⚠️  Codex install failed, can retry later"
else
  echo "⏸️  OpenAI Codex CLI skipped (no OPENAI_API_KEY)"
  echo "   Note: Codex can also use ChatGPT account login"
fi

# Note: Zen MCP and Serena MCP don't need installation, they're configured via devcontainer.json
# They'll auto-enable in Claude Code if API keys are present

if [ -f package.json ]; then
  echo "Skipping automatic pnpm install for faster boot. Run 'pnpm install' when ready."
fi

echo "Post-create complete."
