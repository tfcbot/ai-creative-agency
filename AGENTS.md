# AI Creative Agency — Workflows

Claude Code skills for AI video creation. Each skill is one
end-to-end workflow that ships a finished output.

## Skills

### Production (shipped)

| Slash command | What it ships |
|---|---|
| `/clone-ad` | 15-second AI clone of a reference ad for your own product. Reference fetched (Scrape Creators) or local MP4, analyzed (Gemini), shot list rewritten for the product, generated (Wavespeed Nano Banana 2 + Seedance 2.0), verified against the reference's shot density. |
| `/generate-carousel` | 3–10 slide Instagram carousel. Niche research, format pattern detection, slide JSON specs, single-pass image generation (Wavespeed gpt-image-2) with typography baked in, caption draft, publish or save as drafts (Zernio). |
| `/wide-cam-podcast` | ~60-second wide-cam two-host AI podcast clip. Characters and set defined as JSON, starting frames generated (Wavespeed gpt-image-2 or Nano Banana 2), clips generated (Seedance 2.0), optional VidJutsu compliance scan, fine-print disclaimer burn. |
| `/generate-talking-head` | Talking-head UGC clip from a character spec and a script — start frame (Nano Banana 2), voiceover (ElevenLabs), lip-synced clip (Kling). |

### Research & intelligence

| Slash command | What it ships |
|---|---|
| `/research-niche` | Top posts in a niche on a chosen platform with a format/hook summary. |
| `/research-trends` | Trending hooks and formats clustered and ranked. |
| `/research-creator` | A creator's content patterns plus their outliers. |
| `/research-hooks` | Ranked first-line hooks mined from N seed creators. |
| `/scan-outliers` | A handle's posts that beat their median engagement by 3-4×. |
| `/benchmark-account` | Side-by-side metrics — your handle vs. a list of competitors. |
| `/research-ads-meta` | Active ads from Meta Ad Library by keyword or company. |
| `/research-ads-tiktok` | Active ads on TikTok via top-tab keyword search. |

### Analysis

| Slash command | What it ships |
|---|---|
| `/breakdown-social-post` | Shot list, hook, and prompt JSON for a post by URL. |
| `/breakdown-video` | Shot list, hook, and prompt JSON for a local MP4. |
| `/extract-hook` | The first 3 seconds of a video plus a hook structure breakdown. |
| `/extract-shot-list` | A JSON shot list from frame-by-frame video analysis. |
| `/extract-caption-pattern` | Caption format, length, and CTA patterns for a creator. |
| `/transcribe-video` | Word-level transcript of a video. |
| `/score-thumbnail` | Score plus critique of a thumbnail. |
| `/score-hook` | Hook strength score and suggestions for the first 3 seconds. |

### Voice

| Slash command | What it ships |
|---|---|
| `/clone-voice` | Voice ID for a cloned voice from an audio sample. |
| `/swap-voice` | A video with its voice swapped via ElevenLabs STS. |

### Editing

| Slash command | What it ships |
|---|---|
| `/add-captions` | A video with animated captions burned in (Captions.ai / Mirage). |
| `/add-overlay` | A video with a text overlay burned in (VidJutsu). |
| `/add-disclaimer` | A video with an FTC fine-print disclaimer burned in (VidJutsu). |
| `/concat-clips` | One MP4 concatenated from a list of clips (ffmpeg). |
| `/trim-clip` | A trimmed MP4 with the requested in/out (ffmpeg). |
| `/resize-clip` | A reformatted MP4 at the requested aspect ratio (ffmpeg). |
| `/extract-frame` | A single PNG frame from a video at a timestamp. |
| `/extend-clip` | A clip extended from its last frame via Wavespeed. |

### Account ops — TokPortal lane (managed accounts)

| Slash command | What it ships |
|---|---|
| `/create-instagram-page` | A managed Instagram account (account ID + creds + TokMail). |
| `/create-tiktok-page` | A managed TikTok account (account ID + creds). |
| `/create-youtube-channel` | A managed YouTube channel (channel ID + creds). |
| `/warm-account` | Niche warming triggered on a managed account (7 credits). |
| `/deep-warm-account` | Deep warming triggered on a managed account (40 credits). |
| `/configure-managed-account` | Bio, link, and image set on a managed account. |
| `/get-managed-account-analytics` | Account + per-video analytics for a managed account. |

### Account ops — Zernio lane (connected accounts)

| Slash command | What it ships |
|---|---|
| `/connect-account` | OAuth auth URL or pendingDataToken to connect a brand-owned account. |
| `/audit-account-health` | Token validity and granted permissions for a connected account. |

### Publishing — TokPortal lane (slot-based)

| Slash command | What it ships |
|---|---|
| `/post-via-slots` | A post published to a managed account via the slot model. |
| `/schedule-via-slots` | A scheduled post on a managed account via the slot model. |
| `/import-videos-csv` | Bulk-filled video slots from a CSV. |

### Publishing — Zernio lane (14 platforms)

