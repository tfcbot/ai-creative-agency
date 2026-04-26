---
name: wide-cam-podcast
description: Produce a short-form wide-cam AI podcast video end-to-end. Two AI hosts in a locked-off wide 2-shot conversing across a coffee table, cut into ~15s dialogue blocks and concatenated into a ~60s VSL or ad. Characters and set are defined as JSON specs; starting frames generated with Wavespeed gpt-image-2 (or Gemini Nano Banana 2 for 4K); clips generated with Seedance 2.0 text-to-video using the wide as a reference image; final cut optionally scanned by VidJutsu compliance and burned with a fine-print disclaimer. Use when the user wants a talking-head podcast-style AI ad, VSL, promotional clip, or UGC explainer with two hosts.
---

# wide-cam-podcast

The full pipeline for producing a wide-cam AI podcast video — two AI hosts in a locked-off lounge 2-shot, ~60 seconds, 16:9, dialogue-only, native audio.

## When to invoke

The user wants any of:

- An AI-hosted short-form ad or VSL with two characters in a podcast-style conversation
- A promotional clip for a brand, course, community, or product
- A UGC explainer with two talking heads
- A talking-head podcast clip in 16:9 for YouTube / X / Reels (16:9 master, derive verticals after)

## Required environment variables

Set these in the user's shell or `.env` before any pipeline step runs.

- `WAVESPEED_API_KEY` — required. Used for both image (`gpt-image-2`) and video (`bytedance/seedance-2.0`) generation, plus the CDN upload for reference images.
- `GEMINI_API_KEY` — optional. Only needed if you want 4K starting frames via Nano Banana 2 instead of gpt-image-2's 2K.
- `VIDJUTSU_API_KEY` (or `vidjutsu auth` token already saved at `~/.vidjutsu/config.json`) — optional. Only needed for the compliance scan and disclaimer burn.

## The pipeline (7 steps)

Read each recipe page in order. Every recipe is a self-contained markdown file under `recipes/`.

1. **Define characters** → `recipes/01-define-characters.md` — one JSON per host
2. **Generate starting frames (per character)** → `recipes/02-generate-starting-frames.md` — Wavespeed gpt-image-2
3. **Define the wide scene** → `recipes/03-define-scene-wide.md` — one JSON describing the 2-shot
4. **Define clips (one per dialogue block)** → `recipes/04-define-clips.md` — one JSON per ~15s block
5. **Generate clips** → `recipes/05-generate-clips.md` — Wavespeed Seedance 2.0 text-to-video, wide as reference image
6. **Concat** → `recipes/06-concat.md` — ffmpeg stream-copy concatenation
7. **Compliance scan (optional)** → `recipes/07-compliance.md` — VidJutsu `/v1/compliance/video`, plus disclaimer burn if needed

## Working directory layout

Set up the project's working directory exactly as described in `references/folder-structure.md` before running any step. Every recipe assumes that layout.

## Schema and endpoint references

When you need the exact JSON shape or API contract:

- `references/folder-structure.md` — canonical project layout
- `references/character-spec.md` — character JSON schema
- `references/scene-spec.md` — scene JSON schema (multi-person)
- `references/clip-spec.md` — Seedance clip JSON schema
- `references/wavespeed-gpt-image-2.md` — image generation endpoint, params, gotchas
- `references/wavespeed-seedance-2.md` — video generation endpoint, params, render times
- `references/gemini-nano-banana-2.md` — alt 4K image generation endpoint
- `references/vidjutsu-compliance.md` — `/v1/compliance/video` endpoint and response shape
- `references/vidjutsu-disclaimer.md` — `/v1/disclaimer` endpoint for fine-print burn-in
- `references/ffmpeg-concat.md` — stream-copy concat recipe

## Cost and time expectations

- One starting frame: ~30 seconds to ~2 minutes per render at 2K
- One ~15s Seedance clip: ~5–8 minutes per render at 720p; runs in parallel
- Full 4-block ~60s ad, end to end, set up: under 2 hours
- Total stack cost per finished ad: single-digit dollars

## Style guardrails baked into every recipe

- 16:9 throughout (vertical or square crops are derived after, not generated separately)
- Native audio in the clip model — do not stitch voiceover on top
- No captions, overlays, music, or third-party logos in the source generation. Burn captions at the very end if needed
- Cast the two hosts with visibly different silhouettes (hair, wardrobe color, pose) so cuts read instantly
- One simple question per dialogue block, asked by Host A; Host B teaches/answers
- Casual, non-technical tone — assume the viewer is a non-builder
