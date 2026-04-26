# Recipe 02 — Generate starting frames per character

## Goal

For each character JSON in `characters/`, produce a single PNG at `frames/<host_id>_single.png`. These are optional — they're cutaway singles. The required frame is the wide 2-shot in Recipe 03. If you only need conversational blocks (no cutaways), skip directly to Recipe 03.

## Steps

1. Read `references/wavespeed-gpt-image-2.md` for the endpoint and gotchas. The most important one: **never pass `size`** — it's silently ignored and you'll get squares back. Use `aspect_ratio` and `resolution`.

2. For each character:
   a. Load the JSON spec.
   b. Flatten it into a labelled prompt block (LABEL: value per section). The flattening strategy is in `references/wavespeed-gpt-image-2.md` under "Prompt strategy."
   c. Build the body:
      ```json
      {
        "prompt": "<flattened spec>",
        "aspect_ratio": "16:9",
        "resolution": "2k",
        "quality": "high",
        "enable_base64_output": false,
        "enable_sync_mode": false,
        "negative_prompt": "<comma-joined forbidden_elements>"
      }
      ```
   d. POST to `https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image` with the bearer token.
   e. Capture `data.id` from the response.
   f. Poll `GET /api/v3/predictions/<id>/result` every ~2 seconds until `status === "completed"`. Hard-fail on `failed` or `error`.
   g. Download `outputs[0]` (a CloudFront PNG URL) and save to `frames/<host_id>_single.png`.

3. Run all characters in parallel. Each render is ~30–120 seconds; parallel saves real time.

4. Inspect each result before moving on:
   - Skin reads natural (visible pores, no plastic sheen)
   - Hands have exactly five fingers each, anatomically correct
   - No second person in frame
   - Eye-line is correct (not looking at camera)
   - Wardrobe matches the spec exactly

   If any fail, regenerate that single character — don't move on.

## Alt path — Nano Banana 2 (4K)

If the user wants 4K starting frames or is producing a hero piece:

1. Read `references/gemini-nano-banana-2.md`.
2. Use the Gemini endpoint with `imageConfig.aspectRatio: "16:9"` and `imageConfig.imageSize: "4K"`.
3. Append the negative-prompt list to the prompt under an `AVOID:` label (Gemini doesn't accept a separate field).

## Output

```
frames/
├── host_a_single.png   (2736×1536 at 2K, or 5504×3072 at 4K)
└── host_b_single.png
```

## Done when

- Each PNG renders at native 16:9 with no post-crop.
- Each PNG passes the inspection checklist above.

## Next

→ `recipes/03-define-scene-wide.md`
