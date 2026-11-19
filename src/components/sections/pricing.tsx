import { Section, SectionHeading } from "@/components/primitives/section";
import { PricingSelector } from "@/components/sections/pricing-selector";

export function Pricing() {
  return (
    <Section id="plans" tone="sunken">
      <SectionHeading
        eyebrow="Coaching plans"
        title="Pick a term, then pick your rhythm."
        lede="Two choices, and you have your plan. Every route from here goes to the same application — no checkout, no booking system."
        align="center"
      />

      <PricingSelector />
    </Section>
  );
}
