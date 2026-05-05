# 04 — Verify with profile + VidJutsu

For each top-10 candidate, run **two checks in parallel** before deciding `is_app`:

1. **Fetch the creator's profile bio** via Scrape Creators. Affiliate creators often park a low-key CTA in their bio (e.g. Her75 app — `"my fitness era → her75.app"` in the bio with no mention in any individual post). The profile bio is sometimes the only attribution signal that survives.
2. **Fetch the playable MP4** via `download_media=true` — same Supabase-CDN detour as before so VidJutsu's downstream Gemini fetcher isn't blocked by source-CDN gatekeeping.

Then send both to VidJutsu `/v1/watch` with a single prompt that decides `is_app` based on **video content + bio context**.

Only entries where VidJutsu returns `is_app: true` go into the final report. Unverified and `is_app: false` rows are kept in the manifest for debugging but never rendered.

## Endpoints

```
# Profile (bio)
GET https://api.scrapecreators.com/v1/tiktok/profile?handle=<h>
GET https://api.scrapecreators.com/v1/instagram/profile?handle=<h>

# Playable MP4 (Supabase-staged for Gemini)
GET https://api.scrapecreators.com/v2/tiktok/video?url=<post_url>&download_media=true
GET https://api.scrapecreators.com/v1/instagram/post?url=<post_url>&download_media=true
```

Header: `x-api-key: $SCRAPECREATORS_API_KEY`

The profile endpoint returns the bio text (TikTok: `user.signature`, IG: `data.user.biography`), the bio link (TT: `user.bio_link.link` or just URLs in signature; IG: `data.user.external_url`), and follower counts. Cache the response to `$OUT/search/profile-{platform}-{handle}.json` so re-runs of step 4 from cache are free.

`download_media=true` returns `download_media_urls[0].cdn_url` — that's what VidJutsu gets.

## Confirmation prompt (parametrized on `app_name` + bio)

```ts
const prompt = `You are watching a short-form video to verify whether it is about the app "${app_name}".

You also have additional context — the creator's profile bio:
"""
${profile.bio}
${profile.bio_link ?? ""}
"""

Reply in this exact JSON format with no other text:
{
  "is_app": true|false,
  "confidence": "high"|"medium"|"low",
  "evidence": "<one sentence — what specifically tells you this is/isn't about the app: UI shown, brand mention in audio, affiliate code, bio CTA, or false-match>",
  "bio_signal": "<'cta' if the bio links/mentions the app or an affiliate landing page for it, 'soft' if the bio mentions the app casually without a clear CTA, 'none' if the bio is unrelated>",
  "hook": "<one sentence describing the first 3 seconds — visual + spoken opening>",
  "format": "<one short phrase: e.g. 'talking-head review', 'split-screen demo', 'unboxing', 'voiceover walkthrough', 'POV story'>",
  "shot_list": ["<shot 1 description>", "<shot 2>", "<shot 3>", "..."]
}

Be strict on is_app. The video must show the app's UI, mention the brand by name in audio, OR the bio must contain a clear CTA to the app's landing page or an affiliate code for it. If the word "${app_name}" appears only as a generic noun (workout term, sports league, common dictionary word) and the bio is unrelated, return false.

The bio is decisive context — if the bio CTAs the app, treat ambiguous video evidence as confirmation. If the bio is unrelated, weight video evidence harder.

For shot_list, return 3-6 short phrases describing the actual shots in order. This feeds the pattern-synthesis step.`;
```

## Reference orchestration

```ts
async function fetchProfile(item: Item): Promise<{bio: string, bio_link: string | null, followers: number}> {
  const endpoint = item.platform === "tiktok"
    ? `https://api.scrapecreators.com/v1/tiktok/profile?handle=${item.handle}`
    : `https://api.scrapecreators.com/v1/instagram/profile?handle=${item.handle}`;
  const r = await fetch(endpoint, { headers: { "x-api-key": SCRAPE } });
  if (!r.ok) return { bio: "", bio_link: null, followers: 0 };
  const j = await r.json() as any;
  if (item.platform === "tiktok") {
    return {
      bio: j.user?.signature ?? "",
      bio_link: j.user?.bio_link?.link ?? null,
      followers: j.user?.follower_count ?? 0,
    };
  } else {
    return {
      bio: j.data?.user?.biography ?? "",
      bio_link: j.data?.user?.external_url ?? null,
      followers: j.data?.user?.edge_followed_by?.count ?? 0,
    };
  }
}

async function downloadMedia(item: Item): Promise<string | null> {
  const endpoint = item.platform === "tiktok"
    ? `https://api.scrapecreators.com/v2/tiktok/video?url=${encodeURIComponent(item.url)}&download_media=true`
    : `https://api.scrapecreators.com/v1/instagram/post?url=${encodeURIComponent(item.url)}&download_media=true`;
  const r = await fetch(endpoint, { headers: { "x-api-key": SCRAPE } });
  if (!r.ok) return null;
  const j = await r.json() as any;
  return j?.download_media_urls?.[0]?.cdn_url ?? null;
}

async function verify(item: Item) {
  const [profile, cdnUrl] = await Promise.all([fetchProfile(item), downloadMedia(item)]);
  if (!cdnUrl) return { ...item, watch_status: "failed", watch_error: "no cdn_url", profile };

  const r = await fetch("https://api.vidjutsu.ai/v1/watch", {
    method: "POST",
    headers: { Authorization: `Bearer ${VIDJUTSU}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mediaUrl: cdnUrl, prompt: buildPrompt(app_name, profile) }),
  });
  if (!r.ok) return { ...item, watch_status: "failed", watch_error: `${r.status}`, cdn_url: cdnUrl, profile };
  const j = await r.json() as any;
  return { ...item, watch_status: "ok", cdn_url: cdnUrl, profile, watch: j.response };
}

const BATCH = 4;
const watched: any[] = [];
for (let i = 0; i < top10.length; i += BATCH) {
  watched.push(...await Promise.all(top10.slice(i, i + BATCH).map(verify)));
}
```

## Why bio context is decisive

For mid-funnel apps, the creator-brand relationship is intentionally low-signal — affiliates make more money when posts read as organic. The Her75 case is the canonical example: 12 affiliate creators, none of whom mention "Her75" in any post audio, but every one of them links `her75.app` (or a per-creator vanity subdomain) in the bio. Without the bio check, VidJutsu can't tell those posts apart from random fitness UGC. With it, the verdict is clean.

## Why this gatekeeps the report

The previous version of this skill rendered all top-10 entries with a `?` next to unverified ones. In practice nobody clicks through unverified entries — the friction kills the workflow. The report now contains only `is_app: true` rows. Anything `false` or `failed` lives in the manifest under `verified[]` for debugging but doesn't appear in `report.html`.

If too few entries verify (< 3), the agent should surface that to the user as a signal to either widen `brand_keywords` or accept that this app simply doesn't have much organic UGC.
