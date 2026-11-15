/**
 * Meet Coach Mohamed.
 *
 * CONFIRMED by client: the biography and facts below, as shown. They assert
 * nothing beyond the four client-confirmed facts; change them only with the
 * client's sign-off.
 */

export const coach = {
  name: "Mohamed Naama",
  title: "Online Fitness & Performance Coach",

  /** The section eyebrow and heading are safe to keep as-is. */
  eyebrow: "Meet your coach",
  heading: "A professional athlete's standards, applied to your week.",

  bio: [
    "Mohamed Naama is a NASM certified coach and a professional soccer player — someone who has spent his career on both sides of the work, following a program himself and writing them for other people.",
    "Across more than 4,000 in-person sessions and over 300 clients coached face to face, that experience shapes how he coaches online: a plan you can actually hold to, reviewed often enough to stay honest, and adjusted when your week does not go to plan.",
  ],

  /** CONFIRMED by client — shown as a credential list beside the portrait. */
  facts: [
    { label: "Certification", value: "NASM Certified" },
    { label: "Background", value: "Professional soccer player" },
    { label: "In-person sessions", value: "4,000+" },
    { label: "Coached face to face", value: "300+" },
  ],

  /** Optional pull quote in Mohamed's own words, rendered only when set. */
  quote: null as string | null,
} as const;
