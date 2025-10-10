#!/usr/bin/env bash
# Enable Codex AI for advanced scenarios
set -e

echo "🚀 Enabling Codex AI..."

# Install Codex CLI if not present
if ! command -v codex &> /dev/null; then
    echo "Installing Codex CLI..."
    npm install -g @anthropic/codex-cli || {
        echo "⚠️  Installation failed. Try manually: npm install -g @anthropic/codex-cli"
        exit 1
    }
else
    echo "✓ Codex CLI already installed"
fi

# Verify API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not set. Add it to your local environment."
    exit 1
fi

echo "✅ Codex enabled and ready!"
echo "   Try: codex exec --prompt 'Analyze this codebase architecture'"
