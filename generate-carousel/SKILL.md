---
name: generate-carousel
description: Produce a multi-slide Instagram carousel end-to-end. Research a niche, identify the visual format pattern, design 3–10 slides as structured JSON specs, generate each slide with Wavespeed gpt-image-2 (typography baked in by the model — no separate overlay pass), host the PNGs on a public CDN, draft a caption, and publish or save as drafts via Zernio. Use when the user wants to ship a brand-style Instagram carousel — listicle, comparison, use-cases, hook-and-reveal, or any cover-plus-body-slide format.
---

# generate-carousel

The full pipeline for producing a multi-slide Instagram carousel — research, design, generate, host, caption, publish.

## When to invoke

- The user wants a polished Instagram carousel for a brand or creator account
- They want every slide generated with one image model (gpt-image-2) including the type, not photoshopped or designed in Figma
- The post needs to look native to a category — listicle, format comparison, use-case showcase, "this is X" reveal, or any standard 3–10 slide structure

## Required environment variables

- `WAVESPEED_API_KEY` — required, image generation
- `SCRAPE_CREATORS_API` — required for niche research (pull reference posts to identify the format)
- A CDN with a CLI or REST endpoint that returns a public URL — required for hosting the PNGs the publisher pulls from. Common choice: VidJutsu (`vidjutsu upload <file>` returns a `cdn.vidjutsu.ai/...` URL)
- `ZERNIO_API_KEY` — required to publish or schedule via the social publisher
- `GEMINI_API_KEY` — optional, for 4K via Nano Banana 2 if a slide demands it

## The pipeline (7 steps)

Read each recipe in order. Every recipe is a self-contained markdown file under `recipes/`.

1. **Research the format** → `recipes/01-research-formats.md`
2. **Design the carousel** → `recipes/02-design-the-carousel.md`
3. **Write slide specs** → `recipes/03-write-slide-specs.md`
4. **Generate slides** → `recipes/04-generate-slides.md`
5. **Host on a CDN** → `recipes/05-host-slides.md`
6. **Draft the caption** → `recipes/06-write-caption.md`
7. **Publish** → `recipes/07-publish.md`

## Working directory layout

Set up the project's working directory exactly as described in `references/folder-structure.md` before any step.

## Schema and endpoint references

- `references/folder-structure.md` — canonical project layout
- `references/format-grammar.md` — the recurring visual formats carousels use, and how to spot the right one
- `references/slide-spec.md` — JSON schema for a single slide
- `references/typography-rules.md` — how to bake type into a gpt-image-2 prompt so the model renders headline, logo lockup, and CTA pill in-image
- `references/scrapecreators-instagram.md` — endpoints for pulling profile + posts + individual carousel slides
- `references/wavespeed-gpt-image-2.md` — image generation endpoint and gotchas
- `references/vidjutsu-cdn.md` — uploading PNGs for a public URL
- `references/zernio-instagram.md` — creating a carousel post
- `references/caption-format.md` — caption structure that pairs with a carousel

## Style guardrails

- **One image model for everything.** gpt-image-2 generates the photograph AND the typography in a single pass. Do not design the type separately and overlay it.
- **Typography rules** in `references/typography-rules.md` are load-bearing — follow them to avoid garbled text.
- **Aspect ratio:** 4:5 portrait (Instagram carousel native).
- **Resolution:** 2K from gpt-image-2 unless a slide requires 4K (Nano Banana 2).
- **Visual continuity across the carousel:** same logo lockup placement, same type system, same single-italic-word motif if the brand uses one. Variation comes from the photography, not the type.
- **Caption pairs with the cover slide hook** and ends with a single clear CTA that matches what the closer slide promises.

## Cost expectations

- One slide at 2K via Wavespeed gpt-image-2 ≈ ~$0.02
- A 7-slide carousel ≈ ~$0.14 in image-gen credits, plus ~free CDN hosting and ~free publisher
- Total time end to end (with research): 30–90 minutes
