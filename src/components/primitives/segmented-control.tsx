"use client";

import { RadioGroup } from "radix-ui";

import { cn } from "@/lib/utils";

export type Segment = { value: string; label: string; sublabel?: string };

/**
 * A compact segmented control.
 *
 * Built on Radix's RadioGroup primitive rather than a row of buttons, so it
 * keeps real radio semantics: one tab stop, arrow-key navigation between
 * options, and a correct accessible name and state for screen readers.
 */
export function SegmentedControl({
  name,
  value,
  onValueChange,
  segments,
  label,
  size = "default",
  className,
}: {
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  segments: readonly Segment[];
  /** Accessible name for the whole group. */
  label: string;
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <RadioGroup.Root
      name={name}
      value={value}
      onValueChange={onValueChange}
      aria-label={label}
      className={cn(
        "inline-flex w-full rounded-full border border-line bg-surface-sunken p-1",
        className,
      )}
    >
      {segments.map((segment) => (
        <RadioGroup.Item
          key={segment.value}
          value={segment.value}
          className={cn(
            "min-w-0 flex-1 cursor-pointer truncate rounded-full text-center font-medium transition-all duration-300 ease-entrance outline-none",
            "text-ink-muted hover:text-ink",
            "focus-visible:ring-2 focus-visible:ring-tan-500 focus-visible:ring-offset-1",
            "data-[state=checked]:bg-navy-800 data-[state=checked]:text-mist-100 data-[state=checked]:shadow-soft",
            size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
          )}
        >
          <span className="block">{segment.label}</span>
          {segment.sublabel ? (
            <span className="block text-[0.6875rem] opacity-70">
              {segment.sublabel}
            </span>
          ) : null}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
