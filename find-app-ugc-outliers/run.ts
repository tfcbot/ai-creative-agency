#!/usr/bin/env bun
// find-app-ugc-outliers — discover viral TikTok/IG UGC for any app.
// Usage:
//   bun run.ts --app "Cluely"
//   bun run.ts --app "Ladder" --handle joinladder --affiliate-pattern ".*fromladder$" \
//     --brand-keywords "team transform,team define" --false-positives "jacob's ladder,agility ladder"

import { mkdirSync, writeFileSync } from "fs";

// ── 1. Validate keys ──────────────────────────────────────────────────────────
const SCRAPE = process.env.SCRAPE_CREATORS_API_KEY ?? process.env.SCRAPE_CREATORS_API;
const VIDJUTSU = process.env.VIDJUTSU_API_KEY;
if (!SCRAPE) { console.error("Missing SCRAPE_CREATORS_API_KEY. Sign up: https://app.scrapecreators.com"); process.exit(1); }
if (!VIDJUTSU) { console.error("Missing VIDJUTSU_API_KEY. Sign up: https://vidjutsu.ai"); process.exit(1); }

// ── Args ──────────────────────────────────────────────────────────────────────
function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const app_name = arg("--app");
if (!app_name) { console.error("Usage: bun run.ts --app \"<App Name>\" [--handle <h>] [--affiliate-pattern <re>] [--brand-keywords \"a,b,c\"] [--false-positives \"x,y\"]"); process.exit(1); }
const app_handle = arg("--handle");
const affiliate_handle_pattern = arg("--affiliate-pattern");
const brand_keywords = arg("--brand-keywords")?.split(",").map(s => s.trim()).filter(Boolean) ?? [];
const false_positive_keywords = arg("--false-positives")?.split(",").map(s => s.trim()).filter(Boolean) ?? [];

const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT = `${process.cwd()}/find-app-ugc-outliers-${ts}`;
mkdirSync(`${OUT}/search`, { recursive: true });

// ── 2. Keyword search fan-out (TikTok + Instagram only) ───────────────────────
const variants = Array.from(new Set([
  app_name,
  `${app_name} app`,
  `${app_name} review`,
  `${app_name} tutorial`,
  `${app_name} hack`,
  ...brand_keywords,
]));

async function searchTikTok(query: string): Promise<any> {
  const r = await fetch(`https://api.scrapecreators.com/v1/tiktok/search/keyword?query=${encodeURIComponent(query)}`,
    { headers: { "x-api-key": SCRAPE! } });
  return r.ok ? r.json() : null;
}
async function searchIG(query: string): Promise<any> {
  const r = await fetch(`https://api.scrapecreators.com/v2/instagram/reels/search?query=${encodeURIComponent(query)}`,
    { headers: { "x-api-key": SCRAPE! } });
  return r.ok ? r.json() : null;
}
async function searchMetaAds(query: string): Promise<any> {
  // Meta Ad Library — keyword search, US, currently-active, sorted by impressions (default).
  // trim=true keeps the payload small; we still get title, body, cta, link_url, videos[], images[].
  const url = `https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads?query=${encodeURIComponent(query)}&country=US&status=ACTIVE&trim=true`;
  const r = await fetch(url, { headers: { "x-api-key": SCRAPE! } });
  return r.ok ? r.json() : null;
}

console.log(`Searching ${variants.length} variants × 3 lanes (TikTok, Instagram, Meta Ads)…`);
const searchTasks: Promise<{ platform: string; query: string; data: any; path: string }>[] = [];
const metaAdsTasks: Promise<{ query: string; data: any; path: string }>[] = [];
for (const q of variants) {
  const slug = q.replace(/\W+/g, "-");
  searchTasks.push(searchTikTok(q).then(d => {
    const path = `search/tiktok-${slug}.json`;
    writeFileSync(`${OUT}/${path}`, JSON.stringify(d, null, 2));
    return { platform: "tiktok", query: q, data: d, path };
  }));
  searchTasks.push(searchIG(q).then(d => {
    const path = `search/instagram-${slug}.json`;
    writeFileSync(`${OUT}/${path}`, JSON.stringify(d, null, 2));
    return { platform: "instagram", query: q, data: d, path };
  }));
  metaAdsTasks.push(searchMetaAds(q).then(d => {
    const path = `search/meta-ads-${slug}.json`;
    writeFileSync(`${OUT}/${path}`, JSON.stringify(d, null, 2));
    return { query: q, data: d, path };
  }));
}
const [searchResults, metaAdsResults] = await Promise.all([
  Promise.all(searchTasks),
  Promise.all(metaAdsTasks),
]);

