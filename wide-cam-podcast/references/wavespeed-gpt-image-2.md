# Wavespeed — `openai/gpt-image-2/text-to-image`

Used for starting frames (character singles + the wide 2-shot).

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image
```

Auth header:

```
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "prompt": "<flattened character/scene spec as a long natural-language paragraph>",
  "aspect_ratio": "16:9",
  "resolution": "2k",
  "quality": "high",
  "enable_base64_output": false,
  "enable_sync_mode": false,
  "negative_prompt": "<comma-separated forbidden_elements from the spec>"
}
```

## Critical gotcha

- **Do NOT pass `size`.** It's in the OpenAI API spec but Wavespeed's wrapper silently ignores it and falls back to `1024x1024` square. Use `aspect_ratio` (`16:9` is supported natively).
- `resolution` accepts `1k` or `2k`. Use `2k` for the wide anchor frame; you can use `1k` for character singles if you want to save a few seconds per render.

## Response (submission)

```json
{ "data": { "id": "<task_id>", "status": "created" } }
```

## Polling for the result

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
Authorization: Bearer $WAVESPEED_API_KEY
```

Poll every ~2 seconds. The status field walks through `created` → `processing` → `completed` (or `failed`). On `completed`:

```json
{
  "data": {
    "status": "completed",
    "outputs": ["https://d2p7pge43lyniu.cloudfront.net/output/<uuid>.png"]
  }
}
```

`outputs[0]` is the URL of the generated PNG. Download it and save under `frames/`.

## Render time

- Native 16:9 2K — typically 30–120 seconds per render. Occasionally times out around 5+ minutes; just retry the same submission, the prompts and key are stable.

## Prompt strategy

Flatten the character/scene JSON into labelled blocks that the model can read sequentially:

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
MOOD: <mood.emotion> Expression: <mood.facial_features>
STYLE: <style.genre> <style.rendering> <style.aesthetic>
COLOR: <colors.palette> Contrast: <colors.contrast> Saturation: <colors.saturation>
QUALITY: sharpness <quality.sharpness> <quality.noise>
FRAMING: <aspect.ratio> — <aspect.framing>
```

Then pass `negative_prompt` separately as a comma-joined list of `negative_prompt.forbidden_elements`.

## Output dimensions

At `resolution: "2k"` and `aspect_ratio: "16:9"` you get a native 2736×1536 PNG. No post-crop needed.
