#!/usr/bin/env bun
// render-report.ts — render the find-app-ugc-outliers HTML report from a manifest.json.
// Usage:
//   bun render-report.ts <manifest.json> [--out report.html]
//
// Renders only verified entries (watch.is_app === true). Each row plays its
// MP4 inline via the Supabase cdn_url. A Pattern section above the table
// surfaces the synthesized format and suggested shot list.

import { readFileSync, writeFileSync } from "fs";

type Verified = {
  rank: number;
  platform: "tiktok" | "instagram";
  handle: string;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  url: string;
  cdn_url: string | null;
  thumbnail: string | null;
  profile: { bio: string; bio_link: string | null; followers: number };
  watch_status: "ok" | "failed";
  watch?: {
    is_app: boolean;
    confidence: "high" | "medium" | "low";
    evidence: string;
    bio_signal: "cta" | "soft" | "none";
    hook: string;
    format: string;
    shot_list: string[];
  };
};

type Pattern = {
  shared_format: string;
  shared_hook_archetype: string;
  shared_shot_beats: string[];
  what_makes_it_work: string;
  bio_signal_pattern: string;
  outliers: string[];
  suggested_format: {
    title: string;
    duration_sec: number;
    hook: string;
    shot_list: { t: string; shot: string; vo_or_text: string }[];
    cta: string;
    why_this_should_work: string;
  };
};

