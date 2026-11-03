"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { SegmentedControl } from "@/components/primitives/segmented-control";
import { Button } from "@/components/ui/button";
import {
  formatUsd,
  packagesForTerm,
  termOptions,
  termSaving,
  type Months,
} from "@/content/packages";
import { cn } from "@/lib/utils";

/**
 * Two-step plan selection.
 *
 *   Step 1 — term: a segmented control, 3 or 6 months.
 *   Step 2 — frequency: the two cards for that term, weekly and daily.
 *
 * Only ever two cards on screen, which is what makes this work on a phone
 * without a horizontal rail.
 */
export function PricingSelector() {
  const [months, setMonths] = useState<Months>(3);
  const shown = packagesForTerm(months);

  return (
    <div className="mt-12 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3">
        <p className="t-eyebrow text-ink-muted">Step 1 — choose your term</p>
        <SegmentedControl
          label="Coaching term"
          value={String(months)}
          onValueChange={(value) => setMonths(Number(value) as Months)}
          segments={termOptions}
          className="max-w-xs"
        />
      </div>

      <div className="flex flex-col gap-5">
        <p className="t-eyebrow text-center text-ink-muted">
          Step 2 — choose how close the contact is
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {shown.map((pkg) => {
            const saving = termSaving(pkg);

            return (
              <div
                key={pkg.id}
                className={cn(
                  "flex flex-col gap-6 rounded-xl border bg-surface-raised p-6 transition-all duration-500 ease-entrance sm:p-8",
                  "hover:-translate-y-1 hover:shadow-lift",
                  pkg.recommended
                    ? "border-tan-500 shadow-soft"
                    : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="t-h3">{pkg.name}</h3>
                    <p className="font-mono text-xs tracking-[0.14em] text-ink-muted uppercase">
                      {pkg.termLabel} · {pkg.weeks} weeks
                    </p>
                  </div>

                  {pkg.recommended ? (
                    <span className="shrink-0 rounded-full bg-tan-500 px-3 py-1 font-mono text-[0.625rem] tracking-[0.12em] text-navy-800 uppercase">
                      Most contact
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-ink-muted">{pkg.tagline}</p>

                {/* The weekly rate is the headline, but the total commitment
                    is stated just as plainly right beneath it. */}
                <div className="flex flex-col gap-2 border-y border-line py-6">
                  <p className="flex items-baseline gap-2">
                    <span
                      data-numeric
                      className="font-display text-4xl leading-none text-ink"
                      style={{ fontVariationSettings: '"wdth" 110, "wght" 700' }}
                    >
                      {formatUsd(pkg.price.weekly)}
                    </span>
                    <span className="text-sm text-ink-muted">per week</span>
                  </p>

                  <p data-numeric className="text-sm text-ink-muted">
                    <span className="font-medium text-ink">
                      {formatUsd(pkg.price.total)}
                    </span>{" "}
                    total for {pkg.termLabel}
                  </p>

                  {saving ? (
                    <p
                      data-numeric
                      className="mt-1 w-fit rounded-full bg-tan-100 px-3 py-1 text-xs text-accent-text"
                    >
                      Saves {formatUsd(saving)} against the 3-month rate
                    </p>
                  ) : null}
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2.5 text-sm text-ink-muted"
                    >
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-tan-700"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="xl"
                  variant={pkg.recommended ? "accent" : "quiet"}
                  className="w-full"
                >
                  <Link href={`/apply?package=${pkg.id}`}>
                    Choose {pkg.name.split(" ")[0]}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
