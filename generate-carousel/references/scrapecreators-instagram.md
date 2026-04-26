# Scrape Creators — Instagram endpoints

Used for niche research before designing a carousel. Pull a reference account's profile + recent posts to identify the format pattern they're using, then design your own piece in the same grammar.

## Endpoints

```
GET https://api.scrapecreators.com/v1/instagram/profile?handle=<handle>
GET https://api.scrapecreators.com/v1/instagram/user/posts?handle=<handle>
GET https://api.scrapecreators.com/v1/instagram/post?url=https://www.instagram.com/p/<shortcode>
```

Auth header: `x-api-key: $SCRAPE_CREATORS_API`

## Profile

Returns bio, follower count, external URLs, and `bio_links`. Useful for verifying the account exists and the niche matches.

## User posts

Returns the most recent ~12 posts. Each entry has:

- `node.__typename` — `GraphSidecar` (carousel), `GraphImage` (single), `GraphVideo` (reel)
- `node.shortcode` — the post's IG shortcode (e.g. `DXhDaxviHTw`)
- `node.edge_media_to_caption.edges[0].node.text` — the caption
- `node.edge_sidecar_to_children.edges` — for carousels, an array of children with `node.display_url`
- `node.edge_media_preview_like.count` — likes
- `node.edge_media_to_comment.count` — comments
- `node.taken_at_timestamp` — Unix seconds

Filter the response to `__typename === "GraphSidecar"` to isolate carousels. Sort by likes or comments to find the format pattern that's actually working.

## Single post detail

For each high-engagement carousel, hit `/v1/instagram/post` to get the full child list with stable image URLs:

```
GET /v1/instagram/post?url=https://www.instagram.com/p/<shortcode>
```

Response shape:

```
data.xdt_shortcode_media
  .__typename: "XDTGraphSidecar"
  .shortcode
  .edge_sidecar_to_children.edges[].node
    .display_url      // image URL (CDN)
    .is_video         // skip these
    .video_url        // present if it's a video
```

## Download flow

Walk each `edges[].node.display_url`, download via `fetch`, save to `research/images/<shortcode>_s<N>.jpg`. Inspect the cover (slide 1) and 1–2 inside slides to identify the format.

## Credit cost

Roughly 1 credit per call. A typical research session — profile + posts + 5 individual carousels — uses ~7 credits.

## Rate limits

No documented rate limit, but spacing requests by ~500ms is sensible if you're scraping at scale.

## What NOT to do

- Do not reproduce specific competitor copy, headlines, or imagery in your generated slides. Use the research to identify the **format grammar** (cover composition, layer structure, typography motif), then write your own content from scratch that fits that grammar.
- Do not use a competitor's wordmark or brand name in any slide.
- Do not download or republish the reference images themselves — they're for visual format study only.
