import { Check } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import { Section, SectionHeading } from "@/components/primitives/section";
import { comparison } from "@/content/packages";
import { cn } from "@/lib/utils";

/**
 * Weekly vs Daily.
 *
 * This was a three-column table, which forced a horizontal scroll on phones
 * however it was sized. Two cards carrying the same attributes in the same
 * order read in parallel just as well, stack cleanly at 320px, and need no
 * scrolling at any width.
 */
function Value({ value, onDeep }: { value: string | boolean; onDeep?: boolean }) {
  if (value === true) {
    return (
      <span className="flex items-center gap-2">
        <Check
          aria-hidden
          className={cn("size-4 shrink-0", onDeep ? "text-tan-500" : "text-tan-700")}
        />
        <span className="sr-only">Included</span>
        <span aria-hidden className={onDeep ? "text-ink-ondeep-muted" : "text-ink-muted"}>
          Included
        </span>
      </span>
    );
  }

  if (value === false) {
    return (
      <span className={onDeep ? "text-ink-ondeep-muted" : "text-ink-muted"}>
        <span aria-hidden>—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  }

  return (
    <span className={onDeep ? "text-mist-100" : "text-ink"}>{value}</span>
  );
}

function PlanCard({
  name,
  blurb,
  pick,
  emphasised,
  delay,
}: {
  name: string;
  blurb: string;
  pick: (row: (typeof comparison)[number]) => string | boolean;
  emphasised?: boolean;
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "flex flex-col gap-6 rounded-xl border p-6 sm:p-8",
        emphasised
          ? "border-line-deep bg-surface-deep text-ink-ondeep"
          : "border-line bg-surface-raised",
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className={cn("t-h3", emphasised && "text-mist-100")}>{name}</h3>
        <p
          className={cn(
            "text-sm",
            emphasised ? "text-ink-ondeep-muted" : "text-ink-muted",
          )}
        >
          {blurb}
        </p>
      </div>

      <dl className="flex flex-col">
        {comparison.map((row) => (
          <div
            key={row.feature}
            className={cn(
              "flex flex-col gap-1 border-t py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6",
              emphasised ? "border-line-deep" : "border-line",
            )}
          >
            <dt
              className={cn(
                "text-xs sm:text-sm",
                emphasised ? "text-ink-ondeep-muted" : "text-ink-muted",
              )}
            >
              {row.feature}
            </dt>
            <dd className="text-sm font-medium sm:text-right">
              <Value value={pick(row)} onDeep={emphasised} />
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function Comparison() {
  return (
    <Section id="compare" tone="base">
      <SectionHeading
        eyebrow="Weekly vs Daily"
        title="How close do you want the contact?"
        lede="Both plans include the same program, nutrition recommendations and technique review. What changes is how often Mohamed is in it with you."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <PlanCard
          name="Weekly Coaching"
          blurb="One review a week, for training that is already consistent."
          pick={(row) => row.weekly}
          delay={0}
        />
        <PlanCard
          name="Daily Coaching"
          blurb="Contact on every training day, for building the habit."
          pick={(row) => row.daily}
          emphasised
          delay={90}
        />
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        Not sure which fits? Say so in the form and Mohamed will tell you which
        he would recommend.
      </p>
    </Section>
  );
}
