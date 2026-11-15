/**
 * Page titles and meta descriptions.
 *
 * Written for US search intent around "online fitness coaching" and "online
 * personal training", in plain sentences rather than keyword lists. Every
 * claim is one the rest of the site already makes.
 *
 * Limits: a rendered title stays under 60 characters (pages other than home
 * get " | Mohamed Naama" appended by the template in app/layout.tsx), and a
 * description stays under 160.
 */

export type PageSeo = { title: string; description: string };

/** Appended to every title except the homepage's. */
export const titleSuffix = " | Mohamed Naama";

export const seo = {
  /** Rendered as-is, without the suffix. */
  home: {
    title: "Online Personal Training & Fitness Coaching | Mohamed Naama",
    description:
      "Online fitness coaching and personal training with Mohamed Naama, a NASM-certified coach and pro soccer player. Daily or weekly check-ins, built for your week.",
  },
  about: {
    title: "About Your Online Fitness Coach",
    description:
      "Meet Mohamed Naama: NASM-certified personal trainer, professional soccer player, and online coach with 4,000+ in-person sessions behind him.",
  },
  contact: {
    title: "Contact Your Online Personal Trainer",
    description:
      "Questions about online fitness coaching? Message Mohamed Naama on WhatsApp or by email, or apply for a coaching plan in a couple of minutes.",
  },
  apply: {
    title: "Apply for Online Fitness Coaching",
    description:
      "Apply for online personal training with Mohamed Naama. Pick a weekly or daily coaching plan, or just ask a question, and he replies on WhatsApp.",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "What this website collects, why, and what happens to it.",
  },
  terms: {
    title: "Terms & Conditions",
    description:
      "The terms covering this website and the online fitness coaching offered through it.",
  },
  refunds: {
    title: "Refunds & Cancellation",
    description:
      "Refund and cancellation policy for online coaching with Mohamed Naama, including the 7-day guarantee on your first payment.",
  },
} as const satisfies Record<string, PageSeo>;
