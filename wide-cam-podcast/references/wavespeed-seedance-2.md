# Wavespeed — `bytedance/seedance-2.0/text-to-video`

Used for every dialogue clip. Native audio is baked in — no voiceover stitching, no lip-sync patches.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/bytedance/seedance-2.0/text-to-video
```

Auth header:

```
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Step 1 — Upload the reference image

Seedance i2v takes a reference image as a CDN URL, not a local path. Upload the wide first:

```
POST https://api.wavespeed.ai/api/v3/media/upload/binary
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: multipart/form-data

(form field) file=@frames/podcast_lounge_wide.png
```

Response:

```json
{
  "data": {
    "type": "image",
    "download_url": "https://d1q70pf5vjeyhc.cloudfront.net/media/<...>/images/<uuid>.png",
    "filename": "podcast_lounge_wide.png"
  }
}
```

You only need to upload the wide once per project; reuse the `download_url` across all clip submissions.

## Step 2 — Submit the clip

```json
{
  "prompt": "<full prompt from clip JSON>",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "duration": 15,
  "enable_web_search": false,
  "reference_images": ["<the upload's download_url>"],
  "reference_audios": [],
  "reference_videos": [],
  "negative_prompt": "<from clip JSON>"
}
```

## Param notes

- `aspect_ratio` — supported values: `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`. Always `16:9` for this pipeline.
- `resolution` — `480p`, `720p`, or `1080p`. Use `720p` as the default; `480p` if you're only iterating; `1080p` only if you plan to do digital crops/punch-ins later.
- `duration` — integer seconds, range 4–15. Use 15 for any conversational block.
- `reference_images` — pass exactly one image (the wide). Seedance uses it to lock the universe.

## Polling

Same shape as gpt-image-2:

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
```

`status` walks `created` → `processing` → `completed`. On completion, `outputs[0]` is the MP4 URL.

## Render time

- 480p / 15s — ~3–5 min
- 720p / 15s — ~5–8 min
- 1080p / 15s — ~8–12 min

Fire all your blocks in parallel — Wavespeed handles concurrent submissions cleanly. A 4-block ad finishes in ~10 minutes wall time.

## Output

- MP4 with H.264 video and AAC audio.
- 480p 16:9 ≈ 864×496. 720p 16:9 ≈ 1280×720. 1080p 16:9 ≈ 1920×1080.
- Native dialogue audio is mixed cleanly with quiet room tone.

## Failure modes to watch for

- **Edge drift** — sometimes the first or last 30 frames warp slightly (hands, faces). If a block has visible drift at the edges, regenerate that block; don't try to trim it in post.
- **Lip-sync miss on the longer line** — if Host B's reply is too long for 15s, Seedance compresses the delivery and lip-sync can drift. Tighten the script to ~13s of speech max.
- **Wardrobe drift across blocks** — happens if the prompt doesn't repeat the wardrobe verbatim. Always include the full host wardrobe description in every block's prompt, identical wording each time.
- **Model rejects the wide as too dark** — bump the wide's lighting brightness in the gpt-image-2 prompt and regenerate; Seedance is sensitive to underexposed references.
