import { Section, SectionHeading } from "@/components/primitives/section";
import { FaqList } from "@/components/sections/faq-section";
import { Reveal } from "@/components/primitives/reveal";

export function Faq() {
  return (
    <Section id="faq" tone="warm">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="Questions"
          title="The things people ask before they start."
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="flex flex-col gap-5">
          <Reveal delay={80}>
            <FaqList />
          </Reveal>

        </div>
      </div>
    </Section>
  );
}
