# Scrape Creators — social media fetch

Used in step 1 to resolve a public ad URL into a downloadable MP4. Required for Meta Ad Library, TikTok, and Instagram. NOT required for YouTube (Gemini fetches YouTube directly) or local files.

## Endpoints

```
GET https://api.scrapecreators.com/v1/facebook/adLibrary/ad?id=<ad_id>
GET https://api.scrapecreators.com/v2/tiktok/video?url=<encoded_video_url>
GET https://api.scrapecreators.com/v1/instagram/post?url=<encoded_post_url>
```

Auth header: `x-api-key: $SCRAPE_CREATORS_API`

## Meta Ad Library

The Ad Library URL contains the ad ID as a query string parameter. Extract it:

```
https://www.facebook.com/ads/library/?id=1234567890123456
                                          ^^^^^^^^^^^^^^^^
```

Pass that ID to the endpoint. Response includes `videos[].video_hd_url` (preferred) or `video_sd_url` if HD isn't available.

## TikTok

Two URL formats are common — pass either to the endpoint URL-encoded:

```
https://www.tiktok.com/@<handle>/video/<id>
https://vm.tiktok.com/<short>
```

Response includes `video.play_addr.url_list` (an array of CDN URLs — try them in order). The video URLs are watermark-free because the endpoint resolves the underlying CDN, not the public watermarked variant.

## Instagram

Pass the post URL — both Reels and feed video posts work:

```
https://www.instagram.com/p/<shortcode>/
https://www.instagram.com/reel/<shortcode>/
```

Response includes `data.xdt_shortcode_media.video_url` for video posts. For carousel posts (`__typename: "XDTGraphSidecar"`) walk `edge_sidecar_to_children.edges[].node.video_url` and download the video children specifically.

## Download flow

For each resolved CDN URL:

1. `fetch(url)`
2. Stream the body to `reference/source.mp4`
3. Verify with `ffprobe` that the result is a valid MP4 with both video and audio streams

## YouTube exception

YouTube does not require the Scrape Creators path. Gemini's video understanding accepts YouTube URLs as `fileData.fileUri` directly:

```
contents: [{
  parts: [
    { fileData: { fileUri: "https://youtu.be/<id>", mimeType: "video/mp4" } },
    { text: "<analysis prompt>" }
  ]
}]
```

Skip step 1 entirely when the reference is a YouTube URL.

## Local file exception

If the user already has the reference as a local MP4, skip the network call and use the local path directly. Both Gemini (via Files API) and the verification loop can handle local files.

## Credit cost

Roughly 1 credit per call. A typical clone session — 1 reference fetch — uses 1 credit. The verification step (step 6) does NOT need to re-fetch; it analyzes the local clone output via Gemini directly.

## Failure modes

- **Meta Ad Library: ad not found** — the ad expired or was removed from the library. No workaround; pick a different reference.
- **TikTok: 403 / region blocked** — the endpoint resolves a CDN URL that's geofenced. Retry with a different time-of-day; if it persists, pick a different reference.
- **Instagram: post is private** — the endpoint only works on public posts. No workaround.
- **Resolved URL returns 404 partway through download** — TikTok's CDN URLs sometimes expire mid-download. Re-fetch the resolution endpoint to get a fresh URL list.

## Save the URL

Always write the original URL to `reference/source-url.txt` for record. If you need to regenerate the reference later (e.g. the local MP4 was lost), the URL is the only stable identifier.
