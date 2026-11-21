/**
 * Every image on the site, in one place.
 *
 * Components never hardcode an image path. To swap a photo: drop the file into
 * `public/images/`, update the entry here, and update the alt text to describe
 * what the new picture actually shows. See `public/images/README.md`.
 *
 * These are Mohamed's own photographs, supplied by the client. They were
 * cropped to the aspect ratios below, resized down where needed, and saved
 * without EXIF (so no camera or GPS metadata ships with them).
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
   * Hero, art-directed: the tall crop below `lg`, the wide 4:3 crop from
   * `lg` up, both from the same original (18.jpeg) and served through one
   * `<picture>` so only one file downloads.
   *
   * Both are cut at the original's native resolution — the source is a
   * low-resolution frame and upscaling the file would only add weight, not
   * detail. The screen upscale that remains is recorded in the README. The
   * hero's top padding below `lg` depends on the tall crop's geometry; see
   * the comment in hero.tsx before re-cropping it.
   */
  heroWide: {
    src: "/images/coach-mohamed-pushup-wide.jpg",
    width: 1103,
    height: 827,
    alt: "Mohamed Naama mid push-up on a rain-soaked city sidewalk",
  },
  heroTall: {
    src: "/images/coach-mohamed-pushup-tall.jpg",
    width: 785,
    height: 1285,
    alt: "Mohamed Naama mid push-up on a rain-soaked city sidewalk",
  },

  /** Beside the coach's story on the homepage (from 7.jpeg, 7:5, cut at
   *  native resolution). Also the Person image in the JSON-LD. */
  coachPortrait: {
    src: "/images/coach-mohamed-window-portrait.jpg",
    width: 1320,
    height: 943,
    alt: "Mohamed Naama in a black tank top, arms crossed, looking to the side in front of a misted window",
  },
} as const satisfies Record<string, SiteImage>;
