import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/primitives/reveal";
import { Section, SectionHeading } from "@/components/primitives/section";
import { FinalCta } from "@/components/sections/final-cta";
import { TrustBar } from "@/components/sections/trust-bar";
import { Button } from "@/components/ui/button";
import { coach } from "@/content/coach";
import { experience } from "@/content/experience";
import { whyOnline } from "@/content/site";

export const metadata: Metadata = {
  title: "About Mohamed Naama",
  description:
    "NASM certified coach and professional soccer player. How Mohamed coaches online, and what working with him involves.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="main" className="flex-1">
        <PageHero
          eyebrow="About"
          title={["A professional", "athlete's standards,", "applied to your week."]}
          lede="Online coaching built around the days you can genuinely train — not an ideal week you will not keep."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" variant="accent">
              <Link href="/apply">
                Apply for coaching
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="onDeep">
              <Link href="/#plans">See the plans</Link>
            </Button>
          </div>
        </PageHero>

        <TrustBar />

        {/* Story, on the warm band — the same treatment the homepage gives
            the coach section. */}
        {/* Text only. The heading and story share a two-column grid at lg so
            the measure stays readable, and the facts run full width beneath —
            no empty column where the photograph used to be. */}
        <Section tone="warm">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              eyebrow={coach.eyebrow}
              title="Coaching from both sides of the work."
              className="lg:sticky lg:top-28 lg:self-start"
            />

            <div className="flex flex-col gap-6">
              {coach.bio.map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 24)} delay={120 + i * 70}>
                  <p className="t-lede max-w-[60ch] text-ink-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={280}>
                <p className="border-l-2 border-tan-500 pl-5 text-ink">
                  {whyOnline}
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={340}>
            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-tan-500/30 pt-8 sm:grid-cols-4 lg:mt-16">
              {coach.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1.5">
                  <dt className="t-eyebrow text-ink-muted">{fact.label}</dt>
                  <dd
                    data-numeric
                    className="font-display text-xl leading-tight text-ink"
                    style={{ fontVariationSettings: '"wdth" 108, "wght" 660' }}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>

        <Section tone="base">
          <SectionHeading
            eyebrow="The approach"
            title="How the coaching works."
            lede={experience.lede}
          />

          <div className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:gap-y-14">
            {experience.groups.map((group, i) => (
              <Reveal
                key={group.id}
                delay={i * 80}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    data-numeric
                    className="font-mono text-xs tracking-[0.18em] text-accent-text"
                  >
                    {group.index}
                  </span>
                  <h3 className="t-h3">{group.title}</h3>
                </div>
                <p className="max-w-[42ch] text-sm text-ink-muted">
                  {group.summary}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={120}
            className="mt-14 flex flex-col gap-5 rounded-xl bg-surface-deep p-7 text-ink-ondeep sm:p-9 lg:flex-row lg:items-start lg:gap-12"
          >
            <h3 className="t-h3 shrink-0 text-mist-100 lg:max-w-[12ch]">
              {experience.expectations.title}
            </h3>
            <ul className="grid flex-1 gap-3 sm:grid-cols-2">
              {experience.expectations.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm text-ink-ondeep-muted"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tan-500"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
