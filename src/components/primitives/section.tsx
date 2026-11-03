import type { ReactNode } from "react";

import { Reveal } from "@/components/primitives/reveal";
import { cn } from "@/lib/utils";

/** The band backgrounds that give the scroll its rhythm. */
const tones = {
  base: "bg-surface text-ink",
  raised: "bg-surface-raised text-ink",
  sunken: "bg-surface-sunken text-ink",
  warm: "bg-surface-warm text-ink",
  deep: "bg-surface-deep text-ink-ondeep",
} as const;

export type SectionTone = keyof typeof tones;

export function Section({
  id,
  tone = "base",
  className,
  containerClassName,
  wide = false,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("section-y", tones[tone], className)}>
      <div className={cn(wide ? "container-wide" : "container-page", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "deep";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "t-eyebrow flex items-center gap-3",
        tone === "deep" ? "text-ink-ondeep-muted" : "text-ink-muted",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent-fill" />
      {children}
    </p>
  );
}

/**
 * Standard section opener: eyebrow, heading, optional lede.
 * Revealed as one staggered group.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "deep";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal delay={eyebrow ? 90 : 0}>
        <h2 className={cn("t-display-l max-w-[18ch]", align === "center" && "mx-auto")}>
          {title}
        </h2>
      </Reveal>

      {lede ? (
        <Reveal delay={eyebrow ? 180 : 90}>
          <p
            className={cn(
              "t-lede max-w-[58ch]",
              tone === "deep" ? "text-ink-ondeep-muted" : "text-ink-muted",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
