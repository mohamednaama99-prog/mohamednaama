/**
 * Meet Coach Mohamed.
 *
 * IMPORTANT — the biography below is a PLACEHOLDER.
 *
 * `CLAUDE.md` was named as the source of the bio, but that file contains a
 * single line (`@AGENTS.md`, an import of the agent instructions) and no
 * biography. Rather than invent a career, these paragraphs restate only the
 * four client-confirmed facts and leave the personal story to be filled in.
 *
 * Nothing here asserts an experience, qualification, achievement or client
 * result that was not supplied. Replace `bio` wholesale when the real copy
 * arrives and set `bioIsPlaceholder` to false.
 */

export const coach = {
  name: "Mohamed Naama",
  title: "Online Fitness & Performance Coach",

  bioIsPlaceholder: true,

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

  /** TODO(client): Mohamed's own words — why he coaches, who he works best
   *  with, where he trained, languages spoken. Rendered only when set. */
  quote: null as string | null,
} as const;
