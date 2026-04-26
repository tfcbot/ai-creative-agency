# Gemini video analysis

Used in step 2 to analyze the reference video and extract a structured shot list. Also used in step 6 to verify the clone.

## Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY
```

`gemini-2.5-flash` is the right tier — fast, cheap, supports video understanding natively.

## Two upload paths

### Path A — small files (< 2 MB) inline base64

```json
{
  "contents": [{
    "parts": [
      {
        "inlineData": {
          "mimeType": "video/mp4",
          "data": "<base64 video>"
        }
      },
      { "text": "<analysis prompt>" }
    ]
  }]
}
```

Inline only works for very short videos (< 2 MB). Don't use for typical 15s reference ads — they're too large.

### Path B — Files API (default for clip-sized references)

Two-step:

**1. Resumable upload to the Files API:**

```
POST https://generativelanguage.googleapis.com/upload/v1beta/files?key=$GEMINI_API_KEY
X-Goog-Upload-Protocol: resumable
X-Goog-Upload-Command: start
X-Goog-Upload-Header-Content-Length: <bytes>
X-Goog-Upload-Header-Content-Type: video/mp4
Content-Type: application/json

{ "file": { "displayName": "reference.mp4" } }
```

The response includes an `X-Goog-Upload-URL` header. Then:

```
POST <that URL>
X-Goog-Upload-Offset: 0
X-Goog-Upload-Command: upload, finalize
Content-Type: video/mp4

<binary body>
```

The final response gives you a `file.uri` like `https://generativelanguage.googleapis.com/v1beta/files/<id>`.

**2. Pass that URI in the analysis request:**

```json
{
  "contents": [{
    "parts": [
      {
        "fileData": {
          "fileUri": "<that URI>",
          "mimeType": "video/mp4"
        }
      },
      { "text": "<analysis prompt>" }
    ]
  }]
}
```

### Path C — YouTube URL (no upload needed)

```json
{
  "contents": [{
    "parts": [
      {
        "fileData": {
          "fileUri": "https://youtu.be/<id>",
          "mimeType": "video/mp4"
        }
      },
      { "text": "<analysis prompt>" }
    ]
  }]
}
```

Gemini fetches and analyzes the YouTube video natively. No Files API step needed.

## The analysis prompt

Ask Gemini to return JSON matching the schema in `references/shot-list-spec.md`. The exact prompt should:

1. Describe the schema field by field with brief inline notes on what each field means
2. Emphasize that vague answers are useless — fields like `framing`, `angle`, and `movement` must use the controlled vocabulary
3. Insist that `total_shots` reflects actual visible cuts, not narrative beats
4. Ask for `cut_style` to characterize transitions
5. Request that the response be **JSON only**, with no surrounding prose

A short, sharp prompt is better than a long one. Keep it under 800 characters and let the schema description do the lifting.

## Forcing JSON output

Add this to the request body:

```json
{
  "generationConfig": {
    "responseMimeType": "application/json"
  }
}
```

This forces the response to be parseable JSON without trailing prose. Without it you'll occasionally get prose-then-JSON which requires text-stripping.

## Failure modes

- **HTTP 400 with "Files API not enabled"** — the API key needs `Generative Language API` enabled in the Google Cloud project. Direct the user to https://console.cloud.google.com.
- **Empty `shots` array in the response** — the video was too short, the analysis prompt didn't insist on cuts, or the model's JSON parser tripped. Re-run with a tighter prompt.
- **`shots` array with timestamps that don't add up to the duration** — Gemini sometimes hallucinates extra shots. Trust the model on cuts but trim shots whose `end` exceeds `total_duration_sec`.
- **YouTube fetch failing on a private/region-locked video** — fall back to the Path B upload flow with a manually downloaded copy.

## Cost

- ~$0.01 per 15s reference at gemini-2.5-flash
- ~30–60 seconds wall time including upload

Cache the result aggressively. Save to `reference/shot-list.json` and never re-analyze the same reference unless it's been replaced.
