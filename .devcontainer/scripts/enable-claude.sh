#!/usr/bin/env bash
# Enable Anthropic Claude CLI for advanced scenarios
set -e

echo "🤖 Enabling Anthropic Claude CLI..."

# Install Claude CLI if not present
if ! command -v claude &> /dev/null; then
    echo "Installing Claude CLI..."
    npm install -g @anthropic-ai/claude-code || {
        echo "⚠️  Installation failed. Try manually: npm install -g @anthropic-ai/claude-code"
        exit 1
    }
    echo "✅ Claude CLI installed"
else
    echo "✅ Claude CLI already installed ($(claude --version 2>&1 | head -n1))"
fi

# Verify API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not set. Add it to your local environment."
    echo "   Get your key at: https://console.anthropic.com/"
    exit 1
else
    echo "✅ ANTHROPIC_API_KEY configured"
fi

echo ""
echo "✅ Anthropic Claude CLI ready!"
echo ""
echo "Usage:"
echo "  claude                         # Interactive mode"
echo "  claude 'explain this code'     # One-shot query"
echo "  claude --help                  # See all options"
echo ""
echo "Features:"
echo "  • Agentic coding tool in your terminal"
echo "  • Understands your codebase"
echo "  • Handles git workflows"
echo "  • Natural language commands"
