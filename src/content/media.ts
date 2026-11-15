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
  /** Full-bleed hero background. Face sits right of centre; see Hero for the
   *  object-position that keeps it clear of the text at every breakpoint. */
  heroBackground: {
    src: "/images/coach-mohamed-hero.jpg",
    width: 2400,
    height: 1600,
    alt: "Mohamed Naama on the gym floor where he coaches",
  },
  /** Landscape training shot used beside the coach's story. */
  coachTraining: {
    src: "/images/coach-mohamed-training.jpg",
    width: 1600,
    height: 1143,
    alt: "Mohamed Naama mid-set on a seated dumbbell curl",
  },
} as const satisfies Record<string, SiteImage>;
