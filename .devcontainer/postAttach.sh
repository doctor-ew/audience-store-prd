#!/usr/bin/env bash
set -e

# Show tool status
bash .devcontainer/scripts/status.sh

echo
echo "🎓 Workshop Environment Ready!"
echo "================================"
echo
echo "Basic workflow:"
echo "  1) gemini                    # Start with Gemini (already configured)"
echo "  2) pnpm install              # Install dependencies when needed"
echo "  3) pnpm dev                  # Start development server"
echo
echo "Advanced tools (lazy-loaded):"
echo "  • .devcontainer/scripts/enable-codex.sh    # Enable Anthropic Codex"
echo "  • .devcontainer/scripts/enable-zen.sh      # Enable Zen MCP (multi-model)"
echo "  • .devcontainer/scripts/enable-serena.sh   # Enable Serena MCP"
echo
echo "💡 Tip: Use VS Code Task Runner (Cmd+Shift+P → 'Tasks: Run Task') for one-click toggles"
echo
