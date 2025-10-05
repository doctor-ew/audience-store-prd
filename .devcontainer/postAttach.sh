#!/usr/bin/env bash
set -euo pipefail

echo
echo "🧠 Welcome, Wizard. Quick start:"
echo "  1) pnpm install              # when you're ready to pull deps"
echo "  2) pnpm dev                  # start the app (once scripts exist)"
echo "  3) Open the 'Serena Dashboard' forwarded port if it auto-opens"
echo "  4) In Claude Code, ensure the 'serena' MCP server shows as connected"
echo

# Optionally warm Serena's index on attach (guarded by env)
if [ "${SERENA_INDEX_ON_ATTACH:-true}" = "true" ]; then
  if command -v uvx >/dev/null 2>&1 || [ -x "$HOME/.local/bin/uvx" ]; then
    echo "[postAttach] Warming Serena project index (first run may take a bit)..."
    # Prefer full path in case PATH not reloaded yet
    if [ -x "$HOME/.local/bin/uvx" ]; then
      "$HOME/.local/bin/uvx" --from git+https://github.com/oraios/serena serena project index || true
    else
      uvx --from git+https://github.com/oraios/serena serena project index || true
    fi
  else
    echo "[postAttach] 'uvx' not on PATH yet; index warm-up skipped."
  fi
fi

echo
echo "Tips:"
echo "  - 'Serena' MCP is wired via uvx; the editor launches it as needed."
echo "  - To run manually: uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)"
echo "  - Set SERENA_INDEX_ON_ATTACH=false to skip index warm-up on attach."
echo
