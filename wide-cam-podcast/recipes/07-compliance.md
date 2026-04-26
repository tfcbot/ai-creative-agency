# Recipe 07 — Compliance scan and (optional) disclaimer burn

Optional but recommended for any cut that will run as paid distribution on Meta or TikTok.

## Goal

Run the final cut through VidJutsu `/v1/compliance/video` against the strictest surface you'll publish on. Save the response. If the verdict is `caution` or worse, either burn a disclaimer or soften the script and regenerate the offending block.

## Steps

1. Read `references/vidjutsu-compliance.md`.

2. Get a public URL for the final cut. Easiest path is the VidJutsu CLI:

   ```
   vidjutsu upload final/final.mp4
   ```

   The response includes a `url` field. Capture that.

3. POST to the compliance endpoint:

   ```
   POST https://api.vidjutsu.ai/v1/compliance/video
   Authorization: Bearer $VIDJUTSU_API_KEY
   Content-Type: application/json

   {
     "videoUrl": "<the upload URL>",
     "platform": "facebook-ads",
     "format": "shortform",
     "context": {
       "caption": "<the caption you'll publish with>",
       "monetized": true
     }
   }
   ```

4. Save the response to `compliance/facebook-ads.json`.

5. Read the response:
   - `verdict: "safe"` — ship it.
   - `verdict: "caution"` — see remediation below.
   - `verdict: "high-risk"` or `"likely-violation"` — do not ship; regenerate.

## Remediation when verdict is `caution`

For each violation in the response:

1. Note `evidence.timestamp` and `evidence.transcriptExcerpt` — the exact line that triggered.
2. Identify which block JSON contains that line.
3. Decide between two paths:

   **Path A — soften the dialogue.** Edit the block JSON. Common softenings:
   - "anyone can do this" → "most people can pick this up"
   - "in an afternoon" → "in a day or two"
   - "you don't need anything technical" → "the technical bar is low"

   Then regenerate just that block via Recipe 05, re-concat via Recipe 06, re-scan.

   **Path B — burn a fine-print disclaimer.** Read `references/vidjutsu-disclaimer.md`. POST the final cut to `/v1/disclaimer` with appropriate fine-print text. Save the result as `final/final-disclaimer.mp4`. Re-scan to confirm the verdict moves up.

## Remediation when verdict is `high-risk` or `likely-violation`

Don't try to disclaimer your way out of a high-severity policy violation — Meta and TikTok reviewers see through it. Soften the script and regenerate the offending block(s) via Recipe 05.

## Multi-platform scanning

If you're publishing across Meta + TikTok + YouTube + organic, scan each surface:

```
compliance/
├── facebook-ads.json
├── tiktok.json
├── instagram.json
└── youtube.json
```

The strictest is `facebook-ads`. If you pass that, the rest usually pass too. Rate limit: 20 scans per day per key.

## Output

```
compliance/
└── facebook-ads.json   (and any other platforms scanned)
```

If a disclaimer was burned:

```
final/
└── final-disclaimer.mp4
```

## Done when

- Compliance scan returns `safe` or `caution` for every surface you'll publish on
- Any disclaimer burn has been re-scanned to confirm it lowered the score

## Pipeline complete

You now have a ~60s 16:9 ad with dialogue, a compliance record, and (if needed) a disclaimer-burned variant. Derive verticals/squares per Recipe 06's optional-next-steps section, ship to your scheduling tool, and you're done.
