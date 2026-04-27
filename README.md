# AI Creative Agency

**An AI creative agency, run by your agent.** Researches niches and
trends, produces AI videos and carousels, clones winning ads, edits
captions and overlays, schedules and engages across 14 social
platforms, runs paid campaigns, and reports back — every skill is one
command your agent invokes on your behalf.

Built for the operator running AI content across brand, organic, paid,
theme pages, and clipping. Eighty skills across nine provider lanes.
BYOK, atomic, single-account, single-task.

## Install — 30 seconds

**Requirements:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Git](https://git-scm.com/), [Bun](https://bun.sh/) v1.0+

### Step 1: Install on your machine

Open Claude Code (CLI or Desktop) and paste this. `./setup` exposes
every bundled skill at the top of `~/.claude/skills/` so both Claude
Code variants discover them.

```text
Install AI Creative Agency:

git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-agency.git ~/.claude/skills/ai-creative-agency && cd ~/.claude/skills/ai-creative-agency && ./setup

Then read ~/.claude/skills/ai-creative-agency/AGENTS.md, ask me what I'm working on, and add an "AI Creative Agency" section to my CLAUDE.md listing only the slash commands relevant to that work. Finish by asking which providers I want to wire up first so we only set up the keys actually needed.
```

### Step 2: Set up your provider keys

Copy `.env.example` to `.env` in your project working directory and fill
in the keys for the providers you plan to use. Each skill validates its
keys before any provider call and stops gracefully with a signup link if
something is missing — you can install the repo with no keys, then add
them as you reach for skills.

```bash
cp ~/.claude/skills/ai-creative-agency/.env.example ./.env
```

See the provider table further down for signup links and what each one
covers.

See [`docs/INSTALL.md`](docs/INSTALL.md) for manual install and
troubleshooting.

### Supported agents

| Agent | How |
|---|---|
| Claude Code | clone into `~/.claude/skills/ai-creative-agency/` |
| Codex | `./setup --host codex` symlinks each skill into `~/.codex/skills/<slug>/` |
| OpenClaw | spawns Claude Code via ACP — Claude install covers it |
| Hermes | spawns Claude Code via ACP — Claude install covers it |

`./setup` with no flag auto-detects which hosts are installed and
registers with each. Use `--host <name>` to target one explicitly.

## Skill catalog

### Strategy & planning

- [`/channel-spec`](channel-spec/SKILL.md) — one-page channel spec (character, handle, format, audience)
- [`/content-calendar`](content-calendar/SKILL.md) — 30-day calendar from researched top formats
- [`/awareness-ladder`](awareness-ladder/SKILL.md) — content map by awareness level

### Research & intelligence

- [`/research-niche`](research-niche/SKILL.md) — top posts in a niche on a chosen platform
- [`/research-trends`](research-trends/SKILL.md) — trending hooks and formats clustered and ranked
- [`/research-creator`](research-creator/SKILL.md) — a creator's content patterns plus their outliers
- [`/research-hooks`](research-hooks/SKILL.md) — first-line hooks mined from N seed creators
- [`/scan-outliers`](scan-outliers/SKILL.md) — flag posts that beat a handle's median 3-4×
- [`/benchmark-account`](benchmark-account/SKILL.md) — your handle vs. competitors, side by side
- [`/research-ads-meta`](research-ads-meta/SKILL.md) — active ads from Meta Ad Library
- [`/research-ads-tiktok`](research-ads-tiktok/SKILL.md) — active ads on TikTok via top-tab search

### Analysis

- [`/breakdown-social-post`](breakdown-social-post/SKILL.md) — shot list + hook + prompt JSON for a post URL
- [`/breakdown-video`](breakdown-video/SKILL.md) — shot list + hook + prompt JSON for a local MP4
- [`/extract-hook`](extract-hook/SKILL.md) — first 3s clip + transcript + hook structure
- [`/extract-shot-list`](extract-shot-list/SKILL.md) — JSON shot list from frame-by-frame analysis
- [`/extract-caption-pattern`](extract-caption-pattern/SKILL.md) — caption format/length/CTA patterns
- [`/transcribe-video`](transcribe-video/SKILL.md) — word-level transcript
- [`/score-thumbnail`](score-thumbnail/SKILL.md) — score + critique for a thumbnail
- [`/score-hook`](score-hook/SKILL.md) — hook strength score + suggestions

### Production

- [`/clone-ad`](clone-ad/SKILL.md) — 15s AI clone of a reference ad for your product
- [`/generate-video`](generate-video/SKILL.md) — one AI video from an idea (Seedance 2.0 / Kling 3.0 / Sora 2)
- [`/generate-image`](generate-image/SKILL.md) — one AI image from an idea (Nano Banana 2 / GPT-Image 2)
- [`/hyperreal-image`](hyperreal-image/SKILL.md) — photorealistic image that doesn't read as AI (Nano Banana 2 with skin/eyes/hair micro-rules + standard negative prompt)
- [`/hyperreal-video`](hyperreal-video/SKILL.md) — photorealistic video locked to a start image (Kling 3.0 default, image-to-video only, subtle motion vocabulary)
- [`/generate-carousel`](generate-carousel/SKILL.md) — 3–10 slide Instagram carousel
- [`/wide-cam-podcast`](wide-cam-podcast/SKILL.md) — ~60s wide-cam two-host AI podcast clip
- [`/generate-talking-head`](generate-talking-head/SKILL.md) — talking-head UGC clip from character + script

### Voice

- [`/clone-voice`](clone-voice/SKILL.md) — clone a voice from a sample
- [`/swap-voice`](swap-voice/SKILL.md) — swap a video's voice via ElevenLabs STS

### Editing

- [`/add-captions`](add-captions/SKILL.md) — burn animated captions (Captions.ai / Mirage)
- [`/add-overlay`](add-overlay/SKILL.md) — burn a text overlay (VidJutsu)
- [`/add-disclaimer`](add-disclaimer/SKILL.md) — burn an FTC fine-print disclaimer (VidJutsu)
- [`/concat-clips`](concat-clips/SKILL.md) — concatenate clips into one MP4 (ffmpeg)
- [`/trim-clip`](trim-clip/SKILL.md) — trim a video to in/out timestamps
- [`/resize-clip`](resize-clip/SKILL.md) — reformat to a target aspect ratio
- [`/extract-frame`](extract-frame/SKILL.md) — extract a PNG frame at a timestamp
- [`/extend-clip`](extend-clip/SKILL.md) — extend a clip from its last frame (Wavespeed)

### Compliance

- [`/compliance-check`](compliance-check/SKILL.md) — TOS risk score + cited clauses for a video
- [`/compliance-check-copy`](compliance-check-copy/SKILL.md) — TOS scan for caption/copy text
- [`/audit-claims`](audit-claims/SKILL.md) — flag risky claims in copy
- [`/check-vidlang-spec`](check-vidlang-spec/SKILL.md) — validate a VidLang spec

### Account ops — TokPortal lane (managed accounts)

> Rented distribution surfaces. Provisioned by TokPortal, managed by an
> external operator. **Cannot be logged into** — no engagement, no Ads
> Manager, no OAuth handoff.

- [`/create-instagram-page`](create-instagram-page/SKILL.md) — provision a managed Instagram account
- [`/create-tiktok-page`](create-tiktok-page/SKILL.md) — provision a managed TikTok account
- [`/create-youtube-channel`](create-youtube-channel/SKILL.md) — provision a managed YouTube channel
- [`/warm-account`](warm-account/SKILL.md) — niche warming (7 credits)
- [`/deep-warm-account`](deep-warm-account/SKILL.md) — deep warming (40 credits)
- [`/configure-managed-account`](configure-managed-account/SKILL.md) — set bio, link, image
- [`/get-managed-account-analytics`](get-managed-account-analytics/SKILL.md) — account + per-video metrics

### Account ops — Zernio lane (connected accounts)

> Owned distribution surfaces. Connected via OAuth. Full marketing
> automation surface attaches once connected.

- [`/connect-account`](connect-account/SKILL.md) — initiate OAuth, return auth URL
- [`/audit-account-health`](audit-account-health/SKILL.md) — token + permissions report

### Publishing — TokPortal lane (slot-based)

- [`/post-via-slots`](post-via-slots/SKILL.md) — publish to a managed account via the slot model
- [`/schedule-via-slots`](schedule-via-slots/SKILL.md) — schedule a slot-based post
- [`/import-videos-csv`](import-videos-csv/SKILL.md) — bulk-fill slots from a CSV

### Publishing — Zernio lane (14 platforms)

- [`/publish-post`](publish-post/SKILL.md) — immediate post on a connected account
- [`/schedule-posts`](schedule-posts/SKILL.md) — scheduled post on a connected account
- [`/schedule-optimal`](schedule-optimal/SKILL.md) — schedule at the next optimal slot
- [`/draft-caption`](draft-caption/SKILL.md) — caption draft from video + niche
- [`/draft-hashtags`](draft-hashtags/SKILL.md) — ranked hashtag list for a niche

### Engagement — Zernio lane

- [`/get-comments`](get-comments/SKILL.md) — pull comments on a post
- [`/reply-comments`](reply-comments/SKILL.md) — reply to a list of comments
- [`/send-dm`](send-dm/SKILL.md) — send a DM from a connected account
- [`/setup-comment-dm-funnel`](setup-comment-dm-funnel/SKILL.md) — keyword → DM automation (IG/FB)
- [`/run-dm-sequence`](run-dm-sequence/SKILL.md) — enroll contacts in a multi-step DM sequence

### Paid ads — Zernio lane

- [`/create-ads`](create-ads/SKILL.md) — campaign + ad set + ad with creative
- [`/duplicate-ad-with-variant`](duplicate-ad-with-variant/SKILL.md) — duplicate an ad with a new creative
- [`/pause-ads`](pause-ads/SKILL.md) — bulk-pause up to 50 campaigns
- [`/get-ad-performance`](get-ad-performance/SKILL.md) — ad analytics + breakdowns
- [`/ads-performance-report`](ads-performance-report/SKILL.md) — CPL/CAC/ROAS report
- [`/diagnose-ads-account`](diagnose-ads-account/SKILL.md) — funnel constraint diagnosis
- [`/create-custom-audience`](create-custom-audience/SKILL.md) — Meta/Google/TikTok/Pinterest audience
- [`/upload-customer-list`](upload-customer-list/SKILL.md) — upload a server-hashed PII list
- [`/create-lookalike`](create-lookalike/SKILL.md) — lookalike from a source audience
- [`/send-conversion-event`](send-conversion-event/SKILL.md) — Meta CAPI / Google Conversions

### Analytics & reporting

- [`/pull-analytics`](pull-analytics/SKILL.md) — post analytics by ID or account range
- [`/weekly-report`](weekly-report/SKILL.md) — weekly winners + losers
- [`/diagnose-flop`](diagnose-flop/SKILL.md) — underperformance hypothesis vs. handle baseline
- [`/iterate-on-winners`](iterate-on-winners/SKILL.md) — next-round briefs from top performers
- [`/clip-performance-report`](clip-performance-report/SKILL.md) — clip leaderboard by reach + clicks
- [`/follower-history`](follower-history/SKILL.md) — daily follower-count series

### Clipping pipeline

- [`/download-post-video`](download-post-video/SKILL.md) — fetch a post's MP4 by URL
- [`/download-post`](download-post/SKILL.md) — MP4 + metadata JSON
- [`/download-youtube-video`](download-youtube-video/SKILL.md) — YouTube video by URL or ID
- [`/cut-clip`](cut-clip/SKILL.md) — cut a clip at in/out timestamps
- [`/find-clip-moments`](find-clip-moments/SKILL.md) — rank clip-worthy moments in long-form

## Two account lanes

The toolkit operates against two distinct ownership models. They never
merge.

| Lane | Lane shape | Use case |
|---|---|---|
| **TokPortal** | Managed accounts you don't log into. Slot-based posting only. No engagement. No paid ads. | Theme pages, fresh-account farms, satellite distribution. |
| **Zernio** | Brand-owned accounts connected via OAuth. Full surface — 14-platform publishing, engagement, paid ads, audiences, CAPI. | Your own accounts or your client's accounts. |

A TokPortal-provisioned account never becomes a Zernio-connected account.
Same content can ship to both lanes; each lane is operated independently.

## Environment variables

Skills are BYOK — bring your own keys. Copy `.env.example` to `.env` in
your project working directory and fill in the keys for the providers
you actually use. You can install with zero keys and add them as you
reach for skills; each skill validates its required keys before any
provider call and stops gracefully with the signup link if something
is missing — no partial runs that burn credits.

```bash
cp ~/.claude/skills/ai-creative-agency/.env.example ./.env
```

| Variable | Provider | What it unlocks |
|---|---|---|
| `WAVESPEED_API_KEY` | [Wavespeed](https://wavespeed.ai) | Video + image generation (Seedance 2.0, Nano Banana 2, gpt-image-2, Kling) — production and editing skills |
| `VIDJUTSU_API_KEY` | [VidJutsu](https://vidjutsu.ai) | Visual QA, compliance, transcribe, overlay/disclaimer burn, CDN — analysis, compliance, editing skills |
| `SCRAPE_CREATORS_API_KEY` | [Scrape Creators](https://scrapecreators.com) | Reference + research fetching across TikTok, IG, YouTube, X, Reddit, Pinterest, ad libraries — research, analysis, clipping skills |
| `ZERNIO_API_KEY` | [Zernio](https://zernio.com) | Publishing (14 platforms), engagement, paid ads, analytics, audiences — connected-account lane |
| `TOKPORTAL_API_KEY` | [TokPortal](https://tokportal.com) | Managed account provisioning, warming, slot-based posting — managed-account lane |
| `ELEVENLABS_API_KEY` | [ElevenLabs](https://elevenlabs.io) | TTS, voice clone, speech-to-speech — voice and production skills |
| `CAPTIONS_API_KEY` | [Captions.ai (Mirage)](https://captions.ai) | Animated captions burn — `add-captions` |
| `GEMINI_API_KEY` | [Gemini](https://ai.google.dev) | Video analysis, prompt synthesis, structured outputs — used throughout |
| _(none)_ | `ffmpeg` (local) | Concat, trim, resize, frame extract — install via `brew install ffmpeg` |

**Where to put `.env`** — in the working directory you're running the
skill from, *not* in the cloned repo. The repo is shared across
projects; `.env` is per-project so different brands or clients can use
different keys.

Each skill's `SKILL.md` declares which env vars it needs in frontmatter
and links the relevant `llms.txt` so the agent can fetch the current
API surface at runtime.

See [`docs/PROVIDERS.md`](docs/PROVIDERS.md) for full signup links,
expected costs per call, and `llms.txt` URLs.

## Layout

Each top-level directory is one skill:

```
<skill>/
├── SKILL.md            # Entry point — Claude reads this
├── recipes/            # (optional) numbered step-by-step procedures
└── references/         # (optional) provider docs, schemas, rules
```

The 3 production skills (`clone-ad`, `generate-carousel`,
`wide-cam-podcast`) include `recipes/` and `references/`. The other 77
are flat `SKILL.md` scaffolds — intent + provider pointer — and the
agent figures out the calls from each provider's `llms.txt`.

## Contributing

Read [`ETHOS.md`](ETHOS.md) before adding a skill. The eight principles:
finished-output atomicity, self-contained, verb-first naming, locked
provider stack, cost transparency, key validation, output conventions,
one-skill-per-release.

[`CLAUDE.md`](CLAUDE.md) has the SKILL.md frontmatter schema and editing
rules. [`AGENTS.md`](AGENTS.md) lists every skill grouped by section.

## License

[Apache 2.0](LICENSE).
