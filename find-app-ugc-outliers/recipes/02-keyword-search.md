# 02 — Keyword search fan-out

Hit Scrape Creators across **three lanes: TikTok, Instagram, and the Meta Ad Library**. Build 3–5 query variants from `app_name`. Cache raw responses under `<OUT>/search/` so re-runs and debugging don't re-burn credits.

## Query variants

Default set, derived from `app_name`:

```
"<app_name>"
"<app_name> app"
"<app_name> review"
"<app_name> tutorial"
"<app_name> hack"
```

If the user passes `brand_keywords`, add one variant per keyword (team names, coach names, branded hashtags, etc.).

## Endpoints

```
GET https://api.scrapecreators.com/v1/tiktok/search/keyword?query=<q>
GET https://api.scrapecreators.com/v2/instagram/reels/search?query=<q>
GET https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads?query=<q>&country=US&status=ACTIVE&trim=true
```

Auth header: `x-api-key: $SCRAPE_CREATORS_API_KEY`. Meta Ad Library endpoint shape and brand-mention filter are documented in `references/scrapecreators-meta-ads.md`.

## Reference implementation

```ts
async function searchTikTok(query: string) {
  const url = `https://api.scrapecreators.com/v1/tiktok/search/keyword?query=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: { "x-api-key": SCRAPE! } });
  if (!r.ok) return null;
  return r.json();
}

async function searchIG(query: string) {
  const url = `https://api.scrapecreators.com/v2/instagram/reels/search?query=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: { "x-api-key": SCRAPE! } });
  if (!r.ok) return null;
  return r.json();
}

async function searchMetaAds(query: string) {
  const url = `https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads?query=${encodeURIComponent(query)}&country=US&status=ACTIVE&trim=true`;
  const r = await fetch(url, { headers: { "x-api-key": SCRAPE! } });
  if (!r.ok) return null;
  return r.json();
}

const variants = [
  app_name,
  `${app_name} app`,
  `${app_name} review`,
  `${app_name} tutorial`,
  `${app_name} hack`,
  ...(brand_keywords ?? []),
];

const results = await Promise.all(
  variants.flatMap(q => [
    searchTikTok(q).then(d => ({ platform: "tiktok", query: q, data: d })),
    searchIG(q).then(d => ({ platform: "instagram", query: q, data: d })),
    searchMetaAds(q).then(d => ({ platform: "meta_ads", query: q, data: d })),
  ])
);

for (const r of results) {
  writeFileSync(`${OUT}/search/${r.platform}-${r.query.replace(/\W+/g, "-")}.json`, JSON.stringify(r.data, null, 2));
}
```

Run all three lanes in parallel via `Promise.all`. Don't add YouTube — out of scope for this skill. TikTok ad library is also out of scope (different endpoint, deferred).

UGC ranking (TikTok + IG) and Meta-ads filtering happen in different downstream paths — see `references/scrapecreators-search.md` for UGC response shapes (step 3) and `references/scrapecreators-meta-ads.md` for the Meta-ads response shape and brand-mention filter (consumed inline in `run.ts`, not a separate recipe).
