# Providers

Skills in this repo call a small set of third-party APIs. Each
provider has one job. Don't introduce a new provider unless an
existing one can't do what's needed (see [`../ETHOS.md`](../ETHOS.md)
rule 4).

## Required per skill

| Provider | Env var | Used by |
|---|---|---|
| Wavespeed | `WAVESPEED_API_KEY` | clone-ad, generate-carousel, wide-cam-podcast |
| VidJutsu | `VIDJUTSU_API_KEY` | generate-carousel (CDN), wide-cam-podcast (compliance, disclaimer) |
| Scrape Creators | `SCRAPE_CREATORS_API_KEY` | clone-ad, generate-carousel |
| Zernio | `ZERNIO_API_KEY` | generate-carousel |
| Gemini | `GEMINI_API_KEY` | clone-ad |

Each skill's `SKILL.md` declares the env vars it needs in frontmatter.

## Provider details

### Wavespeed — video and image generation

- **What it does:** hosts Seedance 2.0 (image-to-video, text-to-video
  with native audio), Nano Banana 2 (image generation, character
  identity lock), gpt-image-2 (image generation with reliable
  in-image typography).
- **Why it's the default:** single API, multiple models. Don't add
  model-level providers (Sora, Kling, Seedance directly) unless
  Wavespeed can't host them.
- **Sign up:** [wavespeed.ai](https://wavespeed.ai)
- **Env var:** `WAVESPEED_API_KEY`
- **Typical cost:**
  - Seedance 2.0 image-to-video, 15s with audio: ~$0.30–$0.60 per clip
  - Nano Banana 2 image: ~$0.02–$0.05 per image
  - gpt-image-2 image: ~$0.04–$0.08 per image

### VidJutsu — video QA, compliance, overlay, CDN

- **What it does:** runs visual-language models against videos and
  images for compliance verdicts, scene-level QA, fine-print
  disclaimer overlay burns, and a public CDN for skill output
  hosting.
- **Sign up:** [vidjutsu.ai](https://vidjutsu.ai)
- **Env var:** `VIDJUTSU_API_KEY`
- **Typical cost:**
  - `/v1/watch` (visual QA): ~$0.02 per call
  - `/v1/compliance` (policy verdict): ~$0.05 per call
  - Overlay burn: ~$0.01 per video
  - CDN: free tier covers most skill use

### Scrape Creators — reference fetching

- **What it does:** pulls public ad and creator content from Meta Ad
  Library, TikTok, Instagram, and YouTube. Used to fetch reference
  videos for cloning and to research format patterns in a niche.
- **Sign up:** [scrapecreators.com](https://scrapecreators.com)
- **Env var:** `SCRAPE_CREATORS_API_KEY`
- **Typical cost:** ~$0.01–$0.05 per fetch depending on platform.

### Zernio — publishing and scheduling

- **What it does:** schedules and publishes posts to connected
  Instagram, TikTok, and X accounts. Returns post IDs for analytics
  follow-up.
- **Sign up:** [zernio.com](https://zernio.com)
- **Env var:** `ZERNIO_API_KEY`
- **Typical cost:** subscription-based; free tier covers ~50
  posts/month.

### Gemini — reference video analysis

- **What it does:** analyzes uploaded reference videos to extract
  structured shot lists (shot count, duration, camera moves, action
  beats). Used by `/clone-ad` to characterize a reference before
  rewriting it for the user's product.
- **Sign up:** [ai.google.dev](https://ai.google.dev)
- **Env var:** `GEMINI_API_KEY`
- **Typical cost:** ~$0.05–$0.15 per reference video.

## Adding a new provider

A skill should not introduce a new provider unless an existing one
can't do the job. If it must:

1. Add a section to this file with the same fields above.
2. Update `.env.example` with the new env var and signup link.
3. Update [`../AGENTS.md`](../AGENTS.md) provider stack list.
4. Open the PR with the rationale: what's the existing provider
   missing, and why this one specifically?
