# Recipe 04 — Generate slides

## Goal

For each slide JSON in `scenes/`, produce a corresponding PNG at `frames/<slide_id>.png` via Wavespeed gpt-image-2.

## Steps

1. Read `references/wavespeed-gpt-image-2.md` for the endpoint, params, and gotchas. Most important: **never pass `size`** — use `aspect_ratio` (`4:5`) and `resolution` (`2k`).

2. For each slide:

   a. Load the JSON spec.
   b. Flatten it into a labeled prompt block — see the strategy in `references/wavespeed-gpt-image-2.md`. Include the `typography` string verbatim under a `TYPOGRAPHY:` label.
   c. Build the request body:

      ```json
      {
        "prompt": "<flattened spec>",
        "aspect_ratio": "4:5",
        "resolution": "2k",
        "quality": "high",
        "enable_base64_output": false,
        "enable_sync_mode": false,
        "negative_prompt": "<comma-joined forbidden_elements>"
      }
      ```

   d. POST to `https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image`.
   e. Capture the task `id` from the response.
   f. Poll `/api/v3/predictions/<id>/result` every ~2 seconds until `status === "completed"`. Hard-fail on `failed` or `error`.
   g. Download `outputs[0]` and save to `frames/<slide_id>.png`.

3. **Run all slides in parallel.** Each render is 30–120 seconds; parallel finishes in 1–2 minutes total wall time for a 7-slide carousel.

4. **Inspect every result before moving on:**

   For each slide, check:
   - Skin reads natural — visible pores, no plastic sheen
   - All hands have exactly five fingers each
   - No second person in frame (unless the format requires it)
   - Eye-line is correct (looking at lens / off-camera as specified)
   - Wardrobe matches the spec
   - Typography is rendered, in-position, with no garbled characters
   - The single-italic-word motif appears exactly once per headline
   - Logo lockup placement is identical across slides

   If any slide fails, regenerate just that slide. Don't move on with broken slides.

5. **Common regeneration triggers:**
   - Garbled letters in headline → tighten the headline string in the typography section, regenerate
   - Hallucinated text on a prop → add a specific negative ("text on the prompt card other than '<X>'"), regenerate
   - Anatomy distortion (hands, faces) → most often a transient render issue; submit again
   - Wardrobe drift across slides → the spec wasn't repeated verbatim across all slides; copy-paste-fix

## Output

```
frames/slide_1_cover.png
frames/slide_2_<topic>.png
…
frames/slide_N_closer.png
```

## Done when

- Every slide has a PNG at native 2K 4:5
- Every slide passes the inspection checklist above
- No slide has a regen failure outstanding

## Cost

- ~$0.02 per slide at 2K
- A 7-slide carousel ≈ ~$0.14, plus retries

## Next

→ `recipes/05-host-slides.md`
