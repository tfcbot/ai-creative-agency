# Wavespeed — gpt-image-2 text-to-image

The image model used for every slide. One render per slide, parallelizable across the full carousel.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "prompt": "<flattened scene spec including the typography string>",
  "aspect_ratio": "4:5",
  "resolution": "2k",
  "quality": "high",
  "enable_base64_output": false,
  "enable_sync_mode": false,
  "negative_prompt": "<comma-joined forbidden_elements>"
}
```

## Param notes

- **`aspect_ratio`** — supported values: `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`. **Always `4:5`** for Instagram carousels.
- **`resolution`** — `1k` or `2k`. Use `2k` for shipping renders; `1k` for cheap iteration drafts.
- **`size` parameter does not work.** It's in the OpenAI API spec but Wavespeed silently ignores it and falls back to `1024x1024` square. Always use `aspect_ratio` + `resolution`.
- **`quality: "high"`** is the standard. `"medium"` exists but produces visibly worse type baking.

## Polling

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
Authorization: Bearer $WAVESPEED_API_KEY
```

Status walks `created` → `processing` → `completed` (or `failed`). Poll every ~2s. On completion, `outputs[0]` is a CloudFront PNG URL — download to `frames/<slide_id>.png`.

## Render time

- 4:5 at 2K — typically 30 to 120 seconds per slide
- Occasional timeouts at ~5 minutes — retry the same submission, prompt and key are stable

## Output dimensions

`aspect_ratio: "4:5"` + `resolution: "2k"` produces a native 1824×2288 PNG. No post-crop needed.

## Prompt structure (the flattener)

Walk the slide spec and emit labeled sections that the model reads sequentially:

```
SUBJECT: <subject.description>
BODY: <body_details flattened key by key>
CLOTHING: <clothing>
POSE: <pose.type>
HEAD: <pose.head>
ARMS/HANDS: <pose.arms_and_hands>
POSTURE: <pose.posture>
ENVIRONMENT: <environment.location> — <environment.details>
CAMERA: <camera.perspective> <camera.focal_length> <camera.depth_of_field> <camera.position>
LIGHTING: <lighting.source> Quality: <lighting.quality> Shadows: <lighting.shadows>
MOOD: <mood_and_expression.emotion> Expression: <mood_and_expression.facial_features>
STYLE: <style.genre> <style.rendering> <style.aesthetic>
COLOR: <colors_and_tone.palette> Contrast: <colors_and_tone.contrast> Saturation: <colors_and_tone.saturation>
QUALITY: sharpness <quality.sharpness> <quality.noise>
FRAMING: <aspect.ratio> — <aspect.framing>
TYPOGRAPHY: <typography string verbatim>
```

`negative_prompt.forbidden_elements` is passed separately as a comma-joined list in the `negative_prompt` request param.

## Parallelism

Submit all slides in parallel. Wavespeed handles concurrent submissions cleanly. A 7-slide carousel typically completes in 1–2 minutes wall time when fired in parallel.

Track task IDs in an array as you submit. If your poll loop dies, you can re-poll by task ID instead of re-submitting (which would burn credits a second time).

## Failure modes

### `status: "failed"` with `error: "Content flagged as potentially sensitive"`

The safety filter rejected the prompt. Common triggers when cloning beauty/lifestyle:

- "tiny shorts" + "bare legs" + "bedroom" combinations
- "wet hair" + "shower" or "bathroom" combinations
- Skin exposure descriptions even on non-explicit subjects

Fix: rewrite the spec with safer wording (e.g. swap "tiny black shorts" for "loose blue jeans," swap "bedroom" for "hallway"), add `nudity` and `suggestive` to the negative prompt, resubmit. Don't argue with the filter.

### `status: "failed"` with empty `outputs` and a different error

Transient. Retry the same submission once. If it fails twice, the prompt has a problem — most often the typography section is too dense. Tighten to fewer text layers and shorter strings.

### HTTP 400 invalid aspect_ratio

You used a value outside the supported enum. Use `4:5`.

### HTTP 400 invalid request

Usually a too-long prompt. Tighten the spec or remove redundant duplicate descriptions across sections.

### Square 1024x1024 returned despite `aspect_ratio` set

Wrong endpoint or wrong auth. Verify the path includes `/text-to-image` and the bearer token is the active key.

## Regenerating one slide on a finished carousel

If the user reviews the carousel and wants one slide redone:

1. Edit only that slide's JSON spec
2. Re-submit only that one to gpt-image-2
3. Save to `frames/slide_<N>_<role>.png` (overwrite)
4. Re-upload only that PNG to the CDN, capture the new URL
5. Update the slide URL in the publish payload at the same array index

Don't re-fire the whole carousel for a single slide regen. It's wasteful and risks producing a different look across the other slides.

## Cost

~$0.02 per slide at `4:5`, `2k`, `quality: "high"`. A 7-slide carousel: ~$0.14, plus ~$0.02 per regenerated slide.
