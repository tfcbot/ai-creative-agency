# 05 — Host on the CDN

Zernio fetches images from public URLs, not local files. Upload every PNG to the VidJutsu CDN and capture a stable `cdn.vidjutsu.ai/...` URL per slide.

## Tool

VidJutsu CLI (preferred) or REST. See `references/vidjutsu-cdn.md` for both.

CLI is the easy path:

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

## Steps

1. **Upload in carousel order.** Slide 1 first, slide 2 second, … last slide last. Order matters in the next step.
2. **Capture the `url` field** from each response. Discard `key`, `assetId`, and `size` unless you're auditing.
3. **Save the URL list to `post.md`** in carousel order:

   ```markdown
   # Carousel slide URLs

   1. https://cdn.vidjutsu.ai/.../slide_1.png
   2. https://cdn.vidjutsu.ai/.../slide_2.png
   …
   7. https://cdn.vidjutsu.ai/.../slide_7.png
   ```

4. **Verify each URL serves publicly.** A `curl -I` against the first URL should return `Content-Type: image/png` and HTTP 200. If it doesn't, the publisher will fail silently in step 6.

## Why the CDN matters

Wavespeed returns CloudFront URLs (`d2p7pge43lyniu.cloudfront.net/...`) on completion. Those URLs *may* work as Zernio inputs but they can rotate. Re-uploading to a stable host before publishing is mandatory — Zernio's container fetch from Instagram's API may run minutes after submission, and a rotated URL means the publish fails partway through.

## Failure modes

- **`vidjutsu: command not found`.** CLI not installed. Either install it or use the REST endpoint in `references/vidjutsu-cdn.md`.
- **HTTP 401 from VidJutsu.** `VIDJUTSU_API_KEY` missing or invalid. Tell the user, surface the signup link.
- **Upload succeeds but `curl -I` returns 403 / 404.** The CDN propagation delay can be a few seconds — wait 5s and retry. If it persists, something is wrong with the upload; re-upload the file.

## Output

`post.md` with the seven (or N) URLs in the exact order they should appear in the carousel.

## Cost

Free per upload on the included VidJutsu plan. URLs are stable — they don't expire. Re-publishing the same carousel later doesn't require re-upload.
