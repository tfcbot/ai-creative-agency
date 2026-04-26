# ffmpeg — concat (stream copy)

The four Seedance blocks come out at the same codec, dimensions, frame rate, and audio spec. Stitch them without re-encoding — no quality loss, no processing time.

## Recipe

Build a concat list:

```
file '/abs/path/to/clips/block_1.mp4'
file '/abs/path/to/clips/block_2.mp4'
file '/abs/path/to/clips/block_3.mp4'
file '/abs/path/to/clips/block_4.mp4'
```

Save as `/tmp/concat_list.txt`. Then:

```
ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt -c copy final/final.mp4
```

## Notes

- `-safe 0` — required because the list contains absolute paths.
- `-c copy` — stream copy, no re-encode. Lossless and instant.
- A non-monotonic-DTS warning may print on stitch boundaries. It's benign for this use case (no frame-accurate sync downstream).

## Verify

```
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration final/final.mp4
```

Expect h264 + aac, 1280×720 (or whatever resolution you generated at), and a duration that matches the sum of the source clips (typically ~60.3s for 4×15s).

## When stream copy fails

If the four clips somehow have different codec params (e.g. you mixed 480p and 720p generations), stream copy will fail with a "Non-matching" error. Re-encode instead:

```
ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt \
  -c:v libx264 -crf 18 -preset slow \
  -c:a aac -b:a 192k \
  final/final.mp4
```

Slower (~30s for 60s of footage) but works regardless of input mismatch.

## Deriving platform variants from the master

Keep `final/final.mp4` as the canonical 16:9 master. Crop derived variants from it instead of regenerating:

```
# 9:16 vertical (Reels / TikTok / Shorts)
ffmpeg -i final/final.mp4 -vf "crop=ih*9/16:ih" -c:a copy final/final-vertical.mp4

# 1:1 square (legacy IG feed)
ffmpeg -i final/final.mp4 -vf "crop=ih:ih" -c:a copy final/final-square.mp4
```

Center-cropping a 16:9 wide to 9:16 cuts off both hosts hard — only do this if the action is centered. Otherwise, regenerate at 9:16 in Seedance for vertical surfaces.
