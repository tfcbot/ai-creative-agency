# 03 — Rank, filter, classify

Take the cached search responses from step 2, normalize into a single `Item[]`, dedupe, drop low-signal entries, compute engagement rate, and run the cheap caption classifier from `references/classifier-rules.md`.

## Normalize

```ts
type Item = {
  platform: "tiktok" | "instagram";
  id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_rate: number;   // (likes + comments + shares) / views
  handle: string;
  followers: number;
  caption: string;
  url: string;               // public watch URL
  media_url: string;         // direct MP4 — passed to VidJutsu in step 4
  thumbnail: string | null;
  verdict: "CONFIRMED" | "NOT_APP" | "AMBIGUOUS";
  reason: string;
};
```

### TikTok

For each `aweme_info` in `search_item_list`:

```ts
const a = it.aweme_info;
{
  platform: "tiktok",
  id: a.aweme_id,
  views: a.statistics.play_count ?? 0,
  likes: a.statistics.digg_count ?? 0,
  comments: a.statistics.comment_count ?? 0,
  shares: a.statistics.share_count ?? 0,
  handle: a.author?.unique_id ?? "?",
  followers: a.author?.follower_count ?? 0,
  caption: (a.desc ?? "").replace(/\n/g, " "),
  url: `https://www.tiktok.com/@${a.author?.unique_id}/video/${a.aweme_id}`,
  media_url: a.video?.play_addr?.url_list?.[0],
  thumbnail: a.video?.cover?.url_list?.[0] ?? null,
}
```

### Instagram

For each reel under `reels[]` (each entry is a `media` wrapper or the media itself):

```ts
const m = r.media ?? r;
{
  platform: "instagram",
  id: m.id ?? m.shortcode,
  views: m.video_view_count ?? m.video_play_count ?? 0,
  likes: m.like_count ?? 0,
  comments: m.comment_count ?? 0,
  shares: 0,                                 // IG search doesn't expose shares
  handle: m.owner?.username ?? "?",
  followers: 0,
  caption: ((typeof m.caption === "string" ? m.caption : m.caption?.text) ?? "").replace(/\n/g, " "),
  url: `https://www.instagram.com/reel/${m.shortcode ?? m.id}/`,
  media_url: m.video_url,
  thumbnail: m.image_versions2?.candidates?.[0]?.url ?? m.thumbnail_url ?? null,
}
```

## Filter + dedupe

- Dedupe by `${platform}:${id}`
- Drop `views < 1000`
- Drop entries without a `media_url` (can't be sent to VidJutsu)

## Engagement rate

```ts
item.engagement_rate = item.views > 0
  ? (item.likes + item.comments + item.shares) / item.views
  : 0;
```

## Classify

Run the caption + handle rules from `references/classifier-rules.md` parametrized on the user's inputs (`app_name`, `app_handle`, `affiliate_handle_pattern`, `brand_keywords`, `false_positive_keywords`).

## Pick top 10 for VidJutsu

Sort the union of `CONFIRMED + AMBIGUOUS` by `engagement_rate` desc, take 10. `NOT_APP` rows are dropped before VidJutsu — no point burning credits on auto-excluded rows.

```ts
const top10 = items
  .filter(i => i.verdict === "CONFIRMED" || i.verdict === "AMBIGUOUS")
  .sort((a, b) => b.engagement_rate - a.engagement_rate)
  .slice(0, 10);
```

## Meta Ads — separate filter pass (no engagement signal)

Meta Ad Library exposes neither impressions nor reach for non-political ads, so Meta ads are **not** ranked into the UGC top-10 list. Instead, normalize them and filter by brand mention:

```ts
type MetaAd = {
  ad_archive_id: string;
  page_name: string;
  page_id: string;
  display_format: "IMAGE" | "VIDEO" | "DCO" | "CAROUSEL" | string;
  title: string;
  body: string;                  // snapshot.body.text, whitespace-collapsed
  cta_text: string | null;
  link_url: string | null;
  thumbnail: string | null;      // video_preview_image_url ?? images[0].resized_image_url
  start_date_string: string | null;
  ad_library_url: string;
};

function metaMatchesApp(ad: MetaAd, app_name: string, brand_keywords: string[]): boolean {
  const blob = `${ad.page_name} ${ad.title} ${ad.body} ${ad.link_url ?? ""}`.toLowerCase();
  if (blob.includes(app_name.toLowerCase())) return true;
  return brand_keywords.some(kw => blob.includes(kw.toLowerCase()));
}
```

Dedupe by `ad_archive_id`. Keep only ads where `metaMatchesApp(...)` returns true. Result is the `meta_ads[]` array passed to step 6's manifest. The brand-mention filter is intentionally strict — `query=Cluely` returns ~50k unrelated ads, and false positives flood the report. If a legit ad doesn't name the app in copy, it gets dropped; that's an acceptable tradeoff. Loosen by passing more `brand_keywords` if it bites.

Meta ads are **not** sent to VidJutsu — see SKILL.md "Hard rules" for rationale.
