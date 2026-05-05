---
name: find-app-ugc-outliers
description: Discover viral TikTok and Instagram creator UGC for any mobile or web app. Takes an app name (e.g. "Cluely", "Pagepilot", "Cal AI"), runs keyword fan-out via Scrape Creators across TikTok and Instagram only, ranks candidates by engagement rate, watches the top 10 with VidJutsu to confirm the video actually mentions the app, and renders a sortable HTML report. Solves the gap that Kalodata / Fastmoss leave for non-TikTok-Shop apps — there is no closed-loop attribution for App Store / Play Store / web apps, so creator UGC for apps is currently uncatalogued. The report is the consumable artifact for end users; a manifest.json is also written for downstream chaining.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# find-app-ugc-outliers

Find the viral creator UGC for any app. TikTok + Instagram only.

## When to invoke

- The user names an app (mobile or web) and wants to see what UGC is already working for it
- They want a ranked, watchable list — not just raw search hits
- They are researching competitors, scouting creators, or harvesting hooks for their own ad

## When NOT to use

- The app sells on TikTok Shop and the user wants product-level GMV → use Kalodata / Fastmoss directly, they have closed-loop revenue data this skill cannot match
- The user wants paid ad library data (Meta / TikTok ads) → that is a different attribution model; use `research-ads-meta` or `research-ads-tiktok`

## Required env

- `SCRAPE_CREATORS_API_KEY` — TikTok and Instagram keyword search. Sign up: https://app.scrapecreators.com
- `VIDJUTSU_API_KEY` — `/v1/watch` confirms the top 10 actually mention the app. Sign up: https://vidjutsu.ai

## Cost per run

- Scrape Creators search: ~10 calls (5 query variants × 2 platforms) ≈ 10 credits
- Scrape Creators `download_media=true` for top 10: 10 × 10 credits = 100 credits
- VidJutsu `/v1/watch`: 10 videos × 10 credits = 100 credits, covered by the included plan
- Total: ~110 SC credits + 100 VidJutsu credits ≈ $0.20 per run, ~3–5 minutes wall time

## Inputs

| Param | Required | Notes |
|---|---|---|
| `app_name` | yes | The app's user-facing name. Used to build query variants and confirmation prompts. |
| `app_handle` | no | Brand's known TikTok / IG handle (e.g. `joinladder`). Auto-confirms when caption tags it. |
| `affiliate_handle_pattern` | no | Regex for affiliate handles (e.g. `.*fromladder$`). Auto-confirms matches. |
| `brand_keywords` | no | Extra strings the cheap classifier should treat as confirmation signals (team names, coach handles, etc.). |
| `false_positive_keywords` | no | Strings that auto-exclude (e.g. `jacob's ladder` for the Ladder app). |

## Pipeline

1. **Validate keys** → `recipes/01-validate-keys.md`
2. **Keyword search fan-out (TikTok + Instagram only)** → `recipes/02-keyword-search.md`
3. **Rank, filter, classify by caption** → `recipes/03-rank-and-filter.md`
4. **Watch top 10 with VidJutsu** → `recipes/04-watch-with-vidjutsu.md`
5. **Render HTML report** → `recipes/05-render-html-report.md`
6. **Persist manifest** → `recipes/06-persist-manifest.md`

## Output

Everything lands in `CWD/find-app-ugc-outliers-<timestamp>/`:

- `report.html` — sortable ranked table. Open directly in a browser, no server required.
- `manifest.json` — input params, raw search hits, classifier verdicts, VidJutsu responses, final ranked top 10.

## References

- `references/scrapecreators-search.md` — TikTok + IG search endpoint shapes, engagement-rate fields
- `references/vidjutsu-watch.md` — `/v1/watch` request shape (mediaUrl + prompt) and confirmation prompt
- `references/classifier-rules.md` — parametrized caption + handle classifier
- `references/html-report-spec.md` — column schema, badges, sortable JS

## Hard rules

- **TikTok + Instagram only.** YouTube is intentionally out of scope — short-form vertical UGC for apps is the wedge; YouTube is a different attention pattern.
- **Top 10 only sent to VidJutsu.** Don't try to verify the long tail — runtime cost balloons and the report becomes unscannable.
- **No app-specific hardcoded logic.** Brand-specific signals (handles, team names, false-positive words) come from inputs; the skill itself stays generic.
- **VidJutsu gets the Supabase CDN URL from `download_media=true`, never the bare TikTok/IG CDN URL.** Source-CDN URLs (`tiktokcdn-us.com`, `cdninstagram.com`, `fbcdn.net`) gatekeep by client fingerprint; VidJutsu's downstream Gemini fetcher gets blocked. `download_media=true` parks the MP4 on Supabase, which does not gatekeep.
