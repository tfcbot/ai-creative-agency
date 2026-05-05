# VidJutsu — `/v1/watch`

AI watches a video and answers a freeform prompt. Returns structured JSON. 10 credits per call.

## Endpoint

```
POST https://api.vidjutsu.ai/v1/watch
Authorization: Bearer $VIDJUTSU_API_KEY
Content-Type: application/json

{
  "mediaUrl": "<remote MP4 URL>",
  "prompt": "<freeform — see below>"
}
```

Response:

```json
{ "response": { ...whatever your prompt asked for as JSON... } }
```

## Why VidJutsu instead of Gemini Files API

- VidJutsu accepts the remote MP4 URL **directly**. No download / resumable-upload / poll-for-ACTIVE / cleanup dance.
- One call replaces ~5 Gemini calls per video (start upload, finalize bytes, poll, classify, delete).
- Gemini's `fileData.fileUri` only accepts YouTube URLs for the URL form, so for TikTok / IG MP4s you'd be forced into Files API anyway.
- VidJutsu is the correct provider for the AI-creative-agency repo per ETHOS principle 4 ("VidJutsu for QA").

## Confirmation prompt template (bio-aware)

```
You are watching a short-form video to verify whether it is about the app "<app_name>".

You also have additional context — the creator's profile bio:
"""
<bio text>
<bio link if present>
"""

Reply in this exact JSON format with no other text:
{
  "is_app": true|false,
  "confidence": "high"|"medium"|"low",
  "evidence": "<one sentence — what specifically tells you this is/isn't about the app: UI shown, brand mention in audio, affiliate code, bio CTA, or false-match>",
  "bio_signal": "<'cta' if the bio links/mentions the app or an affiliate landing page for it, 'soft' if the bio mentions casually without a clear CTA, 'none' if the bio is unrelated>",
  "hook": "<one sentence describing the first 3 seconds — visual + spoken opening>",
  "format": "<one short phrase: e.g. 'talking-head review', 'split-screen demo', 'unboxing', 'voiceover walkthrough', 'POV story'>",
  "shot_list": ["<shot 1>", "<shot 2>", "<shot 3>", "..."]
}

Be strict on is_app. The video must show the app's UI, mention the brand by name in audio, OR the bio must contain a clear CTA to the app's landing page or an affiliate code for it. If "<app_name>" appears only as a generic noun and the bio is unrelated, return false.

The bio is decisive context — if the bio CTAs the app, treat ambiguous video evidence as confirmation. If the bio is unrelated, weight video evidence harder.

For shot_list, return 3-6 short phrases describing actual shots in order. This feeds the pattern-synthesis step.
```

## Why bio context matters

Affiliate UGC is intentionally low-signal in-post — affiliates make more money when posts read as organic. The Her75 case: 12 affiliate creators, none mention "Her75" in audio, all link `her75.app/<vanity>` in bio. Without bio context, VidJutsu would reject every post as a false positive. With it, every post resolves to `is_app: true, bio_signal: "cta"` cleanly.

## Hard-won learnings

1. **TikTok/IG source-CDN URLs do NOT work as `mediaUrl`.** `tiktokcdn-us.com`, `cdninstagram.com`, and `fbcdn.net` allowlist by client fingerprint (IP range, TLS, UA). VidJutsu's downstream Gemini fetcher hits them from Google's IP space, gets blocked, and surfaces *"Unable to process input image"*. Same URL works fine when fetched from VidJutsu's own infra (e.g. `/v1/upload/url`) — the failure is who is fetching, not what's at the URL.
   - **Fix in this skill:** call Scrape Creators with `download_media=true` and pass the returned Supabase `cdn_url` to `/v1/watch`. Supabase doesn't gatekeep, Gemini reads it cleanly.
   - **Alternative fix** (if Scrape Creators isn't in the loop): stage the URL via VidJutsu `/v1/upload/url` first.
2. **Use the `mediaUrl` field, not `url`.** Banked from the EP-01 dead-space detection run — `url` silently does the wrong thing.
3. **Bearer auth, not `x-api-key`.** The Scrape Creators side uses `x-api-key`; VidJutsu uses `Authorization: Bearer`. Don't cargo-cult one onto the other.
4. **Batch parallelism of 4** is a comfortable concurrency level for `/v1/watch`. Higher hits rate-limits on common days; lower drags the run.
5. **The `response` field always exists on 200**, but its shape is whatever the prompt asked for — no schema enforcement. Always specify the JSON shape inline in the prompt.
6. **Public Supabase / S3 / GCS URLs work directly with Gemini too.** Confirmed: `file_data.file_uri` pointed at a public Supabase storage URL is read by Gemini's video understanding without going through Files API. The "fileUri only accepts YouTube/gs://" docs rule is more permissive in practice — what really matters is whether the host CDN gatekeeps Google's egress.

## Failure modes

- **Source MP4 expired / 404** — VidJutsu surfaces a fetch error in the response. Mark the row `watch_status: "failed"` and move on; don't refetch the search.
- **Model returns prose instead of JSON** — usually means the prompt didn't pin the schema strongly. Re-issue the call once with a stricter prompt; if it fails twice, log raw and continue.
- **Rate-limited** — back off batch size or sleep between batches. The default 10 daily-cap budget covers one full run of this skill (10 watches).
