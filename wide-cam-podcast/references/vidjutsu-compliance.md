# VidJutsu — `/v1/compliance/video`

Optional final step. Scans the finished cut against a platform's TOS and Community Guidelines, returns a deterministic risk score with cited policy clauses.

## Endpoint

```
POST https://api.vidjutsu.ai/v1/compliance/video
Authorization: Bearer $VIDJUTSU_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "videoUrl": "<public CDN URL of the final mp4>",
  "platform": "facebook-ads",
  "format": "shortform",
  "context": {
    "caption": "<the caption you'll publish with>",
    "hashtags": ["#example"],
    "monetized": true
  }
}
```

`platform` enum: `youtube`, `tiktok`, `instagram`, `facebook-ads`, `ftc`. Run **`facebook-ads`** first — it's the strictest surface for paid distribution.

`format` is optional (`shortform` or `longform`); inferred from duration if omitted.

`context` is optional. Include it when you have it — `monetized: true` raises the threshold for promotional language scrutiny.

## Getting the videoUrl

The simplest path is to upload the final cut via the VidJutsu CLI, which returns a CDN URL:

```
vidjutsu upload final/final.mp4
```

Returns:

```json
{ "url": "https://cdn.vidjutsu.ai/uploads/<workspace>/<uuid>.mp4", "assetId": "asset_..." }
```

Use that `url` as `videoUrl`.

## Response shape

```json
{
  "platform": "facebook-ads",
  "policySnapshotDate": "2026-04-23",
  "riskScore": 20,
  "verdict": "caution",
  "violations": [
    {
      "ruleId": "facebook-ads-...",
      "category": "ad-standards",
      "severity": "high",
      "explanation": "<plain-language reasoning>",
      "citation": {
        "text": "<exact quoted clause from Meta policy>",
        "sourceUrl": "https://transparency.meta.com/policies/ad-standards/...",
        "policyVersion": "2026-04-23"
      },
      "evidence": {
        "timestamp": 26,
        "transcriptExcerpt": "<the line that triggered>"
      }
    }
  ],
  "disclaimer": "Informational only, not legal advice."
}
```

## Verdicts

- `safe` — ship it.
- `caution` — ship-able for organic, but burn a fine-print disclaimer or soften language for paid distribution.
- `high-risk` — likely to be rejected on first review. Soften scripts and regenerate the offending block.
- `likely-violation` — do not ship as-is.

## Common triggers in this format

- **Aspirational claims about ease/speed** ("anyone can do this," "shipping content in an afternoon") — Meta misinformation + deceptive-practices clauses.
- **Income claims** without a disclaimer — FTC.
- **Endorsement framing** that reads as testimonial — FTC + platform endorsement guidelines.
- **Unsubstantiated comparison** ("better than the competition") — most platforms.

## How to remediate

1. Identify the highest-severity violation. Note its `evidence.timestamp` and `evidence.transcriptExcerpt`.
2. Decide between two paths:
   - **Soften the dialogue** in the offending block JSON, then regenerate just that block. Keeps the verdict cleanest.
   - **Burn a fine-print disclaimer** via `/v1/disclaimer` (see `vidjutsu-disclaimer.md`). Fastest path to ship.
3. Re-scan the new cut. Iterate until verdict is at least `caution` for paid surfaces.

## Rate limit

20 scans per day per key. Save responses to `compliance/<platform>.json` so you don't burn quota re-running the same scan.
