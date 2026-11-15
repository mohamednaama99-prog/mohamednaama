/**
 * Every image on the site, in one place.
 *
 * Components never hardcode an image path. To swap a photo: drop the file into
 * `public/images/`, update the entry here, and update the alt text to describe
 * what the new picture actually shows. See `public/images/README.md`.
 *
 * These are Mohamed's own photographs, supplied by the client. They were
 * cropped to the aspect ratios below, resized, and saved without EXIF (so no
 * camera or GPS metadata ships with them).
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  /** Describes what the picture actually shows. */
  alt: string;
};

export const media = {
  /**
   * Hero background, art-directed.
   *
   * The landscape crop is only usable from `lg` up. Below that the hero is a
   * tall container, and `object-cover` on a 3:2 frame renders it about 1072px
   * wide inside a 375px viewport — so the browser was upscaling a 750px file
   * nearly 3x. The 4:5 crop exists so phones get a frame shaped like the space
   * it has to fill. Hero renders both through one `<picture>`, so only one
   * file is ever downloaded.
   */
  heroLandscape: {
    src: "/images/coach-mohamed-hero.jpg",
    width: 2400,
    height: 1600,
    alt: "Mohamed Naama on the gym floor where he coaches",
  },
  heroPortrait: {
    src: "/images/coach-mohamed-hero-portrait.jpg",
    width: 1200,
    height: 1500,
    alt: "Mohamed Naama on the gym floor where he coaches",
  },

  /** Landscape training shot beside the coach's story on the homepage. */
  coachTraining: {
    src: "/images/coach-mohamed-training.jpg",
    width: 1600,
    height: 1143,
    alt: "Mohamed Naama mid-set on a seated dumbbell curl",
  },

  /** Used on /about so the two pages do not repeat the same photograph. */
  coachPortrait: {
    src: "/images/coach-mohamed-portrait.jpg",
    width: 1600,
    height: 1143,
    alt: "Mohamed Naama resting between sets, looking off camera",
  },
} as const satisfies Record<string, SiteImage>;
