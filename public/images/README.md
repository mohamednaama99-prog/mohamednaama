# Image assets

Every file prefixed `temp-` is **temporary stock photography** standing in until
Coach Mohamed supplies his own. None of it depicts Mohamed Naama, and no alt
text claims that it does.

## Current temporary assets

| File | Source | Photographer | License | Used by |
| --- | --- | --- | --- | --- |
| `temp-hero-portrait.jpg` | [Unsplash `SzHsiYO6pZE`](https://unsplash.com/photos/grayscale-photo-of-man-wearing-nike-shirt-SzHsiYO6pZE) | Dani (@frokz) | Unsplash License (free) | Hero |
| `temp-coaching-session.jpg` | [Unsplash `bPd5bBHLdco`](https://unsplash.com/photos/a-man-holding-a-barbell-in-a-gym-bPd5bBHLdco) | Crosby Hinze | Unsplash License (free) | Meet Coach Mohamed |

## Replacing them with real photography

All image paths and dimensions live in one file: **`src/content/media.ts`**.
No component references an image path directly.

1. Drop the new file into `public/images/` (e.g. `coach-portrait.jpg`).
2. Update that entry in `src/content/media.ts` — `src`, `width`, `height`, `alt`,
   and set `temporary: false`.
3. Delete the `temp-` file.

Nothing else needs to change. `temporary: true` is what drives the internal
"temporary asset" badge shown during development.

## What to brief the photographer

- **Hero:** a vertical portrait, roughly 5:7, of Mohamed in training kit, shot
  head-and-shoulders with the face clearly lit. The site renders it as a navy
  duotone, so an evenly lit, low-colour frame works best — a desaturated or
  black-and-white original is ideal. The left and bottom edges dissolve into
  navy, so leave space around the head.
- **Meet the coach:** a landscape coaching moment, roughly 7:5 — Mohamed working
  with a client rather than posing.
- Avoid third-party logos and brand marks on clothing or walls; they have to be
  cleared separately and they fight the palette.
