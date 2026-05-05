---
name: find-app-ugc-outliers
description: Discover viral TikTok and Instagram creator UGC for any mobile or web app, verify each candidate against the creator's profile bio (where affiliate CTAs hide) plus the video itself, then synthesize the shared pattern across confirmed top performers and propose a concrete format the user can film. Takes an app name (e.g. "Her75", "Cluely", "Cal AI"), runs keyword fan-out via Scrape Creators, ranks by engagement rate, watches the top 10 with VidJutsu using the bio as decisive context, and renders a sortable HTML report with inline video playback. Solves the gap that Kalodata / Fastmoss leave for non-TikTok-Shop apps — there is no closed-loop attribution for App Store / Play Store / web apps, so creator UGC for apps is currently uncatalogued. Bio-aware verification handles the case (Her75-style) where affiliate creators park CTAs in the bio and never mention the brand in any individual post.
requires:
  env:
    - SCRAPECREATORS_API_KEY
    - VIDJUTSU_API_KEY
  skills:
    - scrapecreators-api  # official Scrape Creators skill — endpoint discovery + 110 endpoints across 27 platforms. Install via `npx skills add scrapecreators/agent-skills`.
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# find-app-ugc-outliers

Find the viral creator UGC for any app. TikTok + Instagram. Bio-aware verification, inline video playback, top-performer pattern synthesis.

## When to invoke

- The user names an app (mobile or web) and wants to see what UGC is already working for it
- They want a ranked, watchable list of confirmed posts plus a concrete suggested format to clone
- They are scouting affiliate creators or auditing what organic patterns are converting

## When NOT to use

- The app sells on TikTok Shop and the user wants product-level GMV → use Kalodata / Fastmoss; closed-loop revenue data is out of scope
- The user wants paid-ad analysis → use `research-ads-meta` / `research-ads-tiktok`. This skill stays focused on organic/affiliate UGC where bio CTA is the primary attribution signal.

## Required env

- `SCRAPECREATORS_API_KEY` — TikTok keyword search, IG reels search, profile fetches, video downloads. Sign up: https://app.scrapecreators.com
- `VIDJUTSU_API_KEY` — `/v1/watch` confirms each candidate using video + bio context. Sign up: https://vidjutsu.ai

## Recommended companion skill

```
npx skills add scrapecreators/agent-skills
```

This skill consumes a small subset of the SC endpoints (TT/IG keyword search, TT/IG profile, TT/IG post fetch with `download_media=true`). The companion skill is the source of truth for endpoint shapes.

## Pipeline

The agent walks the recipes in order. Only step 6 runs bundled code (`render-report.ts`); every other step is the agent fanning out HTTP calls and shaping the manifest.

1. **Validate keys & set up `$OUT`** → `recipes/01-validate-keys.md`
2. **Keyword search fan-out (TT + IG)** → `recipes/02-keyword-search.md`
3. **Rank by engagement rate, classify by caption, take top 10 unverified** → `recipes/03-rank-and-filter.md` + `references/classifier-rules.md`
4. **Verify with profile bio + VidJutsu** → `recipes/04-watch-with-vidjutsu.md` + `references/vidjutsu-watch.md`
5. **Synthesize the top-performer pattern** → `recipes/05-synthesize-pattern.md`
6. **Render HTML report** via `bun render-report.ts $OUT/manifest.json` → `recipes/06-render-html-report.md`
7. **Persist manifest** → `recipes/07-persist-manifest.md`

## Cost per run

- Scrape Creators search: ~10 calls (5 query variants × 2 platforms) ≈ 10 credits
- Scrape Creators profile fetches: ~10 calls (one per top-10 candidate) ≈ 10 credits
- Scrape Creators `download_media=true` for top 10: 10 × 10 credits = 100 credits
- VidJutsu `/v1/watch`: 10 videos × 10 credits = 100 credits, covered by the included plan
- Total: ~120 SC credits + 100 VidJutsu credits ≈ $0.22 per run, ~3–5 minutes wall time

## Inputs

| Param | Required | Notes |
|---|---|---|
| `app_name` | yes | The app's user-facing name. Drives query variants and verification prompts. |
| `app_handle` | no | Brand's known TikTok / IG handle. Auto-confirms when caption tags it. |
| `affiliate_handle_pattern` | no | Regex for affiliate handles (e.g. `.*fromladder$`). Auto-confirms matches at the cheap-classifier stage. |
| `brand_keywords` | no | Extra strings for the cheap classifier. |
| `false_positive_keywords` | no | Strings that auto-exclude UGC candidates (e.g. `jacob's ladder` for the Ladder app). |

## Output

Everything lands in `$(pwd)/find-app-ugc-outliers-<timestamp>/`:

- `report.html` — pattern synthesis + verified videos table with **inline `<video>` playback**. Open directly in a browser.
- `manifest.json` — input params, raw search hit paths, classifier verdicts, profile fetches, VidJutsu responses, the synthesized `pattern`, and `verified[]` for the confirmed entries.
- `search/*.json` — every raw Scrape Creators response (search + profile), one file per call. Re-rendering and re-synthesizing pattern from cache are free.

## What the report contains

1. **Pattern section** — shared format, hook archetype, shared shot beats, bio-CTA pattern, outliers, plus a concrete suggested format with timed shot list and example VO/text.
2. **Verified videos table** — only `is_app: true` rows. Each row plays the MP4 inline (no tab-switching), with columns for views, engagement, creator + followers, hook, format, and bio CTA (highlighted by signal strength).

Unverified and rejected entries are stored in the manifest but never rendered.

## References

- `references/classifier-rules.md` — parametrized caption + handle classifier (cheap pre-VidJutsu signal)
- `references/vidjutsu-watch.md` — `/v1/watch` request shape and the bio-aware confirmation prompt
- `references/html-report-spec.md` — column schema, badges, sortable JS

Scrape Creators endpoint shapes are intentionally not duplicated here — defer to the official `scrapecreators-api` skill.

## Hard rules

- **TikTok + Instagram only.** YouTube is intentionally out of scope (different attention pattern).
- **Verified-only in the report.** Only `watch.is_app === true` rows render. The friction of "click through unverified entries" killed the workflow in the previous version.
- **Bio is decisive context, not a side check.** The Her75 case is canonical — affiliate creators park `app.com/<vanity>` in their bio with zero in-post mention. Without bio context, VidJutsu can't tell those posts apart from random fitness UGC. The verification prompt always includes the bio.
- **Inline video playback, not thumbnails.** `cdn_url` from `download_media=true` is a stable Supabase MP4 URL — embeddable in `<video>` tags without auth or referer checks.
- **Pattern synthesis is the agent's job, not a provider's.** The agent reads `verified[].watch.{hook, format, shot_list}` and writes the synthesis. No extra LLM call. Don't fabricate patterns from < 3 confirmed entries — set `pattern: null` and surface the gap to the user.
- **No app-specific hardcoded logic.** Brand-specific signals (handles, team names, false-positive words) come from inputs; the skill itself stays generic.
- **VidJutsu gets the Supabase CDN URL from `download_media=true`.** Source CDNs (`tiktokcdn-us.com`, `cdninstagram.com`) gatekeep — Gemini fetcher gets blocked. Supabase doesn't gatekeep.
- **Recipes drive the workflow; render-report.ts is the only bundled code.** The agent orchestrates HTTP calls and shapes the manifest.
