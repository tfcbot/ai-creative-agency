# Gemini — Nano Banana 2 (`gemini-3-pro-image-preview`)

Optional alternative to Wavespeed gpt-image-2 for starting frames. Use it when you want **native 4K** and especially strong multi-person composition for the wide 2-shot.

## Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=$GEMINI_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "contents": [
    { "parts": [{ "text": "<flattened spec with negative-prompt block appended as 'AVOID: ...'>" }] }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE"],
    "imageConfig": {
      "aspectRatio": "16:9",
      "imageSize": "4K"
    }
  }
}
```

## Response shape

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          { "inlineData": { "mimeType": "image/png", "data": "<base64 PNG>" } }
        ]
      }
    }
  ]
}
```

Decode `candidates[0].content.parts[i].inlineData.data` (find the part with `inlineData`), base64-decode, write to a `.png` file.

## When to use Nano Banana 2 over gpt-image-2

- You want **native 4K** (5504×3072) for the wide that becomes the Seedance reference.
- The scene has **two or three characters in distinct positions** and you want stronger spatial coherence.
- You want the most authentic skin and texture rendering — Nano Banana 2 holds detail noticeably better than 2K gpt-image-2.

## When to stick with gpt-image-2

- You're iterating on character singles. Faster, cheaper, plenty for a single seated medium shot.
- You want to use the same `aspect_ratio + resolution` ergonomics across the project (gpt-image-2's `2k` 16:9 is 2736×1536, which is enough for most distribution).

## Output dimensions

At `aspectRatio: "16:9"` + `imageSize: "4K"` you get a 5504×3072 PNG. No post-crop needed. Down-sample if you want to feed Seedance with a smaller reference (Seedance doesn't need 4K).

## Negative prompt handling

Gemini does not accept a separate `negative_prompt` field. Append the forbidden-elements list directly to the prompt under an `AVOID:` label:

```
[FLATTENED SPEC]

AVOID: smooth plastic skin, airbrushed skin, beauty filter, ...
```
