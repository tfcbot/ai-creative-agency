# 02 — Keyword search fan-out

Hit Scrape Creators across **three lanes: TikTok, Instagram, and the Meta Ad Library**. Cache every raw response under `$OUT/search/` so the agent can re-rank or re-render without re-burning credits.

For endpoint shapes, parameters, and pagination, see the official [`scrapecreators-api`](https://github.com/scrapecreators/agent-skills) skill — install with `npx skills add scrapecreators/agent-skills` and consult it via the skill router instead of duplicating docs here. The endpoints this skill consumes are listed below.

## Query variants

Build 3–5 variants from `app_name`. Plus one variant per `brand_keyword` if supplied:

```
"<app_name>"
"<app_name> app"
"<app_name> review"
"<app_name> tutorial"
"<app_name> hack"
```

## Endpoints used

| Lane | Endpoint | Purpose |
|---|---|---|
| TikTok | `GET /v1/tiktok/search/keyword?query=<q>` | Organic UGC. Returns `aweme_info[]` with `statistics.{play_count, digg_count, comment_count, share_count}` and `video.play_addr.url_list[0]`. |
| Instagram | `GET /v2/instagram/reels/search?query=<q>` | Organic UGC. Returns `reels[]` with `media.{video_view_count, like_count, comment_count, video_url}`. |
| Meta Ads | `GET /v1/facebook/adLibrary/search/ads?query=<q>&country=US&status=ACTIVE&trim=true` | Active US paid creative. Returns `searchResults[]` with `ad_archive_id`, `page_name`, `snapshot.{title, body.text, cta_text, link_url, display_format, images[], videos[]}`. |

Base: `https://api.scrapecreators.com`. Auth header: `x-api-key: $SCRAPECREATORS_API_KEY`.

## Run them in parallel

The agent can fan out with `curl` + `xargs -P` or any equivalent. For each variant, save TikTok, IG, and Meta Ads responses as separate JSON files in `$OUT/search/`:

```bash
search_one() {
  local q="$1"
  local slug=$(echo "$q" | tr -c '[:alnum:]' '-' | sed 's/-*$//')
  curl -sS -H "x-api-key: $SCRAPECREATORS_API_KEY" \
    "https://api.scrapecreators.com/v1/tiktok/search/keyword?query=$(jq -rn --arg q "$q" '$q|@uri')" \
    > "$OUT/search/tiktok-$slug.json"
  curl -sS -H "x-api-key: $SCRAPECREATORS_API_KEY" \
    "https://api.scrapecreators.com/v2/instagram/reels/search?query=$(jq -rn --arg q "$q" '$q|@uri')" \
    > "$OUT/search/instagram-$slug.json"
  curl -sS -H "x-api-key: $SCRAPECREATORS_API_KEY" \
    "https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads?query=$(jq -rn --arg q "$q" '$q|@uri')&country=US&status=ACTIVE&trim=true" \
    > "$OUT/search/meta-ads-$slug.json"
}
```

The agent is free to write a different orchestration (Bun, Python, parallel curl) — the only requirement is one JSON file per (lane, variant) pair under `$OUT/search/`.

## Out of scope

- **YouTube.** Different attention pattern; UGC for apps lives on TikTok + IG.
- **TikTok Ad Library.** Different endpoint shape, deferred until demand surfaces.
