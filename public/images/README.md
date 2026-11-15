# Image assets

All photography here is **Mohamed Naama's own**, supplied by the client. No
stock imagery remains on the site.

## Current assets

| File | Source frame | Crop | Output | Used by |
| --- | --- | --- | --- | --- |
| `coach-mohamed-hero-wide.jpg` | `17.jpeg` | 16:9 | 976×549 | Hero background, `lg` and up |
| `coach-mohamed-hero-tall.jpg` | `17.jpeg` | 4:5 | 976×1220 | Hero background below `lg` |
| `coach-mohamed-rack.jpg` | `7.jpeg` | 7:5 | 1600×1143 | Meet Coach Mohamed (homepage) |

/about is text-only and uses no photograph.

### A note on the hero resolution

`17.jpeg` is only 976×2048 — a low-resolution frame. Both hero crops keep that
native 976px width; the file is never upscaled, because that would add weight
without adding detail. The browser still has to stretch it on screen:

| Viewport | Rendered | Upscale |
| --- | --- | --- |
| 375px, DPR 2 | 572×715 | 1.17× |
| 375px, DPR 3 | 572×715 | 1.76× |
| 1440px, DPR 1 | 1440×810 | 1.48× |
| 1440px, DPR 2 | 1440×810 | 2.95× |
| 1920px, DPR 1 | 1920×1080 | 1.97× |

It holds up because the photograph is dark, soft-focus and rain-blurred, so
the softness reads as atmosphere. **A higher-resolution original would remove
the compromise entirely** — if one exists, re-crop from it and the numbers
above all drop to 1.0.

## Replacing a photo

All paths, dimensions and alt text live in one file: **`src/content/media.ts`**.
No component references an image path directly.

1. Drop the new file into `public/images/`.
2. Update that entry in `src/content/media.ts` — `src`, `width`, `height`, and
   `alt` rewritten to describe what the new picture actually shows.
3. Delete the old file.

## Re-cropping from new originals

Aspect ratios the layouts expect:

- **Hero, wide** — 16:9, subject centred with room on the left for the
  headline. Used from `lg` up.
- **Hero, tall** — 4:5, subject centred. Phones render the hero in a tall
  container, and cropping a wide frame to fill it forces the browser to
  upscale heavily; a tall source avoids that. Both are served from one
  `<picture>`, so only one file downloads.
- **Meet the coach** — 7:5 landscape.

Strip metadata when you export. Avoid third-party logos and brand marks where
you can; they need separate clearance.
