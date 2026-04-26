# Recipe 01 — Fetch the reference

## Goal

Resolve the user's reference URL into a usable media source for Gemini analysis. End state: either a local MP4 at `reference/source.mp4` (for Meta / TikTok / Instagram / local), or a YouTube URL ready to pass directly to Gemini.

## Steps

1. Read `references/scrapecreators-social.md` for endpoint details.

2. Ask the user for the reference. Accepted forms:
   - Meta Ad Library URL (`https://www.facebook.com/ads/library/?id=<id>`)
   - TikTok URL (`https://www.tiktok.com/@<handle>/video/<id>` or `https://vm.tiktok.com/<short>`)
   - Instagram post URL (`https://www.instagram.com/p/<shortcode>/` or `/reel/<shortcode>/`)
   - YouTube URL (`https://youtu.be/<id>` or `https://www.youtube.com/watch?v=<id>`)
   - Local file path

3. Save the original URL to `reference/source-url.txt` regardless of which path you take.

4. Branch on platform:

   - **Meta Ad Library** → extract the `id` query param, hit `/v1/facebook/adLibrary/ad?id=<id>`, download the `videos[].video_hd_url` to `reference/source.mp4`
   - **TikTok** → URL-encode the post URL, hit `/v2/tiktok/video?url=<encoded>`, download the first working URL from `video.play_addr.url_list`
   - **Instagram** → URL-encode the post URL, hit `/v1/instagram/post?url=<encoded>`, download `data.xdt_shortcode_media.video_url`
   - **YouTube** → no fetch needed. Just save the URL — Gemini will fetch directly in step 2.
   - **Local file** → either copy or symlink the file to `reference/source.mp4`

5. If a local MP4 was produced, verify with `ffprobe` that:
   - Duration is between 5 and 60 seconds (longer than 60 will work but isn't a typical ad reference)
   - Has both video and audio streams
   - Codec is H.264 or H.265 video + AAC audio (Gemini accepts these reliably)

   If the file fails, retry the fetch endpoint or pick a different reference.

6. Inform the user the reference is ready and report:
   - Duration in seconds
   - Resolution
   - Whether it's local MP4 or a YouTube URL

## Output

Either:

```
reference/source.mp4
reference/source-url.txt
```

Or:

```
reference/source-url.txt   (with the YouTube URL)
```

## Done when

- The reference is in one of the two acceptable forms
- The user has confirmed it's the right reference

## Constraints

- Do not download YouTube videos — Gemini handles the URL natively, and downloading violates YouTube's TOS.
- Do not save reference videos to a public location. They stay in the project's local `reference/` directory only.

## Next

→ `recipes/02-extract-shot-list.md`