// ── 3. Normalize, dedupe, classify ────────────────────────────────────────────
type Verdict = "CONFIRMED" | "NOT_APP" | "AMBIGUOUS";
type Item = {
  platform: "tiktok" | "instagram";
  id: string;
  views: number; likes: number; comments: number; shares: number;
  engagement_rate: number;
  handle: string; followers: number; caption: string;
  url: string; media_url: string; thumbnail: string | null;
  verdict: Verdict; reason: string;
};

function classify(handle: string, caption: string): { verdict: Verdict; reason: string } {
  const h = handle.toLowerCase();
  const c = caption.toLowerCase();
  const app = app_name!.toLowerCase();

  if (affiliate_handle_pattern) {
    try {
      const re = new RegExp(affiliate_handle_pattern, "i");
      if (re.test(handle)) return { verdict: "CONFIRMED", reason: `handle matches '${affiliate_handle_pattern}'` };
    } catch {}
  }
  if (app_handle) {
    const ah = app_handle.toLowerCase().replace(/^@/, "");
    if (h === ah || h.startsWith(ah)) return { verdict: "CONFIRMED", reason: `brand-owned handle (${ah})` };
    if (c.includes(`@${ah}`)) return { verdict: "CONFIRMED", reason: `caption tags @${ah}` };
  }
  if (c.includes(`#${app}app`) || c.includes(`${app} app`) || c.includes(`#${app}`)) {
    return { verdict: "CONFIRMED", reason: `caption uses '#${app}' / '${app} app'` };
  }
  for (const kw of brand_keywords) if (c.includes(kw.toLowerCase())) {
    return { verdict: "CONFIRMED", reason: `brand keyword '${kw}'` };
  }
  for (const fp of false_positive_keywords) if (c.includes(fp.toLowerCase())) {
    return { verdict: "NOT_APP", reason: `false-positive '${fp}'` };
  }
  return { verdict: "AMBIGUOUS", reason: "no clear caption signal" };
}

const items: Item[] = [];
const seen = new Set<string>();

for (const r of searchResults) {
  if (!r.data) continue;
  if (r.platform === "tiktok") {
    for (const it of (r.data.search_item_list ?? [])) {
      const a = it.aweme_info; if (!a?.statistics) continue;
      const id = a.aweme_id; const key = `tiktok:${id}`;
      if (seen.has(key)) continue; seen.add(key);
      const handle = a.author?.unique_id ?? "?";
      const caption = (a.desc ?? "").replace(/\n/g, " ");
      const views = a.statistics.play_count ?? 0;
      const likes = a.statistics.digg_count ?? 0;
      const comments = a.statistics.comment_count ?? 0;
      const shares = a.statistics.share_count ?? 0;
      const media_url = a.video?.play_addr?.url_list?.[0] ?? "";
      if (views < 1000) continue;
      const { verdict, reason } = classify(handle, caption);
      items.push({
        platform: "tiktok", id, views, likes, comments, shares,
        engagement_rate: views > 0 ? (likes + comments + shares) / views : 0,
        handle, followers: a.author?.follower_count ?? 0, caption,
        url: `https://www.tiktok.com/@${handle}/video/${id}`,
        media_url, thumbnail: a.video?.cover?.url_list?.[0] ?? null,
        verdict, reason,
      });
    }
  } else {
    for (const x of (r.data.reels ?? [])) {
      const m = x.media ?? x;
      const id = m.id ?? m.shortcode; if (!id) continue;
      const key = `instagram:${id}`;
      if (seen.has(key)) continue; seen.add(key);
      const handle = m.owner?.username ?? "?";
      const cap = m.caption;
      const caption = ((typeof cap === "string" ? cap : cap?.text) ?? "").replace(/\n/g, " ");
      const views = m.video_view_count ?? m.video_play_count ?? 0;
      const likes = m.like_count ?? 0;
      const comments = m.comment_count ?? 0;
      // We don't pass media_url to VidJutsu directly — download_media=true returns a fresh
      // Supabase URL at watch time. But keep the source URL on the row for the manifest.
      const media_url = m.video_url ?? "";
      if (views < 1000) continue;
      const { verdict, reason } = classify(handle, caption);
      items.push({
        platform: "instagram", id, views, likes, comments, shares: 0,
        engagement_rate: views > 0 ? (likes + comments) / views : 0,
        handle, followers: m.owner?.follower_count ?? 0, caption,
        url: m.url ?? `https://www.instagram.com/reel/${m.shortcode ?? id}/`,
        media_url,
        thumbnail: m.thumbnail_src ?? m.display_url ?? m.image_versions2?.candidates?.[0]?.url ?? null,
        verdict, reason,
      });
    }
  }
}

