# Recipe 06 — Concat the clips into the final cut

## Goal

Stitch the four block MP4s into one ~60s `final/final.mp4` using ffmpeg stream copy. No re-encode.

## Steps

1. Read `references/ffmpeg-concat.md`.

2. Build the concat list at `/tmp/concat_list.txt`:

   ```
   file '/abs/path/to/clips/block_1.mp4'
   file '/abs/path/to/clips/block_2.mp4'
   file '/abs/path/to/clips/block_3.mp4'
   file '/abs/path/to/clips/block_4.mp4'
   ```

3. Make sure `final/` exists, then run:

   ```
   ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt -c copy final/final.mp4
   ```

4. Verify with ffprobe:

   ```
   ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration final/final.mp4
   ```

   Expect h264 + aac, 1280×720 (or whatever resolution the clips are), and ~60.3s duration.

## Notes

- A non-monotonic-DTS warning at concat boundaries is benign for this use case.
- If stream copy fails with a "Non-matching" error, the inputs have different codec params (e.g. you mixed 480p and 720p clips by accident). Re-encode using the recipe in `references/ffmpeg-concat.md`.

## Backup before remixing

Save a `final/final-master.mp4` copy of the first successful stream-copy result. If you later experiment with captions, music, or platform-specific re-encodes, you'll want the lossless master to start from.

## Output

```
final/
└── final.mp4   (~60s, 1280×720, h264 + aac, ~19MB)
```

## Done when

- ffprobe reports the expected duration and codecs
- The user has previewed the file end to end and approved the cut

## Optional next steps

- Burn captions through a captions tool (ZapCap or similar) for surfaces that benefit from them
- Derive a vertical 9:16 cut for Reels/TikTok/Shorts (see `references/ffmpeg-concat.md`)
- Run the compliance scan (Recipe 07)

## Next

→ `recipes/07-compliance.md` (optional)
