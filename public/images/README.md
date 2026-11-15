# Image assets

All photography here is **Mohamed Naama's own**, supplied by the client. No
stock imagery remains on the site.

## Current assets

| File | Source frame | Crop | Output | Used by |
| --- | --- | --- | --- | --- |
| `coach-mohamed-pushup-wide.jpg` | `18.jpeg` | 4:3, full width | 1103×827 | Hero, `lg` and up |
| `coach-mohamed-pushup-tall.jpg` | `18.jpeg` | x 190–975, y 840–2125 | 785×1285 | Hero below `lg` |
| `coach-mohamed-gym-portrait.jpg` | `1.jpeg` | 7:5 around the face | 1600×1143 | Meet Coach Mohamed (homepage) |
| `src/app/opengraph-image.jpg` | `18.jpeg` | composed card | 1200×630 | Social card (also `twitter-image.jpg`) |

/about is text-only and uses no photograph.

Every file is saved without EXIF and without an ICC profile. `18.jpeg` is
tagged Display P3, so it is converted to sRGB first; dropping the profile
without converting would shift the colors.

### The hero

The coach always sits opposite the headline:

- **Below `lg`** the tall crop spans the screen width at its natural aspect,
  so the coach fills the width at the top of the frame. His hands land at
  60.5% of the image width, and the hero's text band starts at `64vw`, so the
  headline never sits over him. If the tall crop is ever re-cut, that padding
  in `hero.tsx` has to move with it.
- **From `lg` up** the wide crop fills the right 60% of the section, scaled by
  its height, and dissolves into the navy the headline sits on.

### Contrast behind the hero text

Measured on a production build in headless Edge: the headline and lede made
transparent, then every pixel inside each line's text box checked against
the text color. The lede is `mist-100` at 85% opacity, so its color is
composited over each pixel before comparing. Figures are the **worst pixel**.

| Viewport | Headline (white) | Headline (tan line) | Lede | AA needed |
| --- | --- | --- | --- | --- |
| 375×812, DPR 3 | 6.43:1 | 4.52:1 | 11.01:1 | 3:1 headline, 4.5:1 lede |
| 1440×900, DPR 2 | 14.01:1 | 5.88:1 | 10.99:1 | 3:1 headline, 4.5:1 lede |

The headline is large text (32px and up, bold), so its AA threshold is 3:1;
every line clears 4.5:1 anyway.

### Resolution

`18.jpeg` is only 1103×2125 — a low-resolution frame. Both crops are cut at
native resolution and the file is never upscaled, because that would add
weight without adding detail. The optimizer never enlarges either (it serves
785px and 1103px at most). The browser still stretches them on screen:

| Viewport | Crop | Rendered (CSS px) | On-screen upscale |
| --- | --- | --- | --- |
| 375px, DPR 2 | tall | 375×614 | 0.96× |
| 375px, DPR 3 | tall | 375×614 | 1.43× |
| 768px, DPR 2 | tall | 768×1257 | 1.96× |
| 1024px, DPR 1 | wide | 943×707 | 0.85× |
| 1440px, DPR 1 | wide | 1104×828 | 1.00× |
| 1440px, DPR 2 | wide | 1104×828 | 2.00× |
| 1920px, DPR 1 | wide | 1326×994 | 1.20× |

It holds up because the photograph is dark, soft and rain-wet, so the
softness reads as atmosphere. **A higher-resolution original would remove the
compromise entirely** — if one exists, re-crop from it at the same geometry.

## Replacing a photo

All paths, dimensions and alt text live in one file: **`src/content/media.ts`**.
No component references an image path directly.

1. Drop the new file into `public/images/`.
2. Update that entry in `src/content/media.ts` — `src`, `width`, `height`, and
   `alt` rewritten to describe what the new picture actually shows.
3. Delete the old file.

## Re-cropping from new originals

Aspect ratios the layouts expect:

- **Hero, wide** — landscape (4:3 now), subject centered. Used from `lg` up in
  a box 60% of the viewport wide.
- **Hero, tall** — portrait, the subject filling the width near the top and
  plenty of plain ground below for the text. See the note above about the
  `64vw` text offset.
- **Meet the coach** — 7:5 landscape.

Strip metadata and convert to sRGB when you export. Avoid third-party logos
and brand marks where you can; they need separate clearance.
