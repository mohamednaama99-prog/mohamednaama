import Image from "next/image";

import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, Section } from "@/components/primitives/section";
import { coach } from "@/content/coach";
import { media } from "@/content/media";

const shot = media.coachTraining;

export function AboutCoach() {
  return (
    <Section id="about" tone="warm">
      <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        {/* Portrait side. The tan band behind the image is offset rather than
            centred, so the photograph sits in the layout instead of on it. */}
        <Reveal variant="scale" className="relative">
          <div
            aria-hidden
            className="absolute -top-4 -left-4 hidden h-full w-full rounded-xl border border-tan-500/40 sm:block"
          />
          <div className="relative aspect-[7/5] w-full overflow-hidden rounded-xl">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover saturate-[0.9]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-navy-800 opacity-25 mix-blend-color"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow>{coach.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="t-display-l max-w-[20ch]">{coach.heading}</h2>
          </Reveal>

          <div className="flex flex-col gap-4">
            {coach.bio.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={160 + i * 70}>
                <p className="t-lede max-w-[56ch] text-ink-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {coach.quote ? (
            <Reveal delay={320}>
              <blockquote className="border-l-2 border-tan-500 pl-5 text-ink italic">
                {coach.quote}
              </blockquote>
            </Reveal>
          ) : null}

          <Reveal delay={340} className="pt-2">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-tan-500/30 pt-7 sm:grid-cols-4">
              {coach.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1.5">
                  <dt className="t-eyebrow text-ink-muted">{fact.label}</dt>
                  <dd
                    data-numeric
                    className="font-display text-lg leading-tight text-ink"
                    style={{ fontVariationSettings: '"wdth" 108, "wght" 660' }}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
