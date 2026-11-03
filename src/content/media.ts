/**
 * Every image on the site, in one place.
 *
 * Components never hardcode an image path. To swap a temporary stock photo for
 * a real one: drop the file into `public/images/`, update the entry here, and
 * set `temporary: false`. See `public/images/README.md`.
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  /** Must describe what is actually shown. Temporary stock is never described
   *  as if it were Mohamed. */
  alt: string;
  /** Drives the internal "temporary asset" badge during development. */
  temporary: boolean;
};

export const media = {
  heroPortrait: {
    src: "/images/temp-hero-portrait.jpg",
    width: 1000,
    height: 1400,
    alt: "Portrait of an athlete in training kit",
    temporary: true,
  },
  coachingSession: {
    src: "/images/temp-coaching-session.jpg",
    width: 1400,
    height: 1000,
    alt: "A coach guiding a client through a barbell lift in a gym",
    temporary: true,
  },
} as const satisfies Record<string, SiteImage>;

/** True while any image on the page is still stock. */
export const hasTemporaryMedia = Object.values(media).some((m) => m.temporary);
