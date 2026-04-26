# Recipe 05 — Generate the clips

## Goal

For each `clips/block_<N>.json`, produce `clips/block_<N>.mp4` via Seedance 2.0 text-to-video, using the wide as the reference image.

## Steps

1. Read `references/wavespeed-seedance-2.md` for endpoint, params, and failure modes.

2. Upload the wide once. POST `frames/podcast_lounge_wide.png` to `/api/v3/media/upload/binary` and capture `data.download_url`. Reuse that URL for every clip submission.

3. For each block JSON:
   a. Load the JSON.
   b. Build the Seedance request body:
      ```json
      {
        "prompt": "<from clip JSON>",
        "aspect_ratio": "16:9",
        "resolution": "720p",
        "duration": 15,
        "enable_web_search": false,
        "reference_images": ["<the wide's download_url>"],
        "reference_audios": [],
        "reference_videos": [],
        "negative_prompt": "<from clip JSON>"
      }
      ```
   c. POST to `https://api.wavespeed.ai/api/v3/bytedance/seedance-2.0/text-to-video`.
   d. Capture `data.id`.
   e. Poll `/api/v3/predictions/<id>/result` every ~3 seconds. Status walks `created` → `processing` → `completed`.
   f. On completion, download `outputs[0]` (an MP4 URL) and save to `clips/block_<N>.mp4`.

4. **Run all four clips in parallel.** Each block takes ~5–8 minutes at 720p; serial would take 30+ minutes. Parallel finishes in ~10 minutes wall time.

5. Inspect each clip:
   - **Edges:** Watch the first 30 frames and the last 30 frames. Hands or faces sometimes warp at edges. If any block has visible edge drift, regenerate just that block — don't try to trim it in post.
   - **Lip-sync:** Both hosts should sync to their respective lines. If sync drifts, the line was probably too long for 15s — tighten the dialogue and regen.
   - **Wardrobe continuity:** All four blocks should show identical wardrobe. If a block drifts (e.g. cardigan disappears), regen with the full wardrobe description copy-pasted into the prompt.
   - **Audio:** Native dialogue should be clear, with quiet room tone, no music, no voiceover layered on top.

## Parallelism guidance

Wavespeed handles concurrent submissions cleanly. Submit all four in a single batch — don't sleep between submissions. The CDN can handle four parallel uploads of the same reference URL too; you only need to upload the wide once.

## Output

```
clips/
├── block_1.mp4   (720p 16:9, ~15s, h264 + aac)
├── block_2.mp4
├── block_3.mp4
└── block_4.mp4
```

## Done when

- All four MP4s render successfully
- Each clip passes the inspection checklist (edges, lip-sync, wardrobe, audio)
- Total clip count and durations match plan (4 × 15s = 60s)

## If you need a 1080p variant

Generate at 720p first to validate composition and dialogue. Once locked, regenerate at 1080p only if you need digital punch-ins later. 1080p adds 50% to render time and 4× to file size; don't pay that cost on first iteration.

## Next

→ `recipes/06-concat.md`
