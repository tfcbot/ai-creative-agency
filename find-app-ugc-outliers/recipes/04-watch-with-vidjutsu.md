# 04 — Watch top 10 with VidJutsu

For each top-10 candidate:

1. Hit Scrape Creators with `download_media=true` — Scrape Creators fetches the MP4 server-side and returns a **permanent Supabase CDN URL**.
2. Pass that Supabase URL straight into VidJutsu `/v1/watch`.

No staging, no upload, no polling. The Supabase URL is on a "boring" CDN that VidJutsu's downstream Gemini fetcher can reach without bot-check rejection — which is exactly the failure mode TikTok and Instagram source CDNs trigger.

## Endpoints

```
GET https://api.scrapecreators.com/v2/tiktok/video?url=<post_url>&download_media=true
GET https://api.scrapecreators.com/v1/instagram/post?url=<post_url>&download_media=true
```

Header: `x-api-key: $SCRAPECREATORS_API_KEY`

Both return `download_media_urls[]`:

```json
{
  "success": true,
  "download_media_urls": [
    {
      "post_id": "...",
      "original_url": "https://v19.tiktokcdn-us.com/...",
      "cdn_url": "https://udzuvxmziagmfowmeren.supabase.co/storage/v1/object/public/media_assets/tiktok/<id>/<file>.mp4",
      "type": "video"
    }
  ]
}
```

Take `download_media_urls[0].cdn_url`.

## Confirmation prompt

The prompt is parametrized on `app_name`. Build it inline at runtime:

```ts
const prompt = `You are watching this short-form video to verify whether it is about the app "${app_name}".

Reply in this exact JSON format with no other text:
{
  "is_app": true|false,
  "confidence": "high"|"medium"|"low",
  "evidence": "<one sentence — what specifically in the video tells you (UI shown, brand mention, affiliate code, etc.)>",
  "hook": "<one sentence describing the first 3 seconds — the visual + spoken opening>",
  "format": "<one short phrase: e.g. 'talking-head review', 'split-screen demo', 'unboxing', 'voiceover walkthrough', 'POV story'>"
}

Be strict. If the video uses the word "${app_name}" only as a generic noun (e.g. workout term, sports league, common dictionary word) without showing the app's UI, brand, or an affiliate code — return false.`;
```

## Reference implementation

```ts
async function downloadMedia(item: Item): Promise<string | null> {
  const endpoint = item.platform === "tiktok"
    ? `https://api.scrapecreators.com/v2/tiktok/video?url=${encodeURIComponent(item.url)}&download_media=true`
    : `https://api.scrapecreators.com/v1/instagram/post?url=${encodeURIComponent(item.url)}&download_media=true`;
  const r = await fetch(endpoint, { headers: { "x-api-key": SCRAPE } });
  if (!r.ok) return null;
  const j = await r.json() as any;
  return j?.download_media_urls?.[0]?.cdn_url ?? null;
}

async function watch(item: Item) {
  const cdnUrl = await downloadMedia(item);
  if (!cdnUrl) return { ...item, watch_status: "failed", watch_error: "download_media returned no cdn_url" };
  const r = await fetch("https://api.vidjutsu.ai/v1/watch", {
    method: "POST",
    headers: { Authorization: `Bearer ${VIDJUTSU}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mediaUrl: cdnUrl, prompt }),
  });
  if (!r.ok) return { ...item, watch_status: "failed", watch_error: `${r.status} ${await r.text()}`, cdn_url: cdnUrl };
  const j = await r.json() as any;
  return { ...item, watch_status: "ok", cdn_url: cdnUrl, watch: j.response };
}

const BATCH = 4;
const watched: any[] = [];
for (let i = 0; i < top10.length; i += BATCH) {
  const slice = top10.slice(i, i + BATCH);
  watched.push(...await Promise.all(slice.map(watch)));
}
```

## Why not pass the search-response MP4 URL straight to VidJutsu

It looks fetchable but isn't. The MP4 URLs that come back inside the search response (`aweme_info.video.play_addr.url_list[0]`, IG `media.video_url`) live on `tiktokcdn-us.com` / `cdninstagram.com` / `fbcdn.net`. Those CDNs allowlist by client fingerprint (IP range, TLS, UA). VidJutsu's downstream Gemini fetcher hits them from Google IP space, gets blocked or returned an HTML error page, and surfaces the generic *"Unable to process input image"* error. The Supabase URL from `download_media=true` lives on a CDN that doesn't gatekeep, so Gemini reads it without complaint.

`download_media=true` costs 10 SC credits per call when media is found (1 credit if not), versus 1 credit for the bare `/v2/tiktok/video` call. For 10 top candidates that's ~100 credits — still under $0.20 per skill run.

See `references/vidjutsu-watch.md` for the VidJutsu request shape, and the official [`scrapecreators-api`](https://github.com/scrapecreators/agent-skills) skill for Scrape Creators endpoint details.
