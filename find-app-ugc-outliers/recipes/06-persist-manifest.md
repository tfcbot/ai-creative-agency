# 06 — Persist manifest

Write `<OUT>/manifest.json` so other skills can chain off this output (e.g. pipe the top 10 into `clone-ad`) and so the user can re-render the HTML report or re-run analysis without re-querying the APIs.

## Shape

```json
{
  "skill": "find-app-ugc-outliers",
  "version": "1.0.0",
  "ran_at": "2026-05-03T17:12:43Z",
  "input": {
    "app_name": "Cluely",
    "app_handle": null,
    "affiliate_handle_pattern": null,
    "brand_keywords": [],
    "false_positive_keywords": []
  },
  "queries": ["Cluely", "Cluely app", "Cluely review", "Cluely tutorial", "Cluely hack"],
  "platforms": ["tiktok", "instagram"],
  "raw_search_paths": [
    "search/tiktok-Cluely.json",
    "search/instagram-Cluely.json",
    "..."
  ],
  "candidates_total": 184,
  "candidates_after_filter": 73,
  "verdict_counts": { "CONFIRMED": 22, "AMBIGUOUS": 41, "NOT_APP": 10 },
  "top10": [
    {
      "rank": 1,
      "platform": "instagram",
      "id": "...",
      "url": "...",
      "media_url": "...",
      "handle": "...",
      "views": 987000,
      "engagement_rate": 0.094,
      "verdict": "CONFIRMED",
      "watch": { "is_app": true, "confidence": "high", "evidence": "...", "hook": "...", "format": "..." }
    }
  ]
}
```

## Print summary

After writing, log:

```
✓ Manifest: <OUT>/manifest.json
✓ Report:   <OUT>/report.html
✓ Top 10:   X confirmed by VidJutsu, Y false-positives, Z failed-to-watch
```

Don't print the whole top-10 table to stdout — the HTML report is the consumable artifact. Stdout is for the path + the one-line tally.