const verdictCounts = items.reduce((a: Record<string, number>, x) => { a[x.verdict] = (a[x.verdict] ?? 0) + 1; return a; }, {});
console.log(`Candidates: ${items.length} (${JSON.stringify(verdictCounts)})`);

const top10 = items
  .filter(i => i.verdict !== "NOT_APP")
  .sort((a, b) => b.engagement_rate - a.engagement_rate)
  .slice(0, 10);

console.log(`Top 10 by engagement → VidJutsu`);

// ── 4. Watch top 10 with VidJutsu ─────────────────────────────────────────────
const prompt = `You are watching this short-form video to verify whether it is about the app "${app_name}".

Reply in this exact JSON format with no other text:
{
  "is_app": true|false,
  "confidence": "high"|"medium"|"low",
  "evidence": "<one sentence — what specifically in the video tells you>",
  "hook": "<one sentence describing the first 3 seconds>",
  "format": "<one short phrase: e.g. 'talking-head review', 'split-screen demo', 'unboxing', 'voiceover walkthrough', 'POV story'>"
}

Be strict. If "${app_name}" appears only as a generic noun (workout term, sports league, dictionary word) without showing the app's UI, brand, or affiliate code — return false.`;

async function downloadMedia(item: Item): Promise<string | null> {
  // download_media=true tells Scrape Creators to fetch the MP4 and park it on a permanent
  // Supabase CDN URL. Costs 10 credits/call when media is found, 1 if not.
  const endpoint = item.platform === "tiktok"
    ? `https://api.scrapecreators.com/v2/tiktok/video?url=${encodeURIComponent(item.url)}&download_media=true`
    : `https://api.scrapecreators.com/v1/instagram/post?url=${encodeURIComponent(item.url)}&download_media=true`;
  const r = await fetch(endpoint, { headers: { "x-api-key": SCRAPE! } });
  if (!r.ok) return null;
  const j = await r.json() as any;
  return j?.download_media_urls?.[0]?.cdn_url ?? null;
}

