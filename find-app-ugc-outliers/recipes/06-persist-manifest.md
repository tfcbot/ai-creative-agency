# 06 — Persist manifest

Write `$OUT/manifest.json` before running the renderer in step 5. The manifest is the canonical record of the run — it lets the user re-render `report.html` without re-querying APIs, and lets other skills chain off the output (e.g. pipe `top10[]` into `clone-ad`).

## Shape

```json
{
  "skill": "find-app-ugc-outliers",
  "version": "2.0.0",
  "ran_at": "2026-05-05T17:12:43Z",
  "input": {
    "app_name": "Cluely",
    "app_handle": null,
    "affiliate_handle_pattern": null,
    "brand_keywords": [],
    "false_positive_keywords": []
  },
  "queries": ["Cluely", "Cluely app", "Cluely review", "Cluely tutorial", "Cluely hack"],
  "platforms": ["tiktok", "instagram", "meta_ads"],
  "raw_search_paths": [
    "search/tiktok-Cluely.json",
    "search/instagram-Cluely.json",
    "search/meta-ads-Cluely.json"
  ],
  "candidates_total": 184,
  "candidates_after_filter": 73,
  "verdict_counts": { "CONFIRMED": 22, "AMBIGUOUS": 41, "NOT_APP": 10 },
  "top10": [
    {
      "rank": 1,
      "platform": "instagram",
      "id": "...",
      "url": "https://www.instagram.com/reel/...",
      "media_url": "...",
      "cdn_url": "https://...supabase.co/.../file.mp4",
      "handle": "@joinladder",
      "followers": 0,
      "views": 987000,
      "likes": 92000,
      "comments": 1100,
      "shares": 0,
      "engagement_rate": 0.094,
      "thumbnail": "https://...",
      "verdict": "CONFIRMED",
      "watch_status": "ok",
      "watch": { "is_app": true, "confidence": "high", "evidence": "...", "hook": "...", "format": "..." }
    }
  ],
  "meta_ads_total": 14,
  "meta_ads": [
    {
      "ad_archive_id": "1378176106734781",
      "page_name": "Cluely",
      "page_id": "...",
      "is_active": true,
      "start_date_string": "2026-04-12T07:00:00.000Z",
      "end_date_string": null,
      "display_format": "VIDEO",
      "title": "Cheat on everything.",
      "body": "We built Cluely so you never have to think on a call again…",
      "cta_text": "Try it",
      "link_url": "https://cluely.com/...",
      "video_url": "https://video.xx.fbcdn.net/...",
      "thumbnail": "https://scontent...",
      "ad_library_url": "https://www.facebook.com/ads/library?id=1378176106734781",
      "matched_query": "Cluely"
    }
  ]
}
```

`render-report.ts` reads `input.app_name`, `ran_at`, `candidates_total`, `top10[]`, and `meta_ads[]`. The other fields are kept for chaining and debug.

## Print summary

After writing the manifest and rendering the report, print to stdout:

```
✓ Manifest: <OUT>/manifest.json
✓ Report:   <OUT>/report.html
✓ Top 10:   X confirmed by VidJutsu, Y false-positives, Z failed-to-watch
✓ Meta ads: N active
```

Don't dump rows to stdout — the HTML report is the consumable artifact.
