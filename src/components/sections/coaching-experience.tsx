import { Reveal } from "@/components/primitives/reveal";
import { Section, SectionHeading } from "@/components/primitives/section";
import { experience } from "@/content/experience";

export function CoachingExperience() {
  return (
    <Section id="experience" tone="base">
      <SectionHeading
        eyebrow={experience.eyebrow}
        title={experience.heading}
        lede={experience.lede}
      />

      {/* Four groups, rules instead of boxes, and fragments instead of
          paragraphs — the section is meant to be scanned, not read. */}
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

            <p className="max-w-[42ch] text-sm text-ink-muted">{group.summary}</p>

            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
              {group.points.map((point, index) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-xs text-ink-muted"
                >
                  {index > 0 ? (
                    <span aria-hidden className="h-1 w-1 rounded-full bg-tan-500" />
                  ) : null}
                  {point}
                </li>
              ))}
            </ul>
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
            <li key={item} className="flex gap-2.5 text-sm text-ink-ondeep-muted">
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
  );
}
