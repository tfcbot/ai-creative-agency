# Install

## Claude Code (recommended)

Open Claude Code in any project and paste this:

> Install AI Creative Lab: run `git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-lab.git ~/.claude/skills/ai-creative-lab && cd ~/.claude/skills/ai-creative-lab && ./setup`, then add an "AI Creative Lab" section to CLAUDE.md listing the available skills: /clone-ad, /generate-carousel, /wide-cam-podcast.

Claude clones the repo, runs `setup`, and edits your `CLAUDE.md` so
future sessions know the skill commands. Setup takes ~30 seconds.

**Requirements:**
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Git](https://git-scm.com/)
- A `bash`-compatible shell (default on macOS / Linux)

## Cross-agent (Cursor, Codex, OpenCode, etc.)

Each skill is a plain `SKILL.md` plus its `recipes/` and `references/`
directories. Any AI agent that supports filesystem-discovered skills
can use them. Install via the [vercel-labs skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add tfcbot/ai-creative-lab
```

This copies every skill into the agent's local skills directory and
exposes them as flat slash commands (`/clone-ad`, `/generate-carousel`,
`/wide-cam-podcast`).

## Manual install

```bash
git clone https://github.com/tfcbot/ai-creative-lab.git ~/.claude/skills/ai-creative-lab
cd ~/.claude/skills/ai-creative-lab
./setup
```

## Configure API keys

Skills require provider API keys. See [`PROVIDERS.md`](PROVIDERS.md) for
the full list with signup links. Copy `.env.example` to `.env` in your
project working directory (not the repo root) and fill in the keys you
need.

Each skill validates its required keys before running and stops
gracefully with the signup link if any are missing — no partial runs.

## Update

```bash
cd ~/.claude/skills/ai-creative-lab && git pull
```

## Troubleshooting

**`./setup` reports "No SKILL.md files found"**
The clone may have failed. Re-run `git clone` and verify each
top-level directory has a `SKILL.md` inside.

**Slash commands don't appear in Claude Code**
Restart Claude Code after install. It scans `~/.claude/skills/` at
startup.

**A skill stops with "missing API key"**
Set the key listed in the error message. See
[`PROVIDERS.md`](PROVIDERS.md) for signup links.
