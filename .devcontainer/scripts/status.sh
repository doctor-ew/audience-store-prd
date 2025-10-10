#!/usr/bin/env bash
# Show status of all AI tools in the environment
set -e

echo "🔍 AI Tools Status"
echo "===================="
echo

# Gemini CLI
echo "Gemini CLI:"
if command -v gemini &> /dev/null; then
    echo "  ✅ Installed ($(gemini --version 2>&1 | head -n1))"
    [ -n "$GEMINI_API_KEY" ] && echo "  ✅ API key configured" || echo "  ❌ API key missing"
else
    echo "  ❌ Not installed"
fi
echo

# Claude CLI
echo "Claude CLI:"
if command -v claude &> /dev/null; then
    echo "  ✅ Installed ($(claude --version 2>&1 | head -n1))"
    [ -n "$ANTHROPIC_API_KEY" ] && echo "  ✅ API key configured" || echo "  ❌ API key missing"
else
    echo "  ⏸️  Not installed (run: .devcontainer/scripts/enable-claude.sh)"
fi
echo

# OpenAI Codex CLI
echo "OpenAI Codex CLI:"
if command -v codex &> /dev/null; then
    echo "  ✅ Installed ($(codex --version 2>&1 | head -n1))"
    if [ -n "$OPENAI_API_KEY" ]; then
        echo "  ✅ API key configured"
    else
        echo "  ⚠️  No API key (can use ChatGPT account login)"
    fi
else
    echo "  ⏸️  Not installed (run: .devcontainer/scripts/enable-codex.sh)"
fi
echo

# Zen MCP
echo "Zen MCP:"
if grep -q "zen" ~/.config/claude-code/mcp_settings.json 2>/dev/null; then
    echo "  ✅ Configured in Claude Code"
else
    echo "  ⏸️  Not configured (run: .devcontainer/scripts/enable-zen.sh)"
fi
echo

# Serena MCP
echo "Serena MCP:"
if grep -q "serena-mcp" .devcontainer/devcontainer.json 2>/dev/null; then
    echo "  ✅ Configured in devcontainer.json"
    [ -n "$OPENAI_API_KEY" ] && echo "  ✅ API key configured" || echo "  ❌ API key missing"
else
    echo "  ❌ Not configured"
fi
echo

# VS Code Extensions
echo "VS Code Extensions:"
if command -v code &> /dev/null; then
    extensions=("Google.geminicodeassist" "anthropic.claude-code")
    for ext in "${extensions[@]}"; do
        if code --list-extensions 2>/dev/null | grep -q "$ext"; then
            echo "  ✅ $ext"
        else
            echo "  ⏸️  $ext (not installed)"
        fi
    done
else
    echo "  ⚠️  code CLI not available"
fi
echo

echo "💡 Tip: Run scripts in .devcontainer/scripts/ to enable advanced tools"
