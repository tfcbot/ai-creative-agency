---
name: clone-ad
description: Clone a winning ad end-to-end into a 15-second multi-shot AI video for your own product. Drop a reference ad URL (Meta Ad Library, TikTok, Instagram, YouTube) or a local MP4 plus a product description. Gemini analyzes the reference and extracts a structured shot list. Wavespeed Nano Banana 2 generates the product image. Wavespeed Seedance 2.0 produces the final 15s video with native audio in one image-to-video call. A verification loop compares the clone's shot density to the reference and re-runs if it's flat. Use when the user wants to clone a winning ad's pacing and structure for their own product without filming, editing, or hiring a creative agency.
---

# clone-ad

The full pipeline for cloning a winning ad end-to-end — fetch reference, extract shot list with Gemini, generate product image with Nano Banana 2, generate cloned ad with Seedance 2.0, verify shot density, ship.

## When to invoke

- The user has seen an ad that performs and wants to clone its pacing/structure for their own product
- They want a 15-second 9:16 vertical video with native audio (talking-head, UGC, product demo)
- They don't want to film, edit in a timeline, or stitch separate voice generations on top — one image-to-video call should produce the whole piece
- The reference is a public URL (Meta Ad Library / TikTok / Instagram / YouTube) or a local MP4 they can point to

## Required environment variables

- `WAVESPEED_API_KEY` — required. Used for both Nano Banana 2 (product image) and Seedance 2.0 (video).
- `GEMINI_API_KEY` — required. Used to analyze the reference video and extract a structured shot list.
- `SCRAPE_CREATORS_API` — required for Meta Ad Library / TikTok / Instagram references. NOT required for YouTube (Gemini fetches YouTube URLs directly) or local files.

## The pipeline (7 steps)

Read each recipe in order. Every recipe is a self-contained markdown file under `recipes/`.

1. **Fetch the reference** → `recipes/01-fetch-reference.md` — resolve URL to a usable media source
2. **Extract the shot list** → `recipes/02-extract-shot-list.md` — Gemini analyze → structured JSON
3. **Generate product image** → `recipes/03-generate-product-image.md` — Nano Banana 2 hero shot (skip if user already has one)
4. **Rewrite shot list for the product** → `recipes/04-rewrite-shot-list-for-product.md` — substitute product + dialogue, hold the framing/angle/movement variety
5. **Generate the clip** → `recipes/05-generate-clip.md` — Seedance 2.0 image-to-video, 15s @ 480p 9:16
6. **Verify the clone** → `recipes/06-verify-clone.md` — re-analyze the output, compare shot density
7. **Iterate or ship** → `recipes/07-iterate-or-ship.md` — remediate prompt and regenerate, or call it done

## Working directory layout

Set up the project's working directory exactly as described in `references/folder-structure.md` before any step runs.

## Schema and endpoint references

- `references/folder-structure.md` — canonical project layout
- `references/shot-list-spec.md` — the structured JSON schema Gemini outputs and your rewriter consumes
- `references/seedance-prompt-rules.md` — load-bearing rules for the Seedance prompt (CUT. SHOT N: syntax, why narrative beats fail)
- `references/product-image-rules.md` — what makes a Seedance-friendly product image (white seamless, studio lighting, text-on-product caveat)
- `references/scrapecreators-social.md` — Meta / TikTok / Instagram media-fetch endpoints
- `references/gemini-video-analysis.md` — Files API + generateContent for shot-list extraction
- `references/wavespeed-nano-banana-2.md` — text-to-image for the product hero
- `references/wavespeed-seedance-2.md` — image-to-video for the final clip
- `references/verification-loop.md` — clone-vs-reference shot-density check

## Style guardrails

- **One Seedance call per ad.** No ffmpeg stitching, no separate voice generation. Native audio handles dialogue from the prompt text.
- **Resolution default is 480p**, NOT 720p. 720p reveals AI tells on mobile. 480p reads as authentic UGC.
- **Aspect ratio is 9:16** for vertical-feed surfaces (TikTok / Reels / Shorts). Use 1:1 or 16:9 only when the user explicitly asks for it.
- **The Seedance prompt is the single most failure-prone artifact.** Read `references/seedance-prompt-rules.md` carefully — the wrong prompt structure produces a flat single-take video instead of a 4–5-cut multi-shot ad.
- **The product image is the second most failure-prone artifact.** Read `references/product-image-rules.md` — Seedance needs a clean white-seamless hero shot with no fine typography on the product.

## Cost and time expectations

- Gemini video analysis: ~$0.01 per 15s reference, ~30–60s
- Nano Banana 2 product image: ~$0.04, ~30–90s
- Seedance 2.0 (15s, 480p, 9:16): ~$0.50, ~5–10 min
- One full clone end-to-end: ~$0.55, ~10–15 min wall time

Budget for 1–2 regeneration loops on Seedance if the first clone is flat — the verification loop catches this and tells you whether to regenerate.
