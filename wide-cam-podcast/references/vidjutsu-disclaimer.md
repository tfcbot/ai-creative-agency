# VidJutsu — `/v1/disclaimer`

Burns a fine-print FTC-style disclaimer at the bottom of a finished video. Use when the compliance scan returns `caution` or above and you want to ship without regenerating clips.

## Endpoint

```
POST https://api.vidjutsu.ai/v1/disclaimer
Authorization: Bearer $VIDJUTSU_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "videoUrl": "<public CDN URL of the cut to burn>",
  "text": "Results vary. AI-generated characters. Testimonial not typical."
}
```

## Response

Returns a CDN URL of the new mp4 with the disclaimer burned in. Server-side ffmpeg + ASS subtitles, no local processing required.

## Disclaimer copy by use case

- **AI characters disclosure** — `AI-generated characters and voices.` (Meta + TikTok synthetic-media disclosure expectations.)
- **Earnings / outcome claims** — `Results vary. Testimonial not typical.` (FTC.)
- **Paid endorsement** — `Paid partnership.` (FTC + platform.)
- **Combo for a brand-podcast VSL with implicit outcome claims** — `AI-generated. Results vary. Not legal or financial advice.`

Keep the line short — under ~80 characters reads cleanly at the bottom of a 720p frame.

## Rate limit

5 credits per call. No daily cap noted; check `vidjutsu usage` if running batches.

## When NOT to use

- The compliance scan returned `safe`. The disclaimer hurts read-through more than it helps.
- The violation is severity `critical` or verdict is `likely-violation`. A disclaimer doesn't fix substantive policy breaks; regenerate the offending block instead.
