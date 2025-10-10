#!/usr/bin/env bash
# Enable OpenAI Codex CLI for advanced scenarios
set -e

echo "🚀 Enabling OpenAI Codex CLI..."

# Install Codex CLI if not present
if ! command -v codex &> /dev/null; then
    echo "Installing OpenAI Codex CLI..."
    npm install -g @openai/codex || {
        echo "⚠️  Installation failed. Try manually: npm install -g @openai/codex"
        exit 1
    }
    echo "✅ Codex CLI installed"
else
    echo "✅ Codex CLI already installed ($(codex --version 2>&1 | head -n1))"
fi

# Verify API key or ChatGPT account
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set (optional - can also login with ChatGPT account)"
    echo "   First run: codex (will prompt for ChatGPT login)"
else
    echo "✅ OPENAI_API_KEY configured"
fi

echo ""
echo "✅ OpenAI Codex CLI ready!"
echo ""
echo "Usage:"
echo "  codex                          # Interactive mode"
echo "  codex exec 'analyze this code' # Non-interactive"
echo "  codex --help                   # See all options"
echo ""
echo "Authentication:"
echo "  • ChatGPT account (Plus/Pro/Team/Enterprise)"
echo "  • Or set OPENAI_API_KEY environment variable"
