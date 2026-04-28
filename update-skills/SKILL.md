---
name: update-skills
description: Update the AI Creative Agency skill pack to the latest version. Pulls the repo, links any newly added skills via the setup script, and surfaces a short "what's new" summary from the git log so the user knows what changed since their last update. Use when the user asks to update, upgrade, refresh, or sync their AI Creative Agency skills, or wants to know what's new in the pack.
requires:
  env: []
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# update-skills

Pull the latest skill pack, link any newly added skills, summarize what changed.

## When to invoke

- The user asks to "update", "upgrade", "refresh", or "sync" their AI Creative Agency skills
- The user asks "what's new" in the agency pack
- The user wants to install a skill they saw mentioned but doesn't have locally yet — chances are it shipped after their last update

## Required environment variables

None. This skill only uses local git and shell.

## What it does

1. Resolves the repo path (`~/.claude/skills/ai-creative-agency` is the canonical install location, but the user may have cloned elsewhere — fall back to the directory containing this skill)
2. Captures the current `HEAD` commit so we can diff against it
3. Runs `git pull --ff-only` — refuses to merge if the user has local changes, surfaces them instead so nothing is silently overwritten
4. Runs `./setup` — idempotent, only links newly added skills, skips anything already linked
5. Diffs the new `HEAD` against the captured starting commit to list what skills were added/edited/removed
6. Surfaces a short "what's new" summary to the user
7. Reminds the user to restart Claude Code or run `/reload-plugins` so new slash commands appear in the current session

## The procedure

Run these commands in order. Capture stdout/stderr from each. Surface a final summary, not the raw command logs.

```bash
# 1. Find the repo
REPO="$HOME/.claude/skills/ai-creative-agency"
if [ ! -d "$REPO/.git" ]; then
  # fall back to the directory containing this skill
  REPO="$(cd "$(dirname "$0")/.." && pwd)"
fi
cd "$REPO"

# 2. Heal the single-branch refspec trap
# Older installs used `git clone --single-branch --depth 1` which sets
# remote.origin.fetch to a single-branch refspec. That breaks every future
# update because origin/main never gets created locally. Detect and fix.
FETCH_REFSPEC="$(git config --get remote.origin.fetch || true)"
if [ "$FETCH_REFSPEC" != "+refs/heads/*:refs/remotes/origin/*" ]; then
  git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
  echo "Fixed single-branch fetch refspec."
fi

# 3. Capture the starting commit (may not exist on a freshly-healed clone)
BEFORE="$(git rev-parse HEAD 2>/dev/null || echo '')"

# 4. Refuse to update if the user has uncommitted local changes
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "⚠️  Local changes detected in $REPO. Stash or commit them first, then re-run /update-skills."
  exit 1
fi

# 5. Fetch all branches so origin/main exists
git fetch origin

# 6. Fast-forward only — don't silently merge
git pull --ff-only

# 5. Idempotent re-link to pick up new skills
./setup

# 6. Diff the new HEAD against the starting commit
AFTER="$(git rev-parse HEAD)"
if [ "$BEFORE" = "$AFTER" ]; then
  echo "Already up to date. No new commits."
else
  echo "Updated: $BEFORE → $AFTER"
  echo
  echo "New / changed skills:"
  git diff --name-status "$BEFORE..$AFTER" -- '*/SKILL.md' | sed 's|/SKILL.md||' | sort -u
  echo
  echo "Recent commits:"
  git log --oneline "$BEFORE..$AFTER"
fi
```

## Output

Surface a tight summary to the user, not raw shell output:

```
✅ AI Creative Agency updated.

  <N> skills added
  <M> skills changed

New skills available:
  /<skill-name> — <one-line description from frontmatter>
  /<skill-name> — <one-line description from frontmatter>

Restart Claude Code or run /reload-plugins to use new slash commands in this session.
```

If the repo was already at HEAD:

```
✅ AI Creative Agency is up to date.
   Last commit: <short sha> — <commit subject>
```

If the user had uncommitted local changes, stop early with the warning above and don't pull.

## Style guardrails

- **`--ff-only` is mandatory.** Never use a merge or rebase pull. The user may have a fork or local edits we shouldn't overwrite. If fast-forward fails, surface the conflict and stop.
- **Never run `git stash` automatically.** Stashing user work without their say-so is destructive. Tell them to handle it themselves.
- **Never re-clone the repo.** A failed pull is a signal to investigate, not to nuke and start over.
- **Don't run `./setup --force` or anything destructive.** Plain `./setup` is idempotent and respects existing top-level entries owned by other packs (per ETHOS).
- **Surface the new-skills list, not just commit subjects.** The user cares what they got, not what someone named the commit.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `not a git repository` | User installed via tarball or copied files | Tell them to re-install via the cloned-repo path in `docs/INSTALL.md` |
| `Local changes detected` | User edited a SKILL.md or recipe locally | Either stash/commit those changes, or `git checkout -- <file>` to discard them, then re-run |
| `fatal: Not possible to fast-forward` | Local commits diverge from remote | User has a fork or made local commits. Tell them to rebase manually. Don't auto-merge. |
| `./setup` reports "No SKILL.md files found" | Pull worked but the working tree is incomplete | Likely a corrupt clone. Re-clone per `docs/INSTALL.md`. |
| Slash commands don't appear after update | Claude Code has cached the skill list from session start | Restart Claude Code or run `/reload-plugins` |

## Cost

Free. Local git operation, no provider calls.
