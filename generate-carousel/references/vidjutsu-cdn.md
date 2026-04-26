# VidJutsu CDN — uploading slide PNGs

The publisher (Zernio) requires public URLs for each carousel slide. The simplest path is the VidJutsu CLI, which returns a `cdn.vidjutsu.ai/...` URL per file.

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

Capture the `url` field. That's what you pass to Zernio as the slide URL.

## Upload via REST

If you don't have the CLI installed:

```
POST https://api.vidjutsu.ai/v1/upload
Authorization: Bearer $VIDJUTSU_API_KEY
Content-Type: multipart/form-data

(form field) file=@<path>
```

Same response shape.

## Persistence

URLs are stable — they don't expire. Save the full list of slide URLs to `post.md` in the carousel order so you can re-publish or debug later without re-uploading.

## Alternatives

If the user prefers a different CDN:

- **Wavespeed CDN** — the URL returned by gpt-image-2 (`d2p7pge43lyniu.cloudfront.net/output/<uuid>.png`) is technically usable, but those URLs may rotate. Re-upload to a stable host before publishing.
- **S3 / your own host** — any URL Zernio can fetch from publicly works. Just verify it returns `Content-Type: image/png` and serves over HTTPS.

## What NOT to do

- Do not pass a local file path or `file://` URL to Zernio — it will fail silently.
- Do not pass a presigned URL with a short expiry. Zernio's container fetch from Instagram's CDN may run minutes after submission.
