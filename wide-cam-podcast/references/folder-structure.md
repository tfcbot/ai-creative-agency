# Working directory layout

Set this up at the project root (e.g. `~/products/my-vsl/`) before running any pipeline step. Every recipe assumes this layout.

```
my-vsl/
├── characters/                # one JSON per host (character-spec.md)
│   ├── host_a.json
│   └── host_b.json
├── scenes/                    # one JSON per multi-person frame (scene-spec.md)
│   └── podcast_lounge_wide.json
├── frames/                    # generated starting frames (PNG)
│   ├── host_a_single.png      # optional — singles for cutaways
│   ├── host_b_single.png
│   └── podcast_lounge_wide.png  # the anchor frame for every clip
├── clips/                     # one JSON + one MP4 per dialogue block (clip-spec.md)
│   ├── block_1.json
│   ├── block_1.mp4
│   ├── block_2.json
│   └── …
├── final/                     # concatenated final cut(s)
│   └── final.mp4
├── compliance/                # optional — VidJutsu compliance scan results
│   └── facebook-ads.json
├── script.md                  # human-readable script with all dialogue + beat notes
└── plan.md                    # rolling production plan / notes
```

## Folder responsibilities

- `characters/` — Source-of-truth JSON for each host. One file per character, named `<host_id>.json`. Edit here, regenerate the frame.
- `scenes/` — Source-of-truth JSON for any scene that contains more than one character or a specific environmental composition. The wide 2-shot lives here.
- `frames/` — Generated PNGs only. Treat as derivable output. The `_raw.png` files (uncropped) are intermediate and can be deleted after the cropped versions land.
- `clips/` — Both the source-of-truth clip JSONs and the generated MP4s live side by side. Name pattern: `block_<N>.json` + `block_<N>.mp4`.
- `final/` — Concatenated final cut(s). Keep the 16:9 master here. Derive vertical / square in a separate filename suffix.
- `compliance/` — Optional. One file per platform scanned (`facebook-ads.json`, `tiktok.json`, etc.).
- `script.md` — Human-readable script of all dialogue lines, beat notes, and structure. The clip JSONs are the machine truth; this file is the conversational truth for the team.
- `plan.md` — Rolling notes on what's locked, what's pending, what was tried and rejected.

## Naming conventions

- All file and folder names are kebab-case or snake_case (no spaces).
- Block numbers are 1-indexed: `block_1`, `block_2`.
- Frame keys match the JSON they came from: `host_a.json` → `host_a_single.png`; `podcast_lounge_wide.json` → `podcast_lounge_wide.png`.
