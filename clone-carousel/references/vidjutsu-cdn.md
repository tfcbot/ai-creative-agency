# VidJutsu CDN — uploading slide PNGs

Zernio fetches slide images from public URLs at publish time. The simplest path is the VidJutsu CLI, which returns a stable `cdn.vidjutsu.ai/...` URL per file.

## Upload via CLI

```
vidjutsu upload <path-to-png>
```

Returns:

```json
{
  "key": "uploads/<workspace>/<uuid>.png",
  "size": <bytes>,
  "url": "https://cdn.vidjutsu.ai/uploads/<workspace>/<uuid>.png",
  "assetId": "asset_<uuid>"
}
```

Capture the `url`. That's what you pass to Zernio as the slide URL.

## Upload via REST

If the CLI isn't installed:

```
POST https://api.vidjutsu.ai/v1/upload
Authorization: Bearer $VIDJUTSU_API_KEY
Content-Type: multipart/form-data

(form field) file=@<path>
```

Same response shape.

## Persistence

URLs are stable — they don't expire. Save the full list of slide URLs to `post.md` in carousel order so you can re-publish or debug later without re-uploading.

## Why not pass Wavespeed CloudFront URLs directly to Zernio?

Wavespeed returns `d2p7pge43lyniu.cloudfront.net/output/<uuid>.png` URLs on completion. They are technically usable but they may rotate. Re-uploading to a stable host is mandatory because:

- Zernio's container fetch from Instagram's API may run minutes after submission
- A rotated URL between submission and fetch causes the publish to fail partway through, and the failure surfaces as a confusing "image fetch error" with no clear root cause

The 1-second extra step here saves a 10-minute debugging session later.

## Alternatives

If the user prefers a different CDN:

- **S3 / Cloudflare R2 / their own host** — any URL Zernio can fetch from publicly works. Just verify it returns `Content-Type: image/png` and serves over HTTPS.
- **Do not** use presigned URLs with short expiries (< 1 hour). Same rotation problem as Wavespeed CDN.
- **Do not** pass a local file path or `file://` URL to Zernio — it fails silently.

## Failure modes

- **`vidjutsu: command not found`.** CLI not installed locally. Either install it (`npm i -g vidjutsu` or per the VidJutsu docs) or fall back to the REST endpoint above.
- **HTTP 401 from VidJutsu.** `VIDJUTSU_API_KEY` missing, expired, or invalid. Stop and ask the user to refresh.
- **Upload returns 200 but `curl -I <url>` returns 403/404.** CDN propagation delay. Wait 5 seconds and retry the HEAD request. If it persists, re-upload the file — something went wrong with the original upload.

## Cost

Free per upload on the included VidJutsu plan. URLs persist indefinitely.
