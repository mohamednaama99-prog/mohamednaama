import { Reveal } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { trustStats } from "@/content/site";

/**
 * Trust & Experience — the figures that earn the next ten seconds.
 * Every value here is client-confirmed; nothing is estimated.
 */
export function TrustBar() {
  return (
    <Section id="trust" tone="base" className="py-16 lg:py-20">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
        {trustStats.map((stat, i) => (
          <Reveal
            key={stat.id}
            delay={i * 90}
            as="div"
            className="flex flex-col gap-2 border-t border-line pt-5 lg:pt-6"
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="flex flex-col gap-2">
              <span
                data-numeric
                className="font-display text-[clamp(2.25rem,4.4vw,3.25rem)] leading-none text-ink"
                style={{ fontVariationSettings: '"wdth" 110, "wght" 700' }}
              >
                {stat.value}
                <span className="text-tan-700">{stat.suffix}</span>
              </span>
              <span className="max-w-[20ch] text-sm text-ink-muted">
                {stat.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