type Manifest = {
  input: { app_name: string };
  ran_at: string;
  candidates_total?: number;
  verified: Verified[];
  verified_count?: number;
  rejected_count?: number;
  pattern: Pattern | null;
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
const verified = (m.verified ?? []).filter(v => v.watch?.is_app === true && v.cdn_url);

const escape = (s: string) => (s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

function patternSection(p: Pattern | null): string {
  if (!p) {
    return `<section class="pattern empty"><p>Not enough confirmed entries to synthesize a pattern. See <code>verified[]</code> in the manifest for what we did find.</p></section>`;
  }
  const sf = p.suggested_format;
  return `<section class="pattern">
  <h2>Pattern across top performers</h2>
  <div class="pgrid">
    <div><div class="lbl">Shared format</div><div>${escape(p.shared_format)}</div></div>
    <div><div class="lbl">Hook archetype</div><div>${escape(p.shared_hook_archetype)}</div></div>
    <div><div class="lbl">Bio CTA pattern</div><div>${escape(p.bio_signal_pattern)}</div></div>
  </div>
  <div class="lbl" style="margin-top:16px">Shared shot beats</div>
  <ol class="beats">${p.shared_shot_beats.map(b => `<li>${escape(b)}</li>`).join("")}</ol>
  <div class="lbl" style="margin-top:16px">What makes it work</div>
  <p>${escape(p.what_makes_it_work)}</p>
  ${p.outliers.length ? `<div class="lbl" style="margin-top:12px">Outliers worth flagging</div><p>${p.outliers.map(escape).join(" · ")}</p>` : ""}

  <h3>Suggested format: ${escape(sf.title)}</h3>
  <div class="meta">${sf.duration_sec}s · CTA: ${escape(sf.cta)}</div>
  <div class="lbl" style="margin-top:12px">Hook</div>
  <p>${escape(sf.hook)}</p>
  <div class="lbl" style="margin-top:8px">Shot list</div>
  <table class="shots"><thead><tr><th>Time</th><th>Shot</th><th>VO / on-screen text</th></tr></thead><tbody>
    ${sf.shot_list.map(s => `<tr><td class="t">${escape(s.t)}</td><td>${escape(s.shot)}</td><td>${escape(s.vo_or_text)}</td></tr>`).join("")}
  </tbody></table>
  <div class="lbl" style="margin-top:12px">Why this should work</div>
  <p>${escape(sf.why_this_should_work)}</p>
</section>`;
}

function videoCell(v: Verified): string {
  if (!v.cdn_url) return "";
  return `<video class="vid" controls preload="metadata" playsinline ${v.thumbnail ? `poster="${escape(v.thumbnail)}"` : ""}>
    <source src="${escape(v.cdn_url)}" type="video/mp4">
  </video>`;
}

function bioCell(v: Verified): string {
  const sig = v.watch?.bio_signal ?? "none";
  const cls = sig === "cta" ? "biocta" : sig === "soft" ? "biosoft" : "bionone";
  const bio = (v.profile.bio ?? "").replace(/\n+/g, " ");
  const link = v.profile.bio_link
    ? `<div class="biolink"><a href="${escape(v.profile.bio_link)}" target="_blank" rel="noreferrer">${escape(v.profile.bio_link)}</a></div>`
    : "";
  return `<div class="bio ${cls}"><div class="biotext">${escape(bio.slice(0, 200))}${bio.length > 200 ? "…" : ""}</div>${link}<div class="biosig">bio_signal: <strong>${sig}</strong></div></div>`;
}

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(m.input.app_name)} — UGC outliers</title>
<style>
  :root { color-scheme: dark; }
  body { background: #0f0f0f; color: #e8e8e8; font: 14px/1.5 -apple-system, system-ui, sans-serif; margin: 0; padding: 24px; max-width: 1400px; }
  header { margin-bottom: 24px; }
  h1 { margin: 0 0 4px; font-size: 24px; }
  h2 { margin: 0 0 12px; font-size: 20px; }
  h3 { margin: 24px 0 6px; font-size: 17px; color: #f9fafb; }
  .meta { color: #888; font-size: 13px; }
  .lbl { color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 4px; }
  .pattern { background: #161616; border: 1px solid #232323; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
  .pattern.empty { color: #888; }
  .pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .pgrid > div > div:last-child { color: #e8e8e8; font-size: 14px; line-height: 1.45; }
  .beats { margin: 4px 0 0; padding-left: 20px; color: #d4d4d4; }
  .shots { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 13px; }
  .shots th { text-align: left; padding: 6px 8px; color: #999; font-weight: 600; border-bottom: 1px solid #2a2a2a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
  .shots td { padding: 8px; border-bottom: 1px solid #1a1a1a; vertical-align: top; }
  .shots td.t { color: #7dd3fc; font-variant-numeric: tabular-nums; white-space: nowrap; width: 90px; }
  table.results { width: 100%; border-collapse: collapse; }
  table.results thead th { position: sticky; top: 0; background: #181818; padding: 10px 8px; text-align: left; cursor: pointer; user-select: none; border-bottom: 1px solid #2a2a2a; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  table.results thead th:hover { background: #222; }
  table.results tbody td { padding: 12px 8px; border-bottom: 1px solid #1a1a1a; vertical-align: top; }
  table.results tbody tr:hover { background: #161616; }
  .vid { width: 180px; max-width: 180px; aspect-ratio: 9/16; border-radius: 8px; background: #000; display: block; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
  .badge-tt { background: #fe2c55; color: #fff; }
  .badge-ig { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color: #fff; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  a { color: #7dd3fc; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .hook, .format { max-width: 280px; }
  .bio { max-width: 260px; font-size: 12px; line-height: 1.4; }
  .biotext { color: #d4d4d4; }
  .biolink { margin-top: 4px; font-size: 11px; word-break: break-all; }
  .biosig { margin-top: 6px; color: #777; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .bio.biocta { border-left: 2px solid #4ade80; padding-left: 8px; }
  .bio.biosoft { border-left: 2px solid #fbbf24; padding-left: 8px; }
  .bio.bionone { border-left: 2px solid #444; padding-left: 8px; }
  .bio.biocta .biosig { color: #4ade80; }
  .bio.biosoft .biosig { color: #fbbf24; }
  footer { margin-top: 32px; color: #666; font-size: 12px; }
</style>
</head><body>
<header>
  <h1>${escape(m.input.app_name)} — UGC outliers</h1>
  <div class="meta">Generated ${m.ran_at.replace("T", " ").slice(0, 16)} UTC · ${m.candidates_total ?? 0} candidates scanned · ${verified.length} verified · TikTok + Instagram</div>
</header>
${patternSection(m.pattern)}
<h2>Verified videos (${verified.length})</h2>
<table class="results" id="ugc">
<thead><tr>
  <th data-sort="rank">#</th>
  <th>Video</th>
  <th data-sort="platform">Platform</th>
  <th data-sort="views" class="num">Views</th>
  <th data-sort="engagement_rate" class="num">Eng.</th>
  <th data-sort="handle">Creator</th>
  <th>Hook</th>
  <th>Format</th>
  <th>Bio CTA</th>
</tr></thead>
<tbody></tbody>
</table>
<footer>Generated by <a href="https://github.com/tfcbot/ai-creative-agency">find-app-ugc-outliers</a></footer>
<script>
const data = ${JSON.stringify(verified.map(v => ({
  ...v,
  videoHTML: videoCell(v),
  bioHTML: bioCell(v),
})))};
let key = "engagement_rate", dir = -1;
const tbody = document.querySelector("#ugc tbody");
const fmt = n => (n ?? 0).toLocaleString();
const pct = n => ((n ?? 0) * 100).toFixed(1) + "%";
const profileUrl = r => r.platform === "tiktok"
  ? "https://www.tiktok.com/@" + r.handle
  : "https://www.instagram.com/" + r.handle + "/";
function rowHTML(r) {
  return '<tr>' +
    '<td>' + (r.rank ?? "") + '</td>' +
    '<td>' + r.videoHTML + '</td>' +
    '<td><span class="badge badge-' + (r.platform === "tiktok" ? "tt" : "ig") + '">' + (r.platform === "tiktok" ? "TT" : "IG") + '</span></td>' +
    '<td class="num">' + fmt(r.views) + '</td>' +
    '<td class="num">' + pct(r.engagement_rate) + '</td>' +
    '<td><a href="' + profileUrl(r) + '" target="_blank">@' + r.handle + '</a><div class="meta" style="font-size:11px">' + fmt(r.profile?.followers ?? 0) + ' followers</div></td>' +
    '<td class="hook">' + (r.watch?.hook ?? "") + '</td>' +
    '<td class="format">' + (r.watch?.format ?? "") + '</td>' +
    '<td>' + r.bioHTML + '</td>' +
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
</script>
</body></html>`;

writeFileSync(outPath, html);
console.log(outPath);