async function watch(item: Item): Promise<any> {
  try {
    const cdnUrl = await downloadMedia(item);
    if (!cdnUrl) return { ...item, watch_status: "failed", watch_error: "download_media returned no cdn_url" };

    const r = await fetch("https://api.vidjutsu.ai/v1/watch", {
      method: "POST",
      headers: { Authorization: `Bearer ${VIDJUTSU}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mediaUrl: cdnUrl, prompt }),
    });
    if (!r.ok) return { ...item, watch_status: "failed", watch_error: `${r.status} ${(await r.text()).slice(0, 200)}`, cdn_url: cdnUrl };
    const j = await r.json() as any;
    let resp = j.response;
    if (typeof resp === "string") { try { resp = JSON.parse(resp); } catch {} }
    return { ...item, watch_status: "ok", cdn_url: cdnUrl, watch: resp };
  } catch (e: any) {
    return { ...item, watch_status: "failed", watch_error: e?.message ?? String(e) };
  }
}

const BATCH = 4;
const watched: any[] = [];
for (let i = 0; i < top10.length; i += BATCH) {
  const slice = top10.slice(i, i + BATCH);
  const results = await Promise.all(slice.map(watch));
  watched.push(...results);
  for (const r of results) {
    console.log(`  [${watched.length}/${top10.length}] @${r.handle} (${r.platform}, ${r.views.toLocaleString()} views) → is_app=${r.watch?.is_app ?? "?"}`);
  }
}

// ── 4b. Normalize Meta Ads ────────────────────────────────────────────────────
// Meta ads are not ranked into the UGC table — they have no engagement metrics
// (Meta Ad Library exposes neither impressions nor reach for non-political ads).
// Surface them as a separate section so the user sees what the brand is paying
// to push alongside what creators are organically posting.
type MetaAd = {
  ad_archive_id: string;
  page_name: string;
  page_id: string;
  is_active: boolean;
  start_date_string: string | null;
  end_date_string: string | null;
  display_format: string;
  title: string;
  body: string;
  cta_text: string | null;
  link_url: string | null;
  video_url: string | null;
  thumbnail: string | null;
  ad_library_url: string;
  matched_query: string;
};

const metaAds: MetaAd[] = [];
const seenAdIds = new Set<string>();
const app_lc = app_name!.toLowerCase();
function metaMatchesApp(page: string, body: string, link: string): boolean {
  const blob = `${page} ${body} ${link}`.toLowerCase();
  if (blob.includes(app_lc)) return true;
  for (const kw of brand_keywords) if (blob.includes(kw.toLowerCase())) return true;
  return false;
}

for (const r of metaAdsResults) {
  const list = r.data?.searchResults ?? [];
  for (const ad of list) {
    if (!ad?.ad_archive_id || seenAdIds.has(ad.ad_archive_id)) continue;
    const snap = ad.snapshot ?? {};
    const body = (snap.body?.text ?? "").replace(/\s+/g, " ").trim();
    const title = (snap.title ?? "").trim();
    const link = snap.link_url ?? "";
    const pageName = ad.page_name ?? snap.page_name ?? "";
    if (!metaMatchesApp(pageName, `${title} ${body}`, link)) continue;
    seenAdIds.add(ad.ad_archive_id);
    const video = snap.videos?.[0] ?? null;
    metaAds.push({
      ad_archive_id: String(ad.ad_archive_id),
      page_name: pageName,
      page_id: ad.page_id ?? snap.page_id ?? "",
      is_active: !!ad.is_active,
      start_date_string: ad.start_date_string ?? null,
      end_date_string: ad.end_date_string ?? null,
      display_format: snap.display_format ?? "UNKNOWN",
      title,
      body,
      cta_text: snap.cta_text ?? null,
      link_url: link || null,
      video_url: video?.video_hd_url ?? video?.video_sd_url ?? null,
      thumbnail: video?.video_preview_image_url ?? snap.images?.[0]?.resized_image_url ?? snap.images?.[0]?.original_image_url ?? null,
      ad_library_url: ad.url ?? `https://www.facebook.com/ads/library?id=${ad.ad_archive_id}`,
      matched_query: r.query,
    });
  }
}
console.log(`Meta ads: ${metaAds.length} active ads matched after dedupe + brand filter`);

// ── 5. Render HTML report ─────────────────────────────────────────────────────
const ranked = watched.map((w, i) => ({ ...w, rank: i + 1 }));
const confirmed = ranked.filter(r => r.watch?.is_app === true).length;
const falsepos = ranked.filter(r => r.watch?.is_app === false).length;
const failed = ranked.filter(r => r.watch_status !== "ok").length;

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${app_name} — UGC outliers</title>
<style>
  :root { color-scheme: dark; }
  body { background: #0f0f0f; color: #e8e8e8; font: 14px/1.4 -apple-system, system-ui, sans-serif; margin: 0; padding: 24px; }
  header { margin-bottom: 16px; }
  h1 { margin: 0 0 4px; font-size: 22px; }
  .meta { color: #888; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; }
  thead th { position: sticky; top: 0; background: #181818; padding: 10px 8px; text-align: left; cursor: pointer; user-select: none; border-bottom: 1px solid #2a2a2a; font-weight: 600; }
  thead th:hover { background: #222; }
  tbody td { padding: 10px 8px; border-bottom: 1px solid #1a1a1a; vertical-align: top; }
  tbody tr:hover { background: #161616; }
  tbody tr.notapp { opacity: 0.4; }
  tbody tr.failed { opacity: 0.6; }
  .thumb { width: 64px; height: 114px; object-fit: cover; border-radius: 6px; background: #222; display: block; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
  .badge-tt { background: #fe2c55; color: #fff; }
  .badge-ig { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color: #fff; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .yes { color: #4ade80; font-weight: 700; }
  .no  { color: #f87171; font-weight: 700; }
  .q   { color: #888; }
  a { color: #7dd3fc; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .hook, .format { max-width: 320px; }
  footer { margin-top: 24px; color: #666; font-size: 12px; }
</style>
</head><body>
<header>
  <h1>${app_name} — UGC outliers</h1>
  <div class="meta">Generated ${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC · ${items.length} UGC candidates · ${ranked.length} watched · ${confirmed} confirmed · ${falsepos} false-positive · ${failed} failed · ${metaAds.length} Meta ads · TikTok + Instagram + Meta Ad Library</div>
</header>
<table>
<thead><tr>
  <th data-sort="rank">#</th>
  <th>Thumb</th>
  <th data-sort="platform">Platform</th>
  <th data-sort="views" class="num">Views</th>
  <th data-sort="engagement_rate" class="num">Engagement</th>
  <th data-sort="handle">Handle</th>
  <th data-sort="followers" class="num">Followers</th>
  <th>Hook</th>
  <th>Format</th>
  <th>App?</th>
  <th>Watch</th>
</tr></thead>
<tbody></tbody>
</table>
<h2 style="margin:32px 0 8px;font-size:18px">Meta Ad Library — active paid ads (${metaAds.length})</h2>
<div class="meta" style="margin-bottom:8px">Brand-mention filtered. Meta does not expose impression or reach data for non-political ads, so these are not ranked — sort by start date or click through for full creative.</div>
${metaAds.length === 0 ? '<div class="meta" style="padding:12px 0">No Meta ads matched. Either the brand isn\'t running active US Meta ads, or the app name didn\'t hit the keyword filter.</div>' : `<table id="metatable">
<thead><tr>
  <th data-sort-meta="page_name">Page</th>
  <th>Thumb</th>
  <th data-sort-meta="display_format">Format</th>
  <th>Headline / Body</th>
  <th data-sort-meta="cta_text">CTA</th>
  <th>Landing</th>
  <th data-sort-meta="start_date_string">Started</th>
  <th>Ad</th>
</tr></thead>
<tbody></tbody>
</table>`}
<footer>Generated by <a href="https://github.com/tfcbot/ai-creative-agency">find-app-ugc-outliers</a></footer>
<script>
const data = ${JSON.stringify(ranked)};
let key = "engagement_rate", dir = -1;
const tbody = document.querySelector("tbody");
const fmt = n => (n ?? 0).toLocaleString();
const pct = n => ((n ?? 0) * 100).toFixed(1) + "%";
const profileUrl = r => r.platform === "tiktok"
  ? "https://www.tiktok.com/@" + r.handle
  : "https://www.instagram.com/" + r.handle + "/";
function rowClass(r) {
  if (r.watch_status !== "ok") return "failed";
  if (r.watch && r.watch.is_app === false) return "notapp";
  return "";
}
function appCell(r) {
  if (r.watch_status !== "ok") return '<span class="q">?</span>';
  if (r.watch?.is_app === true)  return '<span class="yes">✓</span>';
  if (r.watch?.is_app === false) return '<span class="no">✗</span>';
  return '<span class="q">?</span>';
}
function rowHTML(r) {
  return '<tr class="' + rowClass(r) + '">' +
    '<td>' + r.rank + '</td>' +
    '<td>' + (r.thumbnail ? '<img class="thumb" loading="lazy" src="' + r.thumbnail + '">' : '<div class="thumb"></div>') + '</td>' +
    '<td><span class="badge badge-' + (r.platform === "tiktok" ? "tt" : "ig") + '">' + (r.platform === "tiktok" ? "TT" : "IG") + '</span></td>' +
    '<td class="num">' + fmt(r.views) + '</td>' +
    '<td class="num">' + pct(r.engagement_rate) + '</td>' +
    '<td><a href="' + profileUrl(r) + '" target="_blank">@' + r.handle + '</a></td>' +
    '<td class="num">' + (r.followers ? fmt(r.followers) : "—") + '</td>' +
    '<td class="hook">' + (r.watch?.hook ?? "") + '</td>' +
    '<td class="format">' + (r.watch?.format ?? "") + '</td>' +
    '<td>' + appCell(r) + '</td>' +
    '<td><a href="' + r.url + '" target="_blank">open</a></td>' +
  '</tr>';
}
function render() {
  const rows = [...data].sort((a,b) => {
    const av = a[key] ?? 0, bv = b[key] ?? 0;
    if (typeof av === "string") return av < bv ? dir : av > bv ? -dir : 0;
    return av < bv ? dir : av > bv ? -dir : 0;
  });
  tbody.innerHTML = rows.map(rowHTML).join("");
}
document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const k = th.dataset.sort;
    if (k === key) dir = -dir; else { key = k; dir = -1; }
    render();
  });
});
render();

const metaAds = ${JSON.stringify(metaAds)};
const metaTable = document.getElementById("metatable");
if (metaTable && metaAds.length) {
  let mkey = "start_date_string", mdir = -1;
  const mbody = metaTable.querySelector("tbody");
  const trim = (s, n) => (s ?? "").length > n ? (s ?? "").slice(0, n) + "…" : (s ?? "");
  function metaRow(a) {
    const headline = a.title ? '<strong>' + a.title + '</strong><br>' : '';
    const body = trim(a.body, 220);
    return '<tr>' +
      '<td><a href="https://www.facebook.com/' + a.page_id + '" target="_blank">' + a.page_name + '</a></td>' +
      '<td>' + (a.thumbnail ? '<img class="thumb" loading="lazy" src="' + a.thumbnail + '">' : '<div class="thumb"></div>') + '</td>' +
      '<td>' + a.display_format + '</td>' +
      '<td class="hook">' + headline + body + '</td>' +
      '<td>' + (a.cta_text ?? '—') + '</td>' +
      '<td>' + (a.link_url ? '<a href="' + a.link_url + '" target="_blank">open</a>' : '—') + '</td>' +
      '<td>' + (a.start_date_string ? a.start_date_string.slice(0,10) : '—') + '</td>' +
      '<td><a href="' + a.ad_library_url + '" target="_blank">library</a></td>' +
    '</tr>';
  }
  function mrender() {
    const rows = [...metaAds].sort((a,b) => {
      const av = a[mkey] ?? "", bv = b[mkey] ?? "";
      return av < bv ? mdir : av > bv ? -mdir : 0;
    });
    mbody.innerHTML = rows.map(metaRow).join("");
  }
  metaTable.querySelectorAll("th[data-sort-meta]").forEach(th => {
    th.addEventListener("click", () => {
      const k = th.dataset.sortMeta;
      if (k === mkey) mdir = -mdir; else { mkey = k; mdir = -1; }
      mrender();
    });
  });
  mrender();
}
</script>
</body></html>`;

writeFileSync(`${OUT}/report.html`, html);

// ── 6. Persist manifest ───────────────────────────────────────────────────────
const manifest = {
  skill: "find-app-ugc-outliers",
  version: "1.0.0",
  ran_at: new Date().toISOString(),
  input: { app_name, app_handle: app_handle ?? null, affiliate_handle_pattern: affiliate_handle_pattern ?? null, brand_keywords, false_positive_keywords },
  queries: variants,
  platforms: ["tiktok", "instagram", "meta_ads"],
  raw_search_paths: [...searchResults.map(r => r.path), ...metaAdsResults.map(r => r.path)],
  candidates_total: items.length,
  candidates_after_filter: items.filter(i => i.verdict !== "NOT_APP").length,
  verdict_counts: verdictCounts,
  top10: ranked,
  meta_ads_total: metaAds.length,
  meta_ads: metaAds,
};
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));

console.log("");
console.log(`✓ Report:   ${OUT}/report.html`);
console.log(`✓ Manifest: ${OUT}/manifest.json`);
console.log(`✓ Top 10:   ${confirmed} confirmed, ${falsepos} false-positive, ${failed} failed-to-watch`);
console.log(`✓ Meta ads: ${metaAds.length} active`);
