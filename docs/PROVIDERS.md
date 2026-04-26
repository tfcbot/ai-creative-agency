# Providers

Skills in this repo call a small set of third-party APIs. Each
provider has one job. Don't introduce a new provider unless an
existing one can't do what's needed (see [`../ETHOS.md`](../ETHOS.md)
rule 4).

## Required per skill

| Provider | Env var | llms.txt / docs |
|---|---|---|
| Wavespeed | `WAVESPEED_API_KEY` | https://wavespeed.ai/docs (model-specific under `/docs/docs-api/...`) |
| VidJutsu | `VIDJUTSU_API_KEY` | https://docs.vidjutsu.ai/llms.txt |
| Scrape Creators | `SCRAPE_CREATORS_API_KEY` | https://docs.scrapecreators.com/llms.txt |
| Zernio | `ZERNIO_API_KEY` | https://docs.zernio.com/llms-full.txt |
| Gemini | `GEMINI_API_KEY` | https://ai.google.dev/gemini-api/docs/video-understanding |
| ElevenLabs | `ELEVENLABS_API_KEY` | https://elevenlabs.io/docs/llms.txt |
| Captions.ai (Mirage) | `CAPTIONS_API_KEY` | https://captions.ai/help/docs/api |
| TokPortal | `TOKPORTAL_API_KEY` | https://developers.tokportal.com/llms.txt |
| ffmpeg | — (local) | install via `brew install ffmpeg` |

Each skill's `SKILL.md` declares the env vars it needs in frontmatter and
links the relevant `llms.txt` from the table above so the agent can pull
the current API surface at runtime.

## Provider details

### Wavespeed — video and image generation

- **What it does:** hosts Seedance 2.0 (image-to-video, text-to-video
  with native audio), Nano Banana 2 (image generation, character
  identity lock), gpt-image-2 (image generation with reliable
  in-image typography), Kling 3.0, Veo, and other video models.
- **Why it's the default:** single API, multiple models. Don't add
  model-level providers (Sora, Kling, Seedance directly) unless
  Wavespeed can't host them.
- **Sign up:** [wavespeed.ai](https://wavespeed.ai)
- **Env var:** `WAVESPEED_API_KEY`
- **Docs:** https://wavespeed.ai/docs — model-specific under `/docs/docs-api/...`
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
- **Docs:** https://docs.vidjutsu.ai/llms.txt
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
- **Docs:** https://docs.scrapecreators.com/llms.txt
- **Typical cost:** ~$0.01–$0.05 per fetch depending on platform.

### Zernio — publishing and scheduling

- **What it does:** schedules and publishes posts to connected
  Instagram, TikTok, and X accounts. Returns post IDs for analytics
  follow-up.
- **Sign up:** [zernio.com](https://zernio.com)
- **Env var:** `ZERNIO_API_KEY`
- **Docs:** https://docs.zernio.com/llms-full.txt
- **Typical cost:** subscription-based; free tier covers ~50
  posts/month.

### ElevenLabs — TTS, voice clone, speech-to-speech

- **What it does:** text-to-speech, voice cloning from a sample, and
  speech-to-speech voice swapping on existing audio/video.
- **Sign up:** [elevenlabs.io](https://elevenlabs.io)
- **Env var:** `ELEVENLABS_API_KEY`
- **Docs:** https://elevenlabs.io/docs/llms.txt
- **Typical cost:** subscription-based; free tier covers cloning experiments.

### Captions.ai (Mirage) — animated captions

- **What it does:** burns animated captions onto a video via a
  templates-based API.
- **Sign up:** [captions.ai](https://captions.ai)
- **Env var:** `CAPTIONS_API_KEY`
- **Docs:** https://captions.ai/help/docs/api
- **Typical cost:** subscription-based; per-job API pricing.

### TokPortal — managed account provisioning + slot posting

- **What it does:** provisions managed Instagram, TikTok, and YouTube
  accounts you don't log into; supports niche/deep warming, slot-based
  posting, profile config, and per-account analytics.
- **Sign up:** [tokportal.com](https://tokportal.com)
- **Env var:** `TOKPORTAL_API_KEY`
- **Docs:** https://developers.tokportal.com/llms.txt
- **Typical cost:** ~25 credits per account; warming and slot edits priced
  per action.

### ffmpeg — local video edits

- **What it does:** local concat, trim, scale/crop, and frame extract.
  No API key — runs against a local install.
- **Install:** `brew install ffmpeg`
- **Env var:** none.

### Gemini — reference video analysis

- **What it does:** analyzes uploaded reference videos to extract
  structured shot lists (shot count, duration, camera moves, action
  beats). Used by `/clone-ad` to characterize a reference before
  rewriting it for the user's product.
- **Sign up:** [ai.google.dev](https://ai.google.dev)
- **Env var:** `GEMINI_API_KEY`
- **Docs:** https://ai.google.dev/gemini-api/docs/video-understanding
- **Typical cost:** ~$0.05–$0.15 per reference video.

## Adding a new provider

A skill should not introduce a new provider unless an existing one
can't do the job. If it must:

1. Add a section to this file with the same fields above.
2. Update `.env.example` with the new env var and signup link.
3. Update [`../AGENTS.md`](../AGENTS.md) provider stack list.
4. Open the PR with the rationale: what's the existing provider
   missing, and why this one specifically?
