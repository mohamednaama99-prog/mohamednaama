/**
 * The four coaching packages.
 *
 * CONFIRMED by client: Daily Coaching and Weekly Coaching, each on a 3-month
 * and a 6-month term, with the prices below. There is no monthly or quarterly
 * plan, and there is no online checkout — every package CTA routes to
 * /apply with the package preselected.
 *
 * Still PROVISIONAL: the feature lists. Prices are confirmed.
 */

export type PackageId = "daily-3" | "daily-6" | "weekly-3" | "weekly-6";
export type Cadence = "daily" | "weekly";
export type Months = 3 | 6;

export type CoachingPackage = {
  id: PackageId;
  cadence: Cadence;
  months: Months;
  weeks: number;
  name: string;
  termLabel: string;
  tagline: string;
  /** CONFIRMED by client. */
  price: { weekly: number; total: number; currency: "USD" };
  /**
   * The communication difference, stated on the card itself so nobody has to
   * reach the application form to discover what separates the two plans.
   * Deliberately free of availability promises.
   */
  support: string;
  /** PROVISIONAL — awaiting the client's real inclusions. */
  features: string[];
  recommended?: boolean;
};

/** Prices are confirmed; the inclusion lists are not. */
export const featuresAreProvisional = true;

const dailyFeatures = [
  "Daily check-ins with your coach",
  "Training program built for your schedule",
  "Nutrition recommendations",
  "Technique review on submitted videos",
  "Programme adjusted as your week changes",
  "Direct WhatsApp access",
];

const weeklyFeatures = [
  "Weekly check-in and programme review",
  "Training program built for your schedule",
  "Nutrition recommendations",
  "Technique review on submitted videos",
  "Direct WhatsApp access",
];

export const packages: CoachingPackage[] = [
  {
    id: "weekly-3",
    cadence: "weekly",
    months: 3,
    weeks: 12,
    name: "Weekly Coaching",
    termLabel: "3 months",
    tagline: "Structure and review, week by week.",
    support: "Weekly check-ins and ongoing coaching support between them.",
    price: { weekly: 55, total: 660, currency: "USD" },
    features: weeklyFeatures,
  },
  {
    id: "daily-3",
    cadence: "daily",
    months: 3,
    weeks: 12,
    name: "Daily Coaching",
    termLabel: "3 months",
    tagline: "Close contact, every training day.",
    support:
      "Daily check-ins, priority replies to your questions during the day, and more frequent performance follow-ups.",
    price: { weekly: 75, total: 900, currency: "USD" },
    features: dailyFeatures,
    recommended: true,
  },
  {
    id: "weekly-6",
    cadence: "weekly",
    months: 6,
    weeks: 24,
    name: "Weekly Coaching",
    termLabel: "6 months",
    tagline: "The same rhythm, with room for real change.",
    support: "Weekly check-ins and ongoing coaching support between them.",
    price: { weekly: 40, total: 960, currency: "USD" },
    features: weeklyFeatures,
  },
  {
    id: "daily-6",
    cadence: "daily",
    months: 6,
    weeks: 24,
    name: "Daily Coaching",
    termLabel: "6 months",
    tagline: "The deepest level of accountability offered.",
    support:
      "Daily check-ins, priority replies to your questions during the day, and more frequent performance follow-ups.",
    price: { weekly: 60, total: 1440, currency: "USD" },
    features: dailyFeatures,
    recommended: true,
  },
];

export const packageIds = packages.map((p) => p.id);

export function getPackage(id: string): CoachingPackage | undefined {
  return packages.find((p) => p.id === id);
}

export function findPackage(cadence: Cadence, months: Months) {
  return packages.find((p) => p.cadence === cadence && p.months === months);
}

export function packagesForTerm(months: Months) {
  /* Weekly first, then Daily — cheapest-to-closest reads better left to right. */
  return packages
    .filter((p) => p.months === months)
    .sort((a) => (a.cadence === "weekly" ? -1 : 1));
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * What the longer term saves against paying the 3-month weekly rate for the
 * same number of weeks. Returns null for the 3-month plans.
 */
export function termSaving(pkg: CoachingPackage): number | null {
  if (pkg.months !== 6) return null;
  const shortTerm = findPackage(pkg.cadence, 3);
  if (!shortTerm) return null;
  return (shortTerm.price.weekly - pkg.price.weekly) * pkg.weeks;
}

export const termOptions = [
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
] as const;

export const packageOptions = packages.map((p) => ({
  value: p.id,
  label: `${p.name} — ${p.termLabel}`,
}));

/**
 * Weekly vs Daily comparison.
 *
 * PROVISIONAL — derived from the cadence in the plan names, which is the only
 * difference the client has confirmed. Every row needs sign-off.
 */
export type ComparisonRow = {
  feature: string;
  weekly: string | boolean;
  daily: string | boolean;
};

export const comparison: ComparisonRow[] = [
  { feature: "Programme written for you", weekly: true, daily: true },
  { feature: "Check-ins", weekly: "Once a week", daily: "Every training day" },
  { feature: "Questions during the day", weekly: "Answered at your weekly check-in", daily: "Priority replies" },
  { feature: "Performance follow-ups", weekly: "Weekly", daily: "More frequent" },
  { feature: "Programme adjustments", weekly: "Weekly review", daily: "Session by session" },
  { feature: "Technique review on video", weekly: true, daily: true },
  { feature: "Nutrition recommendations", weekly: true, daily: true },
  { feature: "Direct WhatsApp access", weekly: true, daily: true },
  { feature: "Best suited to", weekly: "Training that is already consistent", daily: "Building the habit, or chasing a deadline" },
];
