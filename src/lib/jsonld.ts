import { faq } from "@/content/faq";
import { media } from "@/content/media";
import { packages } from "@/content/packages";
import { credentials, site } from "@/content/site";

/**
 * Structured data for the homepage.
 *
 * Built strictly from what is already in `src/content`. Nothing is invented
 * and nothing is padded out to satisfy a schema:
 *
 * - no `telephone` — the site offers messaging only, by instruction
 * - no `address`, `priceRange`, `aggregateRating` or review counts — none of
 *   that was given, and all of it would be fabrication
 *
 * `email` and `sameAs` are the client-confirmed address and Instagram
 * profile from `site`, and drop out if either is removed there.
 */
export function homepageJsonLd() {
  const personId = `${site.url}/#person`;
  const sameAs = Object.values(site.social);

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    image: `${site.url}${media.coachPortrait.src}`,
    description: site.description,
    ...(site.email ? { email: site.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    /* Both are client-confirmed. */
    hasCredential: credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential,
    })),
  };

  const offers = packages.map((pkg) => ({
    "@type": "Offer",
    name: `${pkg.name} — ${pkg.termLabel}`,
    price: pkg.price.total,
    priceCurrency: pkg.price.currency,
    category: "Online personal coaching",
    url: `${site.url}/apply?package=${pkg.id}`,
    availability: "https://schema.org/InStock",
  }));

  const service = {
    "@type": "Service",
    "@id": `${site.url}/#service`,
    name: "Online fitness coaching",
    serviceType: "Online personal training",
    provider: { "@id": personId },
    /* The audience is the United States; prices are in US dollars. */
    areaServed: "US",
    description:
      "Daily and weekly online coaching: a training program written for you, nutrition recommendations, technique review from video, and check-ins on a set rhythm.",
    offers,
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": personId },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, person, service, faqPage],
  };
}
