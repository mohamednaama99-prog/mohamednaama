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
 * - no `email` — the configured address is still a placeholder, and
 *   publishing a fake one in machine-readable form is worse than omitting it
 * - no `sameAs` — the social profile URLs have not been supplied
 * - no `address`, `priceRange`, `aggregateRating` or review counts — none of
 *   that was given, and all of it would be fabrication
 */
export function homepageJsonLd() {
  const personId = `${site.url}/#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    image: `${site.url}${media.heroLandscape.src}`,
    description: site.description,
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
    description:
      "Daily and weekly online coaching: a training programme written for you, nutrition recommendations, technique review from video, and check-ins on a set rhythm.",
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
