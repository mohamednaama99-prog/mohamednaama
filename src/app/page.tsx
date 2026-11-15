import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StickyCta } from "@/components/layout/sticky-cta";
import { AboutCoach } from "@/components/sections/about-coach";
import { CoachingExperience } from "@/components/sections/coaching-experience";
import { Comparison } from "@/components/sections/comparison";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { TrustBar } from "@/components/sections/trust-bar";
import { homepageJsonLd } from "@/lib/jsonld";

/**
 * Landing page — the approved ten-section structure.
 *
 * Pricing sits deliberately early: it is a primary decision factor, and a
 * visitor should not have to scroll through the whole story to find it.
 *
 * The application form lives on its own page at /apply. Every plan CTA links
 * there with `?package=<id>`, which preselects that plan.
 */
export default function Home() {
  return (
    <>
      {/* Structured data, built only from src/content — see lib/jsonld.ts for
          what is deliberately omitted. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd()) }}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <TrustBar />
        <AboutCoach />
        <CoachingExperience />
        <Pricing />
        <Comparison />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
      <StickyCta />
    </>
  );
}
