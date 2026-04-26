# Recipe 05 — Generate the cloned clip

## Goal

Submit `clone/prompt.md` and `product/product.png` to Seedance 2.0 image-to-video and download the result to `clone/clone.mp4`.

## Steps

1. Read `references/wavespeed-seedance-2.md` for endpoint details and the failure modes.

2. Resolve the product image to a public URL:

   - If `product/product.png` came from Nano Banana 2 in step 3, you already have a CloudFront URL from the Wavespeed response. Use that directly.
   - If `product/product.png` was supplied by the user as a local file, upload it to a public CDN (the VidJutsu CLI returns a public URL — `vidjutsu upload product/product.png`). Or use any other CDN.

3. Build the request body:

   ```json
   {
     "prompt": "<full contents of clone/prompt.md>",
     "image": "<public URL of product image>",
     "aspect_ratio": "9:16",
     "resolution": "480p",
     "duration": 15
   }
   ```

   Defaults explained:
   - `aspect_ratio: "9:16"` — vertical for TikTok / Reels / Shorts
   - `resolution: "480p"` — reads as authentic UGC; 720p reveals AI tells on mobile
   - `duration: 15` — full Seedance window for a multi-cut ad

4. POST to `https://api.wavespeed.ai/api/v3/bytedance/seedance-2.0/image-to-video` with the bearer token. Capture the task `id`.

5. Poll `/api/v3/predictions/<id>/result` every ~3 seconds until `status === "completed"`. On completion, `outputs[0]` is a CloudFront MP4 URL.

6. Download the MP4 to `clone/clone.mp4`.

7. Verify with `ffprobe` that:
   - Duration is roughly 15 seconds (allow ±0.1s)
   - Resolution is 480p 9:16 (480×854 or thereabouts)
   - Has both video (h264) and audio (aac) streams

8. Show the user the result. Don't proceed to verification if the file doesn't open or is the wrong shape — re-submit with the same params first.

## Output

```
clone/clone.mp4
```

## Done when

- The MP4 downloads cleanly and ffprobe confirms expected shape
- The user has previewed the clip end to end

## Render time

- 480p 9:16 15s — typically 5–10 minutes
- Plan for a coffee break here, not an instant turnaround

## Cost

- ~$0.50 per clip at 480p 9:16 15s

## Failure modes

| Symptom | Fix |
|---|---|
| `status: "failed"` with "duration too short for prompt" | Cut CUT. SHOT N: blocks until density target is met |
| Output is one continuous take | Prompt structure was narrative — rewrite per `references/seedance-prompt-rules.md` |
| Dialogue audio drifts from lips | Total words > 35; tighten the script in step 4 |
| Product morphs across shots | Hero shot was unstable — regenerate product image |
| Wrong creator characteristics shot-to-shot | Move creator block to the GLOBAL SETTING section at top of prompt |

## Next

→ `recipes/06-verify-clone.md`
