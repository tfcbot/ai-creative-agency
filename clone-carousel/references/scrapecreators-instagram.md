# Scrape Creators — Instagram post fetch

The endpoint that turns an Instagram URL into structured data with public CDN URLs for every carousel slide.

## Endpoint

```
GET https://api.scrapecreators.com/v1/instagram/post?url=<post URL>
x-api-key: $SCRAPE_CREATORS_API
```

URL accepts the standard formats:

- `https://www.instagram.com/p/<shortcode>/`
- `https://www.instagram.com/reel/<shortcode>/`
- Either with or without trailing `?img_index=…` query params (strip query params before passing for cleaner caching)

## Response shape

The interesting tree lives under `.data.xdt_shortcode_media`:

```json
{
  "credits_remaining": <int>,
  "data": {
    "xdt_shortcode_media": {
      "__typename": "XDTGraphSidecar",                  // carousel marker
      "owner": { "username": "<creator>" },
      "edge_media_to_caption": {
        "edges": [{ "node": { "text": "<caption>" } }]
      },
      "edge_media_preview_like": { "count": <likes> },
      "edge_sidecar_to_children": {
        "edges": [
          { "node": {
              "display_url": "https://instagram.fdub.../<...>.jpg",
              "accessibility_caption": "Photo by @… on …, may be a closeup of one or more people, …"
          } },
          …
        ]
      }
    }
  }
}
```

## Reading the response

- `__typename === "XDTGraphSidecar"` — multi-slide carousel (this skill's input)
- `__typename === "XDTGraphImage"` — single image post (out of scope, stop)
- `__typename === "XDTGraphVideo"` — Reel or video post (out of scope for `clone-carousel`; use `clone-ad` for video clones)
- `edge_sidecar_to_children.edges[].node.display_url` — public CloudFront URL for each slide. **Order is carousel order — preserve it.**
- `edge_sidecar_to_children.edges[].node.accessibility_caption` — IG's auto-generated alt text per slide. Useful as an extra signal during format analysis.

## Endpoint to NOT use

`/v2/instagram/media` returns `{"message": "Not Found"}` on most posts. It exists in the docs index but the v1 endpoint is the working one. Don't waste credits.

## Failure modes

- **404 / Not Found.** URL malformed (most common: trailing query params with weird characters) or the post is private / deleted. Strip query params and retry; if it still 404s, the post isn't accessible.
- **`credits_remaining: 0`.** Out of Scrape Creators budget. Stop and tell the user.
- **`display_url` returns 403 on download.** CloudFront signed URLs expire fast. Re-fetch the post from Scrape Creators (cheap, fresh URLs) and re-download immediately. Don't cache `display_url`s for later use.

## Cost

Roughly $0.01 per post fetch (one credit). Each fetch returns all carousel children — no per-slide cost.

## Persistence

Save the full JSON response to `research/post_<shortcode>.json` immediately. Re-running format analysis from local JSON is free; re-fetching from the API costs another credit and may return rotated `display_url`s.
