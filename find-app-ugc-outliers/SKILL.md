---
name: find-app-ugc-outliers
description: Discover viral TikTok and Instagram creator UGC for any mobile or web app, plus the brand's currently-running Meta ads. Takes an app name (e.g. "Cluely", "Pagepilot", "Cal AI"), runs keyword fan-out via Scrape Creators across TikTok, Instagram, and the Meta Ad Library, ranks UGC candidates by engagement rate, watches the top 10 with VidJutsu to confirm the video actually mentions the app, surfaces all matching active Meta ads as a separate section, and renders a single sortable HTML report. Solves the gap that Kalodata / Fastmoss leave for non-TikTok-Shop apps — there is no closed-loop attribution for App Store / Play Store / web apps, so creator UGC for apps is currently uncatalogued. The agent orchestrates the workflow recipe-by-recipe; only the HTML render is hardcoded.
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

Find the viral creator UGC and active paid creative for any app. TikTok + Instagram + Meta Ad Library.

## When to invoke

- The user names an app (mobile or web) and wants to see what UGC is already working for it
- They want a ranked, watchable list — not just raw search hits
- They are researching competitors, scouting creators, harvesting hooks for their own ad, or auditing a brand's full top-of-funnel (organic + paid)

## When NOT to use

- The app sells on TikTok Shop and the user wants product-level GMV → use Kalodata / Fastmoss directly; closed-loop revenue data is out of scope
- The user wants deep paid-ad analysis (transcripts, hook breakdowns, ad-by-ad classification) → use `research-ads-meta` / `research-ads-tiktok`. This skill returns a flat list of active Meta ads as a bonus lane, not a full breakdown.

## Required env

- `SCRAPECREATORS_API_KEY` — TikTok keyword search, Instagram reels search, Meta Ad Library. Sign up: https://app.scrapecreators.com
- `VIDJUTSU_API_KEY` — `/v1/watch` confirms top 10 actually mention the app. Sign up: https://vidjutsu.ai

## Recommended companion skill

Install the official Scrape Creators skill once for endpoint discovery, pagination guidance, and credit accounting:

```
npx skills add scrapecreators/agent-skills
```

This skill consumes a small subset of those endpoints (TikTok keyword search, IG reels search, IG/TikTok post fetch with `download_media=true`, Meta Ad Library `search/ads`). The companion skill is the source of truth for endpoint shapes — this skill does not duplicate them.

## Pipeline

The agent walks the recipes in order. Only step 5 runs bundled code (`render-report.ts`); every other step is the agent fanning out HTTP calls and shaping the manifest.

1. **Validate keys & set up `$OUT`** → `recipes/01-validate-keys.md`
2. **Keyword search fan-out (TikTok + IG + Meta Ads)** → `recipes/02-keyword-search.md`
3. **Rank UGC by engagement rate, classify by caption, filter Meta ads by brand mention** → `recipes/03-rank-and-filter.md` + `references/classifier-rules.md`
4. **Watch top 10 UGC with VidJutsu** → `recipes/04-watch-with-vidjutsu.md` + `references/vidjutsu-watch.md`
5. **Render HTML report** via `bun render-report.ts $OUT/manifest.json` → `recipes/05-render-html-report.md`
6. **Persist manifest** → `recipes/06-persist-manifest.md`

## Cost per run

- Scrape Creators search: ~15 calls (5 query variants × 3 lanes) ≈ 15 credits
- Scrape Creators `download_media=true` for top 10 UGC: 10 × 10 credits = 100 credits
- VidJutsu `/v1/watch`: 10 videos × 10 credits = 100 credits, covered by the included plan
- Total: ~115 SC credits + 100 VidJutsu credits ≈ $0.20 per run, ~3–5 minutes wall time. Meta ads add no extra cost beyond the search call.

## Inputs

| Param | Required | Notes |
|---|---|---|
| `app_name` | yes | The app's user-facing name. Drives query variants and confirmation prompts. |
| `app_handle` | no | Brand's known TikTok / IG handle (e.g. `joinladder`). Auto-confirms when caption tags it. |
| `affiliate_handle_pattern` | no | Regex for affiliate handles (e.g. `.*fromladder$`). Auto-confirms matches. |
| `brand_keywords` | no | Extra strings the cheap classifier should treat as confirmation signals (team names, coach handles, etc.). Also tightens the Meta-ads brand-mention filter. |
| `false_positive_keywords` | no | Strings that auto-exclude UGC candidates (e.g. `jacob's ladder` for the Ladder app). |

## Output

Everything lands in `$(pwd)/find-app-ugc-outliers-<timestamp>/`:

- `report.html` — two sortable tables (UGC outliers + Meta Ad Library). Open directly in a browser, no server required.
- `manifest.json` — input params, raw search hit paths, classifier verdicts, VidJutsu responses, ranked top 10 UGC, and `meta_ads[]` for active matched ads.
- `search/*.json` — every raw Scrape Creators response, one file per (lane, query variant). Re-rendering is free; re-running step 4+ from cached search payloads is also free.

## References

- `references/classifier-rules.md` — parametrized caption + handle classifier
- `references/vidjutsu-watch.md` — `/v1/watch` request shape and confirmation prompt
- `references/html-report-spec.md` — column schema, badges, sortable JS

Scrape Creators endpoint shapes are intentionally not duplicated here — defer to the official `scrapecreators-api` skill.

## Hard rules

- **TikTok + Instagram + Meta Ad Library only.** YouTube is intentionally out of scope (different attention pattern). TikTok ad library is also out of scope — different endpoint shape, deferred until demand surfaces.
- **Top 10 UGC only sent to VidJutsu.** Don't try to verify the long tail — runtime cost balloons and the report becomes unscannable.
- **No app-specific hardcoded logic.** Brand-specific signals (handles, team names, false-positive words) come from inputs; the skill itself stays generic.
- **VidJutsu gets the Supabase CDN URL from `download_media=true`, never the bare TikTok/IG CDN URL.** Source-CDN URLs (`tiktokcdn-us.com`, `cdninstagram.com`, `fbcdn.net`) gatekeep by client fingerprint; VidJutsu's downstream Gemini fetcher gets blocked. `download_media=true` parks the MP4 on Supabase, which does not gatekeep.
- **Meta ads are NOT sent to VidJutsu.** Meta Ad Library exposes neither impressions nor reach for non-political ads — there's no engagement signal to rank them by, and watching every ad would balloon cost. The skill surfaces them flat; the user clicks through to the Ad Library link for any ad they want to dig into.
- **Meta ads are filtered by brand mention before display.** A keyword search like `query=Cluely` returns 50,000+ active ads, most unrelated. Only ads where the page name, headline, body, or landing URL contains `app_name` (or any `brand_keywords`) make it into the report.
- **Recipes drive the workflow; render-report.ts is the only bundled code.** The agent (you) orchestrates HTTP calls, shapes the manifest, and runs the renderer at the end. Don't reach for a monolithic `run.ts` — the recipes are the workflow, and the manifest is the contract between steps 1–4 and step 5.
