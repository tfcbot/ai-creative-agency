# 02 — Keyword search fan-out

Hit Scrape Creators on **TikTok + Instagram only**. Build 3–5 query variants from `app_name`. Cache raw responses under `<OUT>/search/` so re-runs and debugging don't re-burn credits.

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
```

Auth header: `x-api-key: $SCRAPE_CREATORS_API_KEY`

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
  ])
);

for (const r of results) {
  writeFileSync(`${OUT}/search/${r.platform}-${r.query.replace(/\W+/g, "-")}.json`, JSON.stringify(r.data, null, 2));
}
```

Run TikTok and IG calls in parallel via `Promise.all`. Don't add YouTube — out of scope for this skill.

See `references/scrapecreators-search.md` for the response shapes you'll be reading from in step 3.
