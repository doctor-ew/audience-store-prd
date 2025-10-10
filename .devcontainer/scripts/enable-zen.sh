#!/usr/bin/env bash
# Enable Zen MCP server for multi-model orchestration
set -e

echo "🧘 Enabling Zen MCP..."

# Check if Zen MCP is already configured in Claude Code
if grep -q "zen" ~/.config/claude-code/mcp_settings.json 2>/dev/null; then
    echo "✓ Zen MCP already configured in Claude Code"
else
    echo "⚠️  Zen MCP not found in Claude Code settings."
    echo "   To add manually:"
    echo "   1. Open Claude Code settings"
    echo "   2. Add Zen MCP server configuration"
    echo "   3. Restart Claude Code"
fi

# Verify API keys for multi-model access
missing_keys=()
[ -z "$ANTHROPIC_API_KEY" ] && missing_keys+=("ANTHROPIC_API_KEY")
[ -z "$OPENAI_API_KEY" ] && missing_keys+=("OPENAI_API_KEY")
[ -z "$GEMINI_API_KEY" ] && missing_keys+=("GEMINI_API_KEY")

if [ ${#missing_keys[@]} -gt 0 ]; then
    echo "⚠️  Missing API keys: ${missing_keys[*]}"
    echo "   Add them to your local environment for full Zen functionality"
fi

echo "✅ Zen MCP environment ready!"
echo "   Use zen tools in Claude Code: chat, thinkdeep, consensus, etc."
