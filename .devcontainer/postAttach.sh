#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/workspaces/audience-store-prd}"
SERENA_PORT="${SERENA_PORT:-24282}"
DASH_PATH="/dashboard/"
SERENA_LOG="${HOME}/.serena-mcp.log"

# Ensure uvx is on PATH for the current shell
export PATH="$HOME/.local/bin:$PATH"

cat <<'EOM'

🧠 Welcome, Wizard. Quick start:
  1) pnpm install              # when you're ready to pull deps
  2) pnpm dev                  # start the app (once scripts exist)
  3) In Claude Code, ensure the 'serena' MCP server shows as connected
  4) Dashboard lives at: http://127.0.0.1:${SERENA_PORT}${DASH_PATH}

EOM

# Optionally warm Serena's index on attach (guarded by env)
if [ "${SERENA_INDEX_ON_ATTACH:-true}" = "true" ]; then
  if command -v uvx >/dev/null 2>&1 || [ -x "$HOME/.local/bin/uvx" ]; then
    echo "[postAttach] Warming Serena project index (first run may take a bit)..."
    if [ -x "$HOME/.local/bin/uvx" ]; then
      "$HOME/.local/bin/uvx" --from git+https://github.com/oraios/serena serena project index || true
    else
      uvx --from git+https://github.com/oraios/serena serena project index || true
    fi
  else
    echo "[postAttach] 'uvx' not on PATH yet; index warm-up skipped."
  fi
fi

# Auto-start Serena MCP server in the background (if requested)
if [ "${SERENA_AUTO_START:-true}" = "true" ]; then
  echo "[postAttach] Checking Serena MCP server status on port ${SERENA_PORT}..."
  NEED_START="yes"
  # Try a quick probe of the dashboard route
  if command -v curl >/dev/null 2>&1; then
    if curl -fsS "http://127.0.0.1:${SERENA_PORT}${DASH_PATH}" >/dev/null 2>&1; then
      NEED_START="no"
      echo "[postAttach] Serena dashboard is already responding."
    fi
  fi

  if [ "$NEED_START" = "yes" ]; then
    echo "[postAttach] Launching Serena MCP server in background... (logs: ${SERENA_LOG})"
    # Prefer full path to uvx
    if [ -x "$HOME/.local/bin/uvx" ]; then
      nohup "$HOME/.local/bin/uvx" --from git+https://github.com/oraios/serena serena start-mcp-server \
        --context ide-assistant --project "${PROJECT_DIR}" \
        > "${SERENA_LOG}" 2>&1 &
    else
      nohup uvx --from git+https://github.com/oraios/serena serena start-mcp-server \
        --context ide-assistant --project "${PROJECT_DIR}" \
        > "${SERENA_LOG}" 2>&1 &
    fi

    # Wait for server to come up (max ~25s)
    for i in $(seq 1 25); do
      if curl -fsS "http://127.0.0.1:${SERENA_PORT}${DASH_PATH}" >/dev/null 2>&1; then
        echo "[postAttach] Serena dashboard is up."
        break
      fi
      sleep 1
      if [ "$i" -eq 25 ]; then
        echo "[postAttach] Serena dashboard did not respond in time; tailing last 40 lines of log:"
        tail -n 40 "${SERENA_LOG}" || true
      fi
    done
  fi

  # Print a Codespaces-friendly URL hint
  if [ -n "${CODESPACE_NAME:-}" ]; then
    echo
    echo "[postAttach] Open dashboard at:"
    echo "  https://${CODESPACE_NAME}-${SERENA_PORT}.app.github.dev${DASH_PATH}"
    echo
  fi
fi

echo "Tips:"
echo "  - 'Serena' MCP is wired via uvx and will also be launched by the editor when needed."
echo "  - To run manually: uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project ${PROJECT_DIR}"
echo "  - Set SERENA_INDEX_ON_ATTACH=false or SERENA_AUTO_START=false to disable behaviors."
