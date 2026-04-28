# 01 — Fetch the reference post

Take the Instagram URL the user gave you, hit Scrape Creators, and land every carousel slide as a local JPEG plus the post's caption and metadata as JSON.

## Endpoint

```
GET https://api.scrapecreators.com/v1/instagram/post?url=<post URL>
x-api-key: $SCRAPE_CREATORS_API
```

The `/v2/instagram/media` endpoint returns 404 for many post types — always use `/v1/instagram/post`.

## What you get back

The interesting fields live under `.data.xdt_shortcode_media`:

- `edge_media_to_caption.edges[0].node.text` — caption
- `owner.username` — reference creator
- `__typename` — `XDTGraphSidecar` for carousels, `XDTGraphImage` for single image (reject; out of scope)
- `edge_sidecar_to_children.edges[].node.display_url` — one entry per carousel slide
- `edge_sidecar_to_children.edges[].node.accessibility_caption` — IG's auto-generated alt text per slide. Useful as an extra signal for what's actually on each slide.

## Steps

1. **Make the working directory.** `clone-carousel-<YYYYMMDD-HHMM>/research/`. Save the full Scrape Creators JSON as `research/post_<shortcode>.json`. Save downloaded slides as `research/images/slide_<N>.jpg` (1-indexed, in carousel order).
2. **Hit Scrape Creators.** One GET, capture the full body to disk.
3. **Verify it's a carousel.** If `__typename !== "XDTGraphSidecar"`, stop. This skill needs at least 2 slides.
4. **Capture the children URLs in order.** Iterate `edge_sidecar_to_children.edges[]` — the array order IS the swipe order on Instagram. Don't sort it.
5. **Download each slide.** Plain HTTP GET on the `display_url`. Save to `research/images/slide_<N>.jpg`.
6. **Capture the caption and the accessibility captions.** You'll feed both into the format-analysis step. The accessibility caption per slide tells you what IG's vision model thinks is on the image (people, makeup, text, devices, etc.) — a useful extra signal even though you'll also look at the pixels yourself.

## Output

After this step the working directory has:

```
clone-carousel-<ts>/research/
├── post_<shortcode>.json     # full Scrape Creators response
└── images/
    ├── slide_1.jpg
    ├── slide_2.jpg
    └── …
```

You also know:
- The reference creator's username (for context, not to copy)
- The full caption (to feed the caption-format step later)
- How many slides the carousel has (drives how many slide specs you'll write)

## Failure modes

- **404 on the v1 endpoint.** Double-check the URL has the shortcode (`/p/<shortcode>/` or `/reel/<shortcode>/`). Strip query params before passing.
- **`__typename: XDTGraphImage` instead of Sidecar.** Single-image post. This skill is carousel-only; tell the user and stop.
- **`message: "Not Found"` at the top level.** You used `/v2/instagram/media` instead of `/v1/instagram/post`. Switch.
- **`display_url` returns 403 on download.** The CloudFront signed URLs expire fast. Re-fetch the post from Scrape Creators (free retry, fresh URLs) and re-download immediately.
