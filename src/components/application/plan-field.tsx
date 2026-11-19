"use client";

import { useState } from "react";

import { SegmentedControl } from "@/components/primitives/segmented-control";
import { cadenceSegments, GENERAL_ENQUIRY, planCopy } from "@/content/form";
import {
  findPackage,
  formatUsd,
  getPackage,
  termOptions,
  type Cadence,
  type Months,
} from "@/content/packages";

const display = { fontVariationSettings: '"wdth" 110, "wght" 680' };

/**
 * The plan, chosen with the same two controls as the pricing section — term,
 * then contact frequency — so nothing is asked twice in two different shapes.
 * A pricing card's `?package=` arrives here preselected.
 */
export function PlanField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (packageId: string) => void;
  error?: string;
}) {
  const chosen = value === GENERAL_ENQUIRY ? undefined : getPackage(value);

  /* The term is remembered even while "Not sure" is selected, so switching
     back to Weekly or Daily lands on the term chosen before. */
  const [months, setMonths] = useState<Months>(chosen?.months ?? 3);
  const cadence = chosen?.cadence ?? GENERAL_ENQUIRY;

  const select = (nextCadence: string, nextMonths: Months) => {
    if (nextCadence === GENERAL_ENQUIRY) return onChange(GENERAL_ENQUIRY);
    onChange(findPackage(nextCadence as Cadence, nextMonths)?.id ?? GENERAL_ENQUIRY);
  };

  return (
    <fieldset className="min-w-0 rounded-xl border border-line bg-surface-sunken p-3 sm:p-6">
      <legend className="px-1 text-[0.9375rem] font-medium text-ink">{label}</legend>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <span className="t-eyebrow text-ink-muted">{planCopy.termLabel}</span>
          <SegmentedControl
            label={planCopy.termGroupLabel}
            value={String(chosen?.months ?? months)}
            onValueChange={(next) => {
              const nextMonths = Number(next) as Months;
              setMonths(nextMonths);
              select(cadence, nextMonths);
            }}
            segments={termOptions}
            size="touch"
          />
        </div>

        <div className="flex flex-col gap-2.5 border-t border-line pt-5">
          <h3 className="font-display text-base text-ink">{planCopy.contactHeading}</h3>
          <p className="max-w-[58ch] text-sm text-ink-muted">{planCopy.contactHelp}</p>
          <SegmentedControl
            label={planCopy.contactHeading}
            value={cadence}
            onValueChange={(next) => select(next, chosen?.months ?? months)}
            segments={cadenceSegments}
            size="touch"
            className="mt-1"
          />
        </div>

        {/* Says back what the two choices add up to. */}
        <div
          aria-live="polite"
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 rounded-lg border border-line bg-surface-raised px-4 py-4"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="t-eyebrow text-ink-muted">{planCopy.selectedLabel}</span>
            <span className="font-display text-lg leading-tight text-ink" style={display}>
              {chosen ? chosen.name : planCopy.generalTitle}
            </span>
            <span data-numeric className="text-sm text-ink-muted">
              {chosen
                ? `${chosen.termLabel} · ${chosen.weeks} ${planCopy.weeks}`
                : planCopy.generalBody}
            </span>
          </div>

          {chosen ? (
            <div className="flex flex-col items-start gap-0.5 sm:items-end">
              <span
                data-numeric
                className="font-display text-2xl leading-none text-ink"
                style={{ fontVariationSettings: '"wdth" 110, "wght" 700' }}
              >
                {formatUsd(chosen.price.weekly)}
              </span>
              <span className="text-xs text-ink-muted">{planCopy.perWeek}</span>
              <span data-numeric className="text-sm text-ink-muted">
                {formatUsd(chosen.price.total)} {planCopy.total}
              </span>
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      </div>
    </fieldset>
  );
}
