# 01 — Validate keys

Stop early with a clear signup link if either key is missing. Don't run a partial pipeline that burns Scrape Creators credits and then fails at VidJutsu.

```ts
const SCRAPE = process.env.SCRAPE_CREATORS_API_KEY;
const VIDJUTSU = process.env.VIDJUTSU_API_KEY;

if (!SCRAPE) {
  console.error("Missing SCRAPE_CREATORS_API_KEY. Sign up: https://app.scrapecreators.com");
  process.exit(1);
}
if (!VIDJUTSU) {
  console.error("Missing VIDJUTSU_API_KEY. Sign up: https://vidjutsu.ai");
  process.exit(1);
}
```

Also create the per-run output directory now so step 6 always has somewhere to write the manifest even if an intermediate step throws:

```ts
import { mkdirSync } from "fs";
const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT = `${process.cwd()}/find-app-ugc-outliers-${ts}`;
mkdirSync(OUT, { recursive: true });
```
