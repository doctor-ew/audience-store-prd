#!/usr/bin/env bash
# Add OpenAI Codex SDK to project for programmatic control
set -e

echo "📦 Adding OpenAI Codex SDK..."

# Check if we're in a Node.js project
if [ ! -f "package.json" ]; then
    echo "❌ No package.json found. This script adds Codex SDK to your project dependencies."
    echo "   For CLI usage, run: .devcontainer/scripts/enable-codex.sh"
    exit 1
fi

# Install Codex SDK
echo "Installing @openai/codex-sdk..."
pnpm add @openai/codex-sdk || npm install @openai/codex-sdk || {
    echo "⚠️  Installation failed. Try manually: pnpm add @openai/codex-sdk"
    exit 1
}

echo "✅ Codex SDK installed"

# Verify API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set. Add it to your environment or .env file"
else
    echo "✅ OPENAI_API_KEY configured"
fi

echo ""
echo "✅ OpenAI Codex SDK ready!"
echo ""
echo "Usage in TypeScript/JavaScript:"
echo '```typescript'
echo 'import { Codex } from "@openai/codex-sdk";'
echo ''
echo 'const codex = new Codex();'
echo 'const thread = codex.startThread();'
echo 'const result = await thread.run("Fix CI failures");'
echo '```'
echo ""
echo "Use cases:"
echo "  • CI/CD pipeline integration"
echo "  • Custom agents and workflows"
echo "  • Embedding Codex in your applications"
