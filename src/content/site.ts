/**
 * Site-wide content and configuration.
 *
 * Everything the client can change lives in `src/content`. No copy is
 * hard-coded inside a component.
 *
 * Facts below marked CONFIRMED were supplied by the client. Nothing else
 * claims a credential, a result, or a business detail.
 */

const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://coachmohamednaama.com";

export const site = {
  /** TODO(client): confirm the production domain. Affects canonical + OG URLs. */
  url,

  name: "Mohamed Naama",
  shortName: "Naama",
  role: "Online Fitness & Performance Coach",

  description:
    "Online fitness coaching with Mohamed Naama — NASM certified coach and professional soccer player. Daily and weekly coaching built around your schedule, your goals and your week.",

  /** CONFIRMED by client: +1 347 653 7295 → https://wa.me/13476537295
   *  International format, digits only. Override per-environment with
   *  NEXT_PUBLIC_WHATSAPP_NUMBER. Every WhatsApp CTA goes through
   *  whatsappLink() below — never a hardcoded wa.me URL. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "13476537295",

  /** TODO(client): social profiles. Omitted from the UI while null. */
  social: {
    instagram: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
  },

  /** TODO(client): contact email for the footer and form receipts. */
  email: null as string | null,
} as const;

/* Absolute so they work from /apply as well as the landing page. */
export const nav = [
  { label: "About", href: "/#about" },
  { label: "Coaching", href: "/#experience" },
  { label: "Plans", href: "/#plans" },
  { label: "FAQ", href: "/#faq" },
] as const;

/** CONFIRMED by client. Do not change without client sign-off. */
export const credentials = [
  "NASM Certified",
  "Professional soccer player",
] as const;

/** CONFIRMED by client. */
export const trustStats = [
  {
    id: "sessions",
    value: "4,000",
    suffix: "+",
    label: "Coaching sessions delivered",
  },
  {
    id: "clients",
    value: "300",
    suffix: "+",
    label: "Clients coached",
  },
  {
    id: "nasm",
    value: "NASM",
    suffix: "",
    label: "Certified personal trainer",
  },
  {
    id: "pro",
    value: "Pro",
    suffix: "",
    label: "Professional soccer player",
  },
] as const;

/**
 * Draft marketing copy. Makes no factual claim beyond the CONFIRMED items
 * above — safe to rewrite without touching any component.
 */
export const hero = {
  eyebrow: "Online coaching",
  headline: ["Train with a plan", "that answers", "to your week."],
  /** The word in `headline` that takes the accent treatment. */
  accentLine: 2,
  lede: "Daily and weekly online coaching for people who want real structure, honest accountability, and a coach who adjusts the plan to the life you actually have.",
  primaryCta: { label: "Apply for coaching", href: "/apply" },
  secondaryCta: { label: "See the plans", href: "/#plans" },
} as const;

export const stickyCta = {
  label: "Apply for coaching",
  href: "/apply",
} as const;

/** Builds a wa.me link, or null when the number has not been supplied yet. */
export function whatsappLink(message?: string): string | null {
  if (!site.whatsappNumber) return null;
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
