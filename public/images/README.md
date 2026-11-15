# Image assets

All photography here is **Mohamed Naama's own**, supplied by the client. No
stock imagery remains on the site.

## Current assets

| File | Source frame | Crop | Output | Used by |
| --- | --- | --- | --- | --- |
| `coach-mohamed-hero.jpg` | `1.jpeg` | 3:2, cropped so the face sits right of centre | 2400×1600 | Hero background |
| `coach-mohamed-training.jpg` | `11.jpeg` | 7:5 | 1600×1143 | Meet Coach Mohamed (home + /about) |

The raw originals are **not** kept in the repository — they are large phone
captures and the client holds them. Each file above was cropped, resized with
Lanczos, re-encoded as progressive JPEG, and written from pixel data only, so
**no EXIF travels with them** (no camera model, no timestamp, no GPS).

Verify at any time:

```bash
python -c "from PIL import Image; print(Image.open('public/images/coach-mohamed-hero.jpg').getexif())"
```

An empty result means the metadata is gone.

## Replacing a photo

All paths, dimensions and alt text live in one file: **`src/content/media.ts`**.
No component references an image path directly.

1. Drop the new file into `public/images/`.
2. Update that entry in `src/content/media.ts` — `src`, `width`, `height`, and
   `alt` rewritten to describe what the new picture actually shows.
3. Delete the old file.

## Re-cropping from new originals

Aspect ratios the layouts expect:

- **Hero** — 3:2, the face right of centre with open space on the left for the
  headline. The hero renders it `object-cover` under a navy gradient, so the
  left third is where the text sits.
- **Meet the coach** — 7:5 landscape.

Strip metadata when you export. Avoid third-party logos and brand marks where
you can; they need separate clearance.
