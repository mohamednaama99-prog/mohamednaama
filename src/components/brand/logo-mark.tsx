import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * The MN monogram.
 *
 * An M and an N sharing one upright, drawn as a single continuous geometry:
 * the M's right leg is the N's left leg. That ligature keeps the mark narrow
 * enough to stay legible at favicon sizes, and the one tan stroke — the N's
 * diagonal — is the only colour, so the mark reads as a rising line rather
 * than as decoration.
 *
 * Strokes use `currentColor`, so it sits on navy and on off-white without a
 * second asset. The matching favicon lives at `src/app/icon.svg` and must be
 * kept in sync by hand if this geometry changes.
 */
export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-7", className)}
      {...props}
    >
      {/* M, ending on the upright it shares with the N */}
      <path d="M6 24V10l6 8 6-8v14" />
      {/* the N's diagonal — the single accent stroke */}
      <path d="M18 10l8 14" className="stroke-tan-500" />
      {/* the N's right upright */}
      <path d="M26 24V10" />
    </svg>
  );
}
