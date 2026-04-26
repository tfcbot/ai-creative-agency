# Wavespeed — Nano Banana 2 (`google/nano-banana-2/text-to-image`)

Used in step 3 to produce the product hero image that anchors Seedance's image-to-video call.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/google/nano-banana-2/text-to-image
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "prompt": "<product description per product-image-rules.md>",
  "size": "2048*2048",
  "num_images": 1
}
```

## Param notes

- **`size`** — pass as `<width>*<height>` (asterisk separator, not "x"). Default `2048*2048` works for square hero shots. Other supported sizes per Nano Banana 2 docs include `1024*1024`, `2048*1152`, etc.
- **`num_images`** — 1 unless you want multiple variations to choose from. Each costs separately.

## Response (submission)

```json
{ "data": { "id": "<task_id>", "status": "created" } }
```

## Polling

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
Authorization: Bearer $WAVESPEED_API_KEY
```

Poll every ~3 seconds. Status walks `created` → `processing` → `completed`. On completion, `outputs[0]` is a CloudFront PNG URL.

## Render time

- 2048×2048 — typically 30 to 90 seconds
- Occasional spikes to 2 minutes; just wait

## Output

Single PNG, native dimensions matching the requested size. Download to `product/product.png`.

## Why Nano Banana 2 here, not gpt-image-2

- **Background control is more reliable** — pure white seamless backgrounds render with cleaner edges in Nano Banana 2 than gpt-image-2 at the same prompt
- **Object integrity** — fewer warping artifacts on the product silhouette across iterations
- **No headroom for typography** — typography reliability isn't a factor for product hero shots; both models are equivalent on labels (i.e. both unreliable, but it doesn't matter for a hero shot you'll add type to in post)

If you need typography baked in (e.g. carousel slide), use gpt-image-2 (see the `generate-carousel` skill). For product hero shots, Nano Banana 2.

## Failure modes

- **HTTP 400 invalid size** — pass with `*` not `x`. `2048*2048` works; `2048x2048` fails.
- **Image returned with environmental backdrop instead of white seamless** — the prompt didn't insist hard enough. Add "isolated on a pure white seamless backdrop, no environment, no surface" multiple times in the prompt.
- **Product silhouette warps across regenerations** — single-product hero shots are usually stable. If the silhouette varies a lot, you're describing too vaguely. Be very specific about shape and proportions.

## Cost

- ~$0.04 per image at 2048×2048

## When to skip this step

If the user already has a clean product image — pure white seamless background, even lighting, product centered — skip Nano Banana 2 entirely and use their image. Just verify it meets the rules in `references/product-image-rules.md` first.
