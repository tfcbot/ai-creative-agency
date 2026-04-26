# Recipe 05 — Host slides on a CDN

## Goal

Get a stable public URL for each slide PNG. Zernio fetches these URLs when it creates the Instagram carousel container.

## Steps

1. Read `references/vidjutsu-cdn.md` for the canonical upload path.

2. Upload each slide:

   ```
   vidjutsu upload frames/slide_1_cover.png
   vidjutsu upload frames/slide_2_<topic>.png
   …
   vidjutsu upload frames/slide_N_closer.png
   ```

   Each call returns a JSON object with a `url` field. Capture all URLs in order into `post.md`:

   ```
   slide 1: https://cdn.vidjutsu.ai/uploads/<workspace>/<uuid>.png
   slide 2: https://cdn.vidjutsu.ai/uploads/<workspace>/<uuid>.png
   …
   ```

3. Verify each URL by fetching it once with `curl -I` to confirm it returns `200 OK` and `Content-Type: image/png`.

4. Verify slide order matches the carousel's intended swipe order. Double-check the cover is first and the closer is last.

## Output

```
post.md   (with the full ordered list of slide URLs)
```

## Done when

- Every slide has a public CDN URL captured in `post.md`
- Every URL returns 200 OK on a HEAD request
- The order in `post.md` matches the intended swipe order

## Alternatives

If the user uses a different CDN — S3, Cloudflare R2, their own host — substitute the upload step. Any CDN that returns a stable public PNG URL works.

## Next

→ `recipes/06-write-caption.md`
