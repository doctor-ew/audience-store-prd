#!/usr/bin/env bash
# Enable Serena MCP for advanced AI workflows
set -e

echo "🎭 Enabling Serena MCP..."

# Serena is already configured in devcontainer.json
# This script validates the setup and provides usage info

if grep -q "serena-mcp" .devcontainer/devcontainer.json 2>/dev/null; then
    echo "✓ Serena MCP configured in devcontainer.json"
else
    echo "❌ Serena MCP configuration not found"
    exit 1
fi

# Check if running in container
if [ ! -f /.dockerenv ] && [ ! -f /run/.containerenv ]; then
    echo "⚠️  Not in container. Serena MCP auto-starts in VS Code devcontainer."
    exit 0
fi

# Verify API keys
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set (default model: gpt-4o-mini)"
    exit 1
fi

echo "✅ Serena MCP ready!"
echo "   Model: ${SERENA_DEFAULT_MODEL:-gpt-4o-mini}"
echo "   Use via Claude Code or supported AI tools"
