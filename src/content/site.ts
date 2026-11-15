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
    "Online fitness coaching with Mohamed Naama — NASM certified coach and professional soccer player, with 4,000+ in-person sessions and 300+ clients coached face to face. Daily and weekly coaching built around your schedule and your goals.",

  /** CONFIRMED by client: +1 347 653 7295 → https://wa.me/13476537295
   *  International format, digits only. Override per-environment with
   *  NEXT_PUBLIC_WHATSAPP_NUMBER. Every WhatsApp CTA goes through
   *  whatsappLink() below — never a hardcoded wa.me URL. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "13476537295",

  /**
   * TODO(client): the actual profile URLs.
   *
   * These stay null until real profiles are supplied — the footer and mobile
   * menu render nothing for a null entry rather than linking to a platform
   * home page. Set them here or through the matching env vars.
   */
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? null,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? null,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
  },

  /**
   * TODO(client): REPLACE BEFORE LAUNCH. `coach@example.com` is a stand-in
   * supplied for the handoff, not a working address. Setting it to null hides
   * the email option everywhere.
   */
  email: "coach@example.com" as string | null,
} as const;

/* Absolute so they work from /apply and the supporting pages, not just the
   landing page. About and Contact are real pages now; Coaching, Plans and FAQ
   remain sections of the homepage. */
export const nav = [
  { label: "About", href: "/about" },
  { label: "Coaching", href: "/#experience" },
  { label: "Plans", href: "/#plans" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
] as const;

/** The mobile menu leads with Home, which the desktop header gets from the logo. */
export const mobileNav = [{ label: "Home", href: "/" }, ...nav] as const;

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
    label: "In-person sessions delivered",
  },
  {
    id: "clients",
    value: "300",
    suffix: "+",
    label: "Clients coached face to face",
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
  headline: ["Proven in person.", "Now coaching you", "anywhere."],
  /** The line in `headline` that takes the accent treatment. */
  accentLine: 2,
  lede: "4,000+ in-person sessions and 300+ clients of experience, delivered online with a plan built around your goals and a coach who keeps you accountable.",
  primaryCta: { label: "Apply for coaching", href: "/apply" },
  secondaryCta: { label: "See the plans", href: "/#plans" },
} as const;

/**
 * Why the coaching moved online. Shown with the track record, so the
 * in-person experience and the reason for going online read together.
 */
export const whyOnline =
  "After years of coaching clients face to face, we took it online for one reason: to reach more people and help them achieve their goals, wherever they train.";

export const stickyCta = {
  label: "Apply for coaching",
  href: "/apply",
} as const;

/** Policy pages, kept apart from the main navigation. */
export const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refunds & Cancellation", href: "/refunds" },
] as const;

export type SocialPlatform = "instagram" | "tiktok" | "facebook";

/** Fixed display order, independent of whether a URL exists yet. */
export const socialPlatforms: SocialPlatform[] = [
  "instagram",
  "tiktok",
  "facebook",
];

/**
 * Every platform, with its URL when one has been supplied and null when it has
 * not. The icon is shown either way; a null entry renders as a non-interactive
 * placeholder rather than a link to a platform home page.
 */
export function socialEntries(): { platform: SocialPlatform; href: string | null }[] {
  return socialPlatforms.map((platform) => ({
    platform,
    href: site.social[platform] ?? null,
  }));
}

/**
 * Contact is messaging only — WhatsApp and email. There is deliberately no
 * `tel:` link or call option anywhere on the site; the number in
 * `site.whatsappNumber` is used solely to build WhatsApp links.
 *
 * The coach's number formatted for display, where showing it adds context to
 * the WhatsApp option. It is never rendered as a dialable link.
 */
export function whatsappDisplayNumber() {
  const digits = site.whatsappNumber;
  if (!digits || digits.length !== 11 || !digits.startsWith("1")) return null;

  const national = digits.slice(1);
  return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
}

/** Builds a wa.me link, or null when the number has not been supplied yet. */
export function whatsappLink(message?: string): string | null {
  if (!site.whatsappNumber) return null;
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