| Slash command | What it ships |
|---|---|
| `/publish-post` | An immediate post on a connected account. |
| `/schedule-posts` | A post scheduled to a connected account. |
| `/schedule-optimal` | A post scheduled at Zernio's next optimal slot. |
| `/draft-caption` | A caption draft for a video by niche. |
| `/draft-hashtags` | A ranked hashtag list for a niche. |

### Engagement — Zernio lane

| Slash command | What it ships |
|---|---|
| `/get-comments` | Comments on a connected-account post. |
| `/reply-comments` | Replies posted to a list of comments. |
| `/send-dm` | A DM sent from a connected account. |
| `/setup-comment-dm-funnel` | A comment-to-DM keyword automation on Instagram or Facebook. |
| `/run-dm-sequence` | Contacts enrolled into a multi-step DM sequence. |

### Compliance

| Slash command | What it ships |
|---|---|
| `/compliance-check` | TOS risk score and cited clauses for a video. |
| `/compliance-check-copy` | TOS risk score and cited clauses for caption/copy text. |
| `/audit-claims` | A list of risky claims flagged in copy. |
| `/check-vidlang-spec` | A validation report for a VidLang spec. |

### Paid ads — Zernio lane

| Slash command | What it ships |
|---|---|
| `/create-ads` | A new campaign + ad set + ad on a connected account. |
| `/duplicate-ad-with-variant` | A duplicated ad with a swapped creative variant. |
| `/pause-ads` | Up to 50 campaigns bulk-paused. |
| `/get-ad-performance` | Ad analytics with demographic breakdowns. |
| `/ads-performance-report` | A CPL/CAC/ROAS report synthesized from ad analytics. |
| `/diagnose-ads-account` | The binding constraint identified from funnel metrics. |
| `/create-custom-audience` | A custom audience on Meta/Google/TikTok/Pinterest. |
| `/upload-customer-list` | A PII customer list uploaded (server-hashed) to an audience. |
| `/create-lookalike` | A lookalike audience from a source audience. |
| `/send-conversion-event` | A conversion event sent via Meta CAPI / Google Conversions. |

### Analytics & reporting

| Slash command | What it ships |
|---|---|
| `/pull-analytics` | Post analytics by ID or for an account range. |
| `/weekly-report` | A weekly winners + losers report. |
| `/diagnose-flop` | An underperformance hypothesis for a post. |
| `/iterate-on-winners` | Next-round briefs from top performers. |
| `/clip-performance-report` | A clip leaderboard ranked by reach + clicks. |
| `/follower-history` | A daily follower-count series. |

### Strategy & planning

| Slash command | What it ships |
|---|---|
| `/channel-spec` | A one-page channel spec — character, handle, format, audience. |
| `/content-calendar` | A 30-day content calendar from researched top formats. |
| `/awareness-ladder` | A content map by awareness level. |

### Clipping pipeline

| Slash command | What it ships |
|---|---|
| `/download-post-video` | The MP4 from a social post URL. |
| `/download-post` | A post's MP4 plus its metadata JSON. |
| `/download-youtube-video` | A YouTube video MP4 by URL or ID. |
| `/cut-clip` | A clipped MP4 cut at in/out timestamps. |
| `/find-clip-moments` | A ranked list of clip-worthy timestamps in a long-form video. |

## Provider stack

Shared across skills:

- **Wavespeed** — video and image generation (Seedance 2.0, Nano Banana 2, gpt-image-2, Kling)
- **VidJutsu** — visual QA, compliance, transcribe, overlay, disclaimer, CDN
- **Scrape Creators** — reference fetching across TikTok, IG, YouTube, X, Reddit, Pinterest, ad libraries
- **Zernio** — publishing, engagement, paid ads, analytics, audiences (14 platforms)
- **Gemini** — video analysis, prompt synthesis, structured outputs
- **ElevenLabs** — TTS, voice clone, speech-to-speech voice swap
- **Captions.ai (Mirage)** — animated captions
- **TokPortal** — managed account provisioning, warming, slot-based posting
- **ffmpeg** (local) — concat, trim, resize, frame extract

Skills declare which providers they use in their SKILL.md frontmatter and
link the relevant `llms.txt` so the agent can fetch the API surface at
runtime. See [`docs/PROVIDERS.md`](docs/PROVIDERS.md) for the full list,
signup links, and llms.txt URLs.

## Layout

Each top-level directory is one skill. Inside each skill:

```
<skill-name>/
├── SKILL.md            # Entry point — Claude reads this
├── recipes/            # Numbered step-by-step procedures
│   ├── 01-…md
│   └── …
└── references/         # Provider docs, schemas, rules
    ├── …md
    └── …
```

## Adding a skill

1. Create a new top-level directory named after the use case (verb-first: `clone-ad`, not `ad-cloner`).
2. Add `SKILL.md` with frontmatter (`name`, `description`, `requires.env`).
3. Break the procedure into numbered files under `recipes/`.
4. Put provider docs and schemas in `references/`.
5. Read [`ETHOS.md`](ETHOS.md) before shipping.

## Install

See [`README.md`](README.md) for the install flow. Short version:

```
git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-agency.git ~/.claude/skills/ai-creative-agency
cd ~/.claude/skills/ai-creative-agency && ./setup
```
