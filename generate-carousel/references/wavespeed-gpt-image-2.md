# Wavespeed — `openai/gpt-image-2/text-to-image`

Used for every slide in the carousel. One render per slide, parallelizable across the full carousel.

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

- **`aspect_ratio`** — supported: `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`. **Always use `4:5`** for Instagram carousels.
- **`resolution`** — `1k` or `2k`. Use `2k` for hero slides; `1k` is fine for iteration drafts.
- **`size` parameter does not work.** It's in the OpenAI API spec but Wavespeed silently ignores it and falls back to `1024x1024` square. Always use `aspect_ratio` + `resolution`.

## Polling

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
```

Status walks `created` → `processing` → `completed`. Poll every ~2s. On completion, `outputs[0]` is a CloudFront PNG URL — download to `frames/<slide_id>.png`.

## Render time

- 4:5 at 2K — typically 30 to 120 seconds
- Occasional timeouts at ~5 minutes — retry the same submission, prompt and key are stable

## Output dimensions

`aspect_ratio: "4:5"` + `resolution: "2k"` produces a native 1824×2288 PNG. No post-crop needed.

## Prompt strategy

Flatten the scene JSON into labeled sections that the model reads sequentially. Example layout the flattener produces:

```
SUBJECT: <subject.description>
BODY: <body_details flattened key by key>
CLOTHING: <clothing flattened>
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

The `negative_prompt` is passed separately as a comma-joined list of `forbidden_elements`.

## Parallelism

Submit all slides for a carousel in parallel. Wavespeed handles concurrent submissions cleanly. A 7-slide carousel typically completes in 1–2 minutes wall time when fired in parallel.

## Failure modes

- **HTTP 400 invalid aspect_ratio** — you used a value outside the enum. Use `4:5`.
- **HTTP 400 invalid request** — usually a too-long prompt. Tighten the spec or remove redundant duplicate descriptions.
- **`status: "failed"` with empty `outputs`** — transient. Retry the same submission. If it fails twice, the prompt has a problem (most often: typography section too dense — split into fewer text layers).
- **Square 1024x1024 returned despite aspect_ratio set** — you're talking to the wrong endpoint or auth is wrong. Verify the endpoint path includes `/text-to-image` and the bearer token is the active key.
