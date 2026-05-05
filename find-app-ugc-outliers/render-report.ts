#!/usr/bin/env bun
// render-report.ts — render the find-app-ugc-outliers HTML report from a manifest.json.
// Usage:
//   bun render-report.ts <manifest.json> [--out report.html]
//
// The agent assembles the manifest by orchestrating Scrape Creators + VidJutsu
// per the recipes. This script is the only deterministic piece — pure JSON → HTML.

import { readFileSync, writeFileSync } from "fs";

type UGCRow = {
  rank: number;
  platform: "tiktok" | "instagram";
  handle: string;
  followers: number;
  views: number;
  engagement_rate: number;
  url: string;
  thumbnail: string | null;
  watch_status: "ok" | "failed";
  watch?: { is_app: boolean; confidence: string; evidence: string; hook: string; format: string };
};

type MetaAd = {
  ad_archive_id: string;
  page_name: string;
  page_id: string;
  display_format: string;
  title: string;
  body: string;
  cta_text: string | null;
  link_url: string | null;
  thumbnail: string | null;
  start_date_string: string | null;
  ad_library_url: string;
};

type Manifest = {
  input: { app_name: string; [k: string]: unknown };
  ran_at: string;
  candidates_total: number;
  top10: UGCRow[];
  meta_ads: MetaAd[];
};

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const manifestPath = process.argv[2];
if (!manifestPath || manifestPath.startsWith("--")) {
  console.error("Usage: bun render-report.ts <manifest.json> [--out report.html]");
  process.exit(1);
}
const outPath = arg("--out") ?? manifestPath.replace(/manifest\.json$/, "report.html");

const m = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
const ranked = m.top10 ?? [];
const metaAds = m.meta_ads ?? [];
const confirmed = ranked.filter(r => r.watch?.is_app === true).length;
const falsepos = ranked.filter(r => r.watch?.is_app === false).length;
const failed = ranked.filter(r => r.watch_status !== "ok").length;

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${m.input.app_name} — UGC outliers</title>
<style>
  :root { color-scheme: dark; }
  body { background: #0f0f0f; color: #e8e8e8; font: 14px/1.4 -apple-system, system-ui, sans-serif; margin: 0; padding: 24px; }
  header { margin-bottom: 16px; }
  h1 { margin: 0 0 4px; font-size: 22px; }
  h2 { margin: 32px 0 8px; font-size: 18px; }
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
  <h1>${m.input.app_name} — UGC outliers</h1>
  <div class="meta">Generated ${m.ran_at.replace("T", " ").slice(0, 16)} UTC · ${m.candidates_total ?? 0} UGC candidates · ${ranked.length} watched · ${confirmed} confirmed · ${falsepos} false-positive · ${failed} failed · ${metaAds.length} Meta ads</div>
</header>
<table id="ugc">
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
<h2>Meta Ad Library — active paid ads (${metaAds.length})</h2>
<div class="meta" style="margin-bottom:8px">Brand-mention filtered. Meta does not expose impression or reach data for non-political ads, so these are not ranked — sort by start date or click through for full creative.</div>
${metaAds.length === 0 ? `<div class="meta" style="padding:12px 0">No Meta ads matched. Either the brand isn't running active US Meta ads, or the app name didn't hit the keyword filter.</div>` : `<table id="metatable">
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
const tbody = document.querySelector("#ugc tbody");
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
document.querySelectorAll("#ugc th[data-sort]").forEach(th => {
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

writeFileSync(outPath, html);
console.log(outPath);
