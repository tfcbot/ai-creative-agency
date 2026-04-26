# Wavespeed — Seedance 2.0 (`bytedance/seedance-2.0/image-to-video`)

Used in step 5 to produce the cloned ad. Image-to-video — the product hero image is the i2v anchor, the rewritten shot list is the prompt.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/bytedance/seedance-2.0/image-to-video
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "prompt": "<rewritten shot list with CUT. SHOT N: blocks per seedance-prompt-rules.md>",
  "image": "<public URL of product/product.png — uploaded to a CDN if local>",
  "aspect_ratio": "9:16",
  "resolution": "480p",
  "duration": 15
}
```

## Param notes

- **`prompt`** — the heart of this step. Read `references/seedance-prompt-rules.md` carefully. Wrong structure = flat single-take video.
- **`image`** — must be a **public URL**. If your hero shot is local, upload it first to any public CDN. The Wavespeed CloudFront URL returned by Nano Banana 2 in step 3 is already public, so you can use it directly with no re-upload.
- **`aspect_ratio`** — `9:16` for vertical surfaces (TikTok/Reels/Shorts), `1:1` for square feed, `16:9` for landscape. Default `9:16` for ad-clone use.
- **`resolution`** — `480p` is the right default. **Do NOT default to 720p.** 720p reveals AI tells (overly clean skin, perfect eye highlights, unnatural micro-details) on mobile screens. 480p reads as authentic UGC.
- **`duration`** — integer seconds, range 4–15. Default 15. Use 10 only if the rewritten dialogue genuinely fits.

## Response (submission)

```json
{ "data": { "id": "<task_id>", "status": "created" } }
```

## Polling

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
Authorization: Bearer $WAVESPEED_API_KEY
```

Poll every ~3 seconds. Status walks `created` → `processing` → `completed`. On completion, `outputs[0]` is a CloudFront MP4 URL with a 7-day TTL.

## Render time

- 480p / 9:16 / 15s — ~5–10 minutes
- 720p / 9:16 / 15s — ~8–15 minutes
- 480p / 1:1 / 15s — ~5–10 minutes

Submit the request and let it run. If you have multiple variants to test, fire them in parallel — Wavespeed handles concurrency cleanly.

## Output

MP4, H.264 + AAC, native dialogue audio mixed with quiet ambient. Download to `clone/clone.mp4`.

## Critical: native audio handles dialogue

Seedance 2.0 generates dialogue audio natively from the spoken lines in the prompt. Do NOT:

- Generate voice separately with ElevenLabs and overlay it on top
- Generate the video as muted and then add a voiceover
- Use a different model for the voice

The native audio sync is tight when the dialogue word count fits the duration. Keep total dialogue ≤ 35 words for a 15s clip.

## Failure modes

- **`status: "failed"` with "duration too short for prompt"** — the rewritten prompt has too many CUT. SHOT N: blocks for the requested duration. Cut blocks until density target is met (see prompt rules).
- **Output is one continuous take instead of multi-cut** — prompt structure was narrative, not cut-based. Read `references/seedance-prompt-rules.md` and rewrite.
- **Dialogue audio drifts from lip movement on later shots** — too many spoken words. Tighten the script.
- **Product morphs between shots** — product image was unstable to begin with (reflective, transparent, or vague description). Regenerate the product image with `references/product-image-rules.md`.
- **Environmental color cast varies wildly across shots** — the prompt didn't lock the lighting. Add a global lighting note at the top: "Throughout: warm tungsten interior lighting, slight haze, color grade neutral with warm bias."
- **Wrong creator gender / ethnicity / wardrobe across shots** — the prompt described the creator differently across blocks. Lock the creator description ONCE in a global block at the top of the prompt; reference them as "the creator" in each shot block.

## Cost

- ~$0.50 per clip at 480p / 9:16 / 15s
- ~$0.85 at 720p / 9:16 / 15s

Budget for 1–2 regeneration loops if the first clone fails verification.

## After generation

Download the MP4 and run the verification step (recipe 06). The Wavespeed-hosted URL is fine for review but expires after 7 days; always download a local copy.
