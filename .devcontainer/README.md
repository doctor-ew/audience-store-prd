# Workshop Devcontainer

This devcontainer provides a **lean-by-default, powerful-when-needed** AI development environment for teaching.

## Philosophy

- **Default**: Fast boot with Gemini CLI for most demonstrations
- **On-demand**: Advanced tools (Codex, Zen MCP, Serena) load only when needed
- **Zero friction**: One-click enablement via VS Code tasks

## Default Environment

Out of the box, you get:

- ✅ **Node.js 20** with pnpm and Bun
- ✅ **Gemini CLI** pre-installed and configured
- ✅ **VS Code Extensions**: Gemini Code Assist, Claude Code, ESLint, Prettier
- ✅ **API Keys**: Automatically forwarded from local environment

## Advanced Tools (Lazy-Loaded)

### Codex CLI
**When to use**: Complex refactoring, multi-file analysis, advanced code generation

**Enable**:
```bash
.devcontainer/scripts/enable-codex.sh
```
Or: VS Code Task Runner → `🚀 Enable Codex`

**Usage**:
```bash
codex exec --prompt "Refactor this component for better testability"
codex analyze --file-path src/components/App.tsx
```

### Zen MCP
**When to use**: Multi-model collaboration, consensus building, deep analysis

**Enable**:
```bash
.devcontainer/scripts/enable-zen.sh
```
Or: VS Code Task Runner → `🧘 Enable Zen MCP`

**Usage**: Available through Claude Code MCP tools
- `chat` - Multi-model discussions
- `thinkdeep` - Complex problem analysis
- `consensus` - Architecture decisions with multiple AI perspectives
- `debug` - Systematic debugging with expert validation

### Serena MCP
**When to use**: Specialized AI workflows, custom model orchestration

**Enable**:
```bash
.devcontainer/scripts/enable-serena.sh
```
Or: VS Code Task Runner → `🎭 Enable Serena MCP`

**Configuration**: Already wired in `devcontainer.json` (removed from auto-start for lean boot)

## Quick Commands

### Check Tool Status
```bash
.devcontainer/scripts/status.sh
```
Or: VS Code Task Runner → `🔍 Check AI Tools Status`

### Enable Everything at Once
```bash
.devcontainer/scripts/enable-codex.sh
.devcontainer/scripts/enable-zen.sh
.devcontainer/scripts/enable-serena.sh
```
Or: VS Code Task Runner → `🛠️ Enable All Advanced Tools`

## Teaching Workflow

### Basic Lesson (90% of classes)
1. Open devcontainer
2. Use Gemini: `gemini`
3. Demonstrate with primary AI tool
4. Students follow along with identical setup

### Advanced Lesson (10% of classes)
1. Run: `🛠️ Enable All Advanced Tools` task
2. Demonstrate Codex refactoring OR Zen consensus building
3. Show multi-model collaboration
4. Students see optional "power user" capabilities

## VS Code Tasks

Access via `Cmd+Shift+P` → `Tasks: Run Task`:

- 🔍 **Check AI Tools Status** - See what's installed and configured
- 🚀 **Enable Codex** - Install and verify Codex CLI
- 🧘 **Enable Zen MCP** - Configure Zen for Claude Code
- 🎭 **Enable Serena MCP** - Validate Serena configuration
- 🛠️ **Enable All Advanced Tools** - One-click full setup

## Architecture Benefits

### ✅ Pros
- **Fast boot time**: Basic setup installs in seconds
- **Low resource usage**: Only Gemini runs by default
- **Smooth demos**: No container switching mid-presentation
- **Progressive complexity**: Introduce advanced tools gradually
- **Single source of truth**: One devcontainer to maintain

### ⚠️ Tradeoffs
- Slightly more complex initial setup than pure Gemini-only
- Students must learn which tools to enable when
- Advanced tools require manual enablement

## Maintenance

### Updating Tools
- **Gemini**: Update in `postCreate.sh` → `npm i -g @google/gemini-cli`
- **Codex**: Update in `enable-codex.sh` → `npm install -g @anthropic/codex-cli`
- **Node/Bun**: Update in `devcontainer.json` features

### Adding New Tools
1. Create `scripts/enable-<tool>.sh`
2. Add task to `.vscode/tasks.json`
3. Update `status.sh` to check for the tool
4. Document in this README

## Troubleshooting

### "Gemini not found"
```bash
npm i -g @google/gemini-cli
gemini # Log in when prompted
```

### "API key missing"
Add to your local environment (not in container):
```bash
export GEMINI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

### "Codex fails to install"
Check Node version: `node --version` (must be >= 18)
Try manual install: `npm install -g @anthropic/codex-cli`

### "MCP not showing in Claude Code"
1. Restart Claude Code extension
2. Check MCP settings in Claude Code UI
3. Verify API keys are forwarded to container

## Student Experience

### What Students See on First Boot
```
🔍 AI Tools Status
====================

Gemini CLI:
  ✅ Installed
  ✅ API key configured

Codex CLI:
  ⏸️  Not installed (run: .devcontainer/scripts/enable-codex.sh)

Zen MCP:
  ⏸️  Not configured (run: .devcontainer/scripts/enable-zen.sh)

Serena MCP:
  ✅ Configured in devcontainer.json
  ❌ API key missing

🎓 Workshop Environment Ready!
================================

Basic workflow:
  1) gemini                    # Start with Gemini
  2) pnpm install              # Install dependencies
  3) pnpm dev                  # Start development

Advanced tools (lazy-loaded):
  • .devcontainer/scripts/enable-codex.sh
  • .devcontainer/scripts/enable-zen.sh
  • .devcontainer/scripts/enable-serena.sh

💡 Tip: Use VS Code Task Runner for one-click toggles
```

### Progressive Learning Path
1. **Week 1-2**: Gemini basics, prompt engineering
2. **Week 3**: Introduction to Codex for refactoring
3. **Week 4**: Zen MCP for multi-model consensus
4. **Week 5**: Custom MCP integration (Serena)

## Files Structure

```
.devcontainer/
├── devcontainer.json          # Main configuration (lean by default)
├── postCreate.sh              # One-time setup (fast)
├── postAttach.sh              # Welcome message + status
├── scripts/
│   ├── enable-codex.sh        # Install Codex on demand
│   ├── enable-zen.sh          # Configure Zen MCP
│   ├── enable-serena.sh       # Validate Serena setup
│   └── status.sh              # Check all tool states
└── README.md                  # This file

.vscode/
└── tasks.json                 # One-click tool enablement
```

## Contributing

When adding new AI tools:
1. Follow the lazy-loading pattern
2. Add enable script to `scripts/`
3. Update `status.sh` with detection logic
4. Add VS Code task for one-click access
5. Document in this README

## License

MIT - Educational use encouraged
