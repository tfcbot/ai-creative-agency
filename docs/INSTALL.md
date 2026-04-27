# Install

## Claude Code (recommended)

Open Claude Code in any project and paste this:

```text
Install AI Creative Agency:

git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-agency.git ~/.claude/skills/ai-creative-agency && cd ~/.claude/skills/ai-creative-agency && ./setup

Then read ~/.claude/skills/ai-creative-agency/AGENTS.md, ask me what I'm working on, and add an "AI Creative Agency" section to my CLAUDE.md listing only the slash commands relevant to that work. Finish by asking which providers I want to wire up first so we only set up the keys actually needed.
```

Claude clones the repo, runs `setup`, and edits your `CLAUDE.md` so
future sessions know the skill commands. Setup takes ~30 seconds.

**Requirements:**
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Git](https://git-scm.com/)
- A `bash`-compatible shell (default on macOS / Linux)

## Codex

Codex is supported via prefixed symlinks. After cloning the repo
anywhere on disk, run:

```bash
./setup --host codex
```

This creates `~/.codex/skills/aca-<slug>/` symlinks for all 80 skills,
each pointing at the corresponding source directory in the cloned repo.
The `aca-` prefix avoids collisions with other skill packs you may have
installed.

Run `./setup` with no flag to auto-detect installed hosts (Claude Code
and/or Codex) and register with each.

Update with `cd <repo> && git pull` — symlinks pick up changes
automatically.

## OpenClaw and Hermes

OpenClaw and Hermes spawn Claude Code sessions via ACP, so installing
with `--host claude` (or `auto`) makes every skill available in those
agents transparently. There is no separate setup.

## Manual install

```bash
git clone https://github.com/tfcbot/ai-creative-agency.git ~/.claude/skills/ai-creative-agency
cd ~/.claude/skills/ai-creative-agency
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
cd ~/.claude/skills/ai-creative-agency && git pull
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
