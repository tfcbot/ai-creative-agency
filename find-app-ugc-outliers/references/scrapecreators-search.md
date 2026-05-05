# Scrape Creators — keyword search (TikTok + Instagram)

This skill uses two endpoints. **YouTube is out of scope** for `find-app-ugc-outliers` — short-form vertical UGC for apps is the wedge.

Auth: `x-api-key: $SCRAPE_CREATORS_API_KEY` on every call.

## TikTok

```
GET https://api.scrapecreators.com/v1/tiktok/search/keyword?query=<query>
```

Response shape (relevant fields):

```json
{
  "search_item_list": [
    {
      "aweme_info": {
        "aweme_id": "7234567890123456789",
        "desc": "<caption>",
        "author": { "unique_id": "<handle>", "follower_count": 12345 },
        "statistics": {
          "play_count": 987000,
          "digg_count": 45000,
          "comment_count": 1200,
          "share_count": 800
        },
        "video": {
          "play_addr": { "url_list": ["https://...mp4", "..."] },
          "cover": { "url_list": ["https://...jpg"] }
        }
      }
    }
  ]
}
```

- `play_addr.url_list[0]` is the MP4 we hand to VidJutsu. The list contains CDN fallbacks; use index 0.
- `play_count` = views, `digg_count` = likes. TikTok exposes shares in `share_count`.
- The MP4 URLs are watermark-free — Scrape Creators resolves the underlying CDN.

## Instagram reels

```
GET https://api.scrapecreators.com/v2/instagram/reels/search?query=<query>
```

Response shape (relevant fields):

```json
{
  "reels": [
    {
      "media": {
        "id": "...",
        "shortcode": "C-xyz",
        "caption": { "text": "<caption>" },
        "owner": { "username": "<handle>" },
        "video_view_count": 540000,
        "video_play_count": 540000,
        "like_count": 32000,
        "comment_count": 410,
        "video_url": "https://...mp4",
        "image_versions2": { "candidates": [{ "url": "https://...jpg" }] }
      }
    }
  ]
}
```

- Each entry may be `{ media: ... }` or the media inline — handle both: `const m = r.media ?? r;`
- Caption may be string or `{ text }` — handle both.
- IG search **does not expose share count or follower count.** Treat `shares = 0` and `followers = 0` for IG rows; the engagement rate becomes `(likes + comments) / views`, which is fine — the comparison is platform-relative anyway and views/likes/comments dominate the ranking.

## Engagement rate

```
TikTok:    (digg_count + comment_count + share_count) / play_count
Instagram: (like_count + comment_count) / video_view_count
```

Filter out entries with `views < 1000` — long-tail noise that wastes VidJutsu credits.

## Resolving fetchable MP4 URLs (`download_media=true`)

The MP4 URLs embedded in search responses (`play_addr.url_list[0]`, `video_url`) live on TikTok/IG/Meta source CDNs that gatekeep by client fingerprint. They're fetchable from "boring" infra (Scrape Creators' own egress, sometimes VidJutsu's) but **not from Gemini's egress**, which is what `/v1/watch` ultimately uses.

The fix is the dedicated post-detail endpoints with `download_media=true`:

```
GET https://api.scrapecreators.com/v2/tiktok/video?url=<post_url>&download_media=true
GET https://api.scrapecreators.com/v1/instagram/post?url=<post_url>&download_media=true
```

Scrape Creators fetches the MP4 server-side and parks it on Supabase, returning:

```json
{
  "success": true,
  "download_media_urls": [
    {
      "post_id": "...",
      "original_url": "https://v19.tiktokcdn-us.com/...",
      "cdn_url": "https://udzuvxmziagmfowmeren.supabase.co/storage/v1/object/public/media_assets/<platform>/<id>/<file>.mp4",
      "type": "video"
    }
  ]
}
```

`cdn_url` is permanent, public, and downstream-fetchable from Gemini / VidJutsu / anywhere.

## Cost

- Search call: ~1 credit. 5 query variants × 2 platforms = ~10 credits per skill run.
- `download_media=true`: 10 credits per call when media is found, 1 credit if not. For 10 top candidates that's ~100 credits.

## Failure modes

- **Empty `search_item_list` / `reels`** — niche app or query phrasing mismatch. Don't fail the whole run; carry on with whatever the other variants returned.
- **TikTok CDN URLs occasionally 404 by the time VidJutsu fetches them.** If `/v1/watch` returns a fetch error, mark `watch_status: "failed"` for that row and keep going — don't retry the search.
- **Common-noun app names produce many false positives** ("Ladder" matches Jacob's ladder, agility ladder, etc.). The cheap classifier in step 3 catches what it can; VidJutsu confirms the top 10. If your app name is a common noun, pass `false_positive_keywords` to pre-prune.
