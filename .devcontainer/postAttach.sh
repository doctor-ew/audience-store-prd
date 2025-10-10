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
echo "  2) claude                    # Or use Claude CLI"
echo "  3) pnpm install              # Install dependencies when needed"
echo "  4) pnpm dev                  # Start development server"
echo
echo "Advanced tools (lazy-loaded):"
echo "  • .devcontainer/scripts/enable-claude.sh       # Anthropic Claude CLI"
echo "  • .devcontainer/scripts/enable-codex.sh        # OpenAI Codex CLI"
echo "  • .devcontainer/scripts/enable-codex-sdk.sh    # Codex SDK (programmatic)"
echo "  • .devcontainer/scripts/enable-zen.sh          # Zen MCP (multi-model)"
echo "  • .devcontainer/scripts/enable-serena.sh       # Serena MCP"
echo
echo "💡 Tip: Use VS Code Task Runner (Cmd+Shift+P → 'Tasks: Run Task') for one-click toggles"
echo
