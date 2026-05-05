# 07 — Persist manifest

Write `$OUT/manifest.json` before running the renderer in step 6. The manifest is the canonical record of the run — it lets the user re-render `report.html` without re-querying APIs, and lets other skills chain off the output.

## Shape

```json
{
  "skill": "find-app-ugc-outliers",
  "version": "3.0.0",
  "ran_at": "2026-05-05T17:12:43Z",
  "input": {
    "app_name": "Her75",
    "app_handle": null,
    "affiliate_handle_pattern": null,
    "brand_keywords": [],
    "false_positive_keywords": []
  },
  "queries": ["Her75", "Her75 app", "Her75 review", "Her75 tutorial", "Her75 hack"],
  "platforms": ["tiktok", "instagram"],
  "raw_search_paths": [
    "search/tiktok-Her75.json",
    "search/instagram-Her75.json",
    "search/profile-tiktok-username.json"
  ],
  "candidates_total": 184,
  "candidates_after_filter": 73,
  "verdict_counts": { "CONFIRMED": 22, "AMBIGUOUS": 41, "NOT_APP": 10 },
  "verified": [
    {
      "rank": 1,
      "platform": "instagram",
      "id": "...",
      "url": "https://www.instagram.com/reel/...",
      "cdn_url": "https://...supabase.co/.../file.mp4",
      "handle": "joinher75",
      "views": 987000,
      "likes": 92000,
      "comments": 1100,
      "shares": 0,
      "engagement_rate": 0.094,
      "thumbnail": "https://...",
      "profile": {
        "bio": "fitness era ↓\nher75.app/jane",
        "bio_link": "https://her75.app/jane",
        "followers": 24300
      },
      "watch_status": "ok",
      "watch": {
        "is_app": true,
        "confidence": "high",
        "evidence": "creator's bio links her75.app/jane, video shows the app's daily-checkin UI at 0:08",
        "bio_signal": "cta",
        "hook": "Day 47 of Her75 — closing video on the couch saying 'I almost skipped today'",
        "format": "first-person POV vlog",
        "shot_list": [
          "POV close-up of phone showing Her75 day 47 checkin",
          "creator on couch in athleisure talking to camera",
          "phone screen recording of workout starting",
          "after-shot: creator wiping sweat, smiling"
        ]
      }
    }
  ],
  "verified_count": 8,
  "rejected_count": 2,
  "pattern": {
    "shared_format": "First-person POV vlog with phone-screen UI cutaways",
    "shared_hook_archetype": "'Day N of Her75' opener with hesitation/relapse framing",
    "shared_shot_beats": [
      "Creator on couch / in bedroom in athleisure, mid-confession",
      "Phone close-up showing the day's Her75 checkin",
      "Cut to workout in progress (screen-recorded or filmed)",
      "After-shot: creator post-workout, mood-shifted"
    ],
    "what_makes_it_work": "Pattern leans on parasocial vulnerability — the creator admits they almost skipped, then the app is the silent reason they didn't. The hesitation framing converts because viewers see themselves in the 'almost skipped' moment. Pure walkthroughs (3 of 8) underperform pattern (5 of 8) by ~3x engagement rate.",
    "bio_signal_pattern": "8/8 confirmed creators have her75.app/<vanity> in bio. Zero in-post mention. App name appears in bio + on-screen UI only.",
    "outliers": ["@grace.fitness — split-screen comparison format, also confirmed"],
    "suggested_format": {
      "title": "Day-N Hesitation POV",
      "duration_sec": 18,
      "hook": "'It's day 47 of Her75 and I almost didn't film this' (creator on couch, mid-frame)",
      "shot_list": [
        { "t": "0:00–0:03", "shot": "Creator on couch in athleisure, no makeup, soft afternoon light", "vo_or_text": "VO: 'It's day 47 of Her75 and I almost didn't film this.'" },
        { "t": "0:03–0:06", "shot": "Phone close-up showing Her75 daily checkin screen for the current day", "vo_or_text": "VO: 'But the app's still here so…'" },
        { "t": "0:06–0:12", "shot": "Cut to workout in progress — squat or kettlebell, mid-set", "vo_or_text": "Diegetic audio + soft on-screen text overlay: 'day 47'" },
        { "t": "0:12–0:18", "shot": "After-shot: creator post-workout, slightly sweaty, half-smile", "vo_or_text": "VO: 'See you tomorrow.'" }
      ],
      "cta": "Bio link only — `her75.app/<your-name>`. Do not mention the app in audio or on-screen text. Pattern is bio-CTA-only.",
      "why_this_should_work": "Mirrors the 5/8 confirmed pattern with the highest engagement (range 7-12%). Hesitation framing + bio-only CTA matches what's converting; in-audio mention reads as paid and breaks the spell."
    }
  }
}
```

## Field notes

- `verified[]` includes only `is_app: true` rows. Rejected entries (`is_app: false` or `watch_status: failed`) are kept under a separate `rejected[]` for debugging — also not rendered.
- `cdn_url` per verified entry is the Supabase MP4 URL from `download_media=true`. The renderer uses this for inline `<video>` playback.
- `profile.{bio, bio_link, followers}` is what surfaces in the bio-CTA column.
- `pattern` is the synthesis from recipe 05. Shape above; `null` if too few confirmed entries.

## Print summary

```
✓ Manifest: <OUT>/manifest.json
✓ Report:   <OUT>/report.html
✓ Verified: X / 10 candidates passed VidJutsu (Y bio-CTAs, Z UI-shown, W audio-mention)
✓ Pattern:  <shared_format>
```
