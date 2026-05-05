# 01 — Validate keys & set up the output directory

Stop early with clear signup links if either key is missing. Don't burn Scrape Creators credits on a run that will fail at VidJutsu.

```bash
: "${SCRAPECREATORS_API_KEY:?Missing SCRAPECREATORS_API_KEY. Sign up: https://app.scrapecreators.com}"
: "${VIDJUTSU_API_KEY:?Missing VIDJUTSU_API_KEY. Sign up: https://vidjutsu.ai}"
```

Note: this skill uses the official Scrape Creators env var name (`SCRAPECREATORS_API_KEY`, no underscore). If you previously set `SCRAPE_CREATORS_API_KEY`, alias it in `.env`:

```
SCRAPECREATORS_API_KEY=$SCRAPE_CREATORS_API_KEY
```

## Inputs

Required: `app_name` (e.g. `"Cluely"`, `"Pagepilot"`, `"Cal AI"`).

Optional (improve precision — see `references/classifier-rules.md`):

- `app_handle` — known TikTok/IG handle for the brand
- `affiliate_handle_pattern` — regex matching affiliate creator handles
- `brand_keywords` — comma-separated extra confirmation strings
- `false_positive_keywords` — comma-separated auto-exclude strings

## Output directory

Create one fresh directory per run and pass it through every subsequent recipe:

```bash
OUT="$(pwd)/find-app-ugc-outliers-$(date -u +%Y-%m-%dT%H-%M-%S)"
mkdir -p "$OUT/search"
echo "$OUT"
```

Raw search payloads land in `$OUT/search/`. The manifest and rendered report land in `$OUT/`.
