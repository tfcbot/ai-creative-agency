# Scrape Creators — Meta Ad Library

Used in step 2's third lane to surface every active Meta ad the brand is currently running.

## Endpoint

```
GET https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads
```

Auth header: `x-api-key: $SCRAPE_CREATORS_API_KEY`

## Query parameters

| Param | Required | Used by this skill | Notes |
|---|---|---|---|
| `query` | yes | yes | The keyword. The skill fans this out across the same query variants used for TikTok / IG (`<app>`, `<app> app`, `<app> review`, etc.). |
| `country` | no | `US` | 2-letter code. Default is `ALL`. The skill pins to `US` because that's where app-install ads concentrate. |
| `status` | no | `ACTIVE` | Default is `ACTIVE`. The skill keeps the default — we want what's running *right now*. |
| `sort_by` | no | omitted | Defaults to impressions (high to low). Good enough. |
| `media_type` | no | omitted | Default `ALL`. Image, video, and "meme" (image+text) are all useful signal. |
| `start_date` / `end_date` | no | omitted | Impression-window filter. Skill doesn't use it; sort-by-impressions already buries old creative. |
| `cursor` | no | omitted | The skill takes only the first page (~50 ads) per query. Sort-by-impressions means anything below page 1 is unlikely to matter. |
| `trim` | no | `true` | Trimmed response. Still includes title, body, cta, link_url, videos, images — everything we need. |

## Response shape

```json
{
  "searchResults": [
    {
      "ad_archive_id": "1378176106734781",
      "page_id": "119749581219299",
      "page_name": "Brand Page Name",
      "is_active": true,
      "start_date_string": "2025-05-19T07:00:00.000Z",
      "end_date_string": "2025-06-15T07:00:00.000Z",
      "url": "https://www.facebook.com/ads/library?id=1378176106734781",
      "snapshot": {
        "title": "Headline",
        "body": { "text": "Long-form ad copy…" },
        "cta_text": "Shop now",
        "cta_type": "SHOP_NOW",
        "link_url": "https://brand.example.com/landing",
        "display_format": "IMAGE | VIDEO | DCO | CAROUSEL",
        "images": [
          { "original_image_url": "...", "resized_image_url": "..." }
        ],
        "videos": [
          { "video_hd_url": "...", "video_sd_url": "...", "video_preview_image_url": "..." }
        ]
      }
    }
  ],
  "searchResultsCount": 50001,
  "cursor": "..."
}
```

## Brand-mention filter

A bare `query=Cluely` call returns 50k ads — most unrelated (people named Cluely, generic typos, etc.). Before display, the skill filters to ads where any of these contain `app_name` (case-insensitive) OR any `brand_keywords`:

- `page_name`
- `snapshot.title`
- `snapshot.body.text`
- `snapshot.link_url`

This is intentionally strict. False negatives (a brand running an ad that never names the app in copy) are acceptable; false positives would flood the report.

## Why no engagement metrics

Meta Ad Library does not expose impressions, reach, or spend for non-political ads in the public API. That's a Meta product decision, not a Scrape Creators limitation. So the skill surfaces Meta ads flat — sorted by start date by default, but no "viral" ranking is possible.

If the user wants impression-level data, they need Meta Ads Manager (their own ads) or paid ad-intelligence tools (AdSpy, BigSpy, etc.) — out of scope.

## Why not VidJutsu these too

Cost. A typical brand has 10–80 active Meta ads. At 10 VidJutsu credits each that's 100–800 credits per run for data the user can scan visually in seconds via the Ad Library link. The Meta-ads section is a "what's the brand currently saying in paid" snapshot, not a viral-creative analysis pass.

## Credit cost

1 credit per `search/ads` call. The skill makes one call per query variant (~5), so ~5 credits per run for the Meta lane.

## Failure modes

- **Page hasn't run any US ads** — `searchResults` is empty. The HTML report shows "No Meta ads matched."
- **Brand name is generic** — e.g. `Ladder` returns ads from unrelated companies (Jacob's ladder, ladder logistics). The brand-mention filter catches most; the user can also pass `--brand-keywords` to tighten the filter.
- **Ad pulled mid-run** — Meta deactivates ads constantly. The `is_active=true` filter is a snapshot at search time; clicking through to the Ad Library URL may show a deactivated ad an hour later. Acceptable.

## Future hooks

If a user wants "all ads ever run by this page" (not just keyword matches), switch to:

```
GET https://api.scrapecreators.com/v1/facebook/adLibrary/company/ads?pageId=<id>&status=ALL
```

That requires resolving `pageId` first via `/v1/facebook/adLibrary/search/companies?query=<brand>`. Deferred until the keyword path proves insufficient.
