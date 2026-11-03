import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { Eyebrow } from "@/components/primitives/section";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Opening band for the supporting pages.
 *
 * Same navy ground, drifting washes, masked headline reveal and type scale as
 * the landing page hero, so About and Contact read as part of the site rather
 * than as separate documents. Narrower than the landing hero because these
 * pages lead with words, not a portrait.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  /** Each entry is one masked line of the headline. */
  title: string[];
  lede?: string;
  /** Actions or detail rendered under the lede. */
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-deep pt-28 pb-16 text-ink-ondeep sm:pt-32 lg:pt-36 lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="anim-drift absolute -top-1/2 -left-1/4 h-[70vh] w-[70vh] rounded-full bg-navy-700/45 blur-[120px]" />
        <div className="anim-drift-slow absolute right-[-10%] bottom-[-40%] h-[55vh] w-[55vh] rounded-full bg-tan-500/12 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 96px)",
          }}
        />
      </div>

      <div className="container-page flex flex-col gap-7">
        <Link
          href="/"
          className="anim-in inline-flex w-fit cursor-pointer items-center gap-2 text-sm text-ink-ondeep-muted transition-colors hover:text-mist-100"
          style={d(40)}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to the site
        </Link>

        <div className="anim-in" style={d(90)}>
          <Eyebrow tone="deep">{eyebrow}</Eyebrow>
        </div>

        <h1 className="t-display-xl max-w-[20ch] text-mist-100">
          {title.map((line, i) => (
            <span key={line} className="anim-line-mask">
              <span style={d(150 + i * 80)}>{line}</span>
            </span>
          ))}
        </h1>

        {lede ? (
          <p
            className="anim-in t-lede max-w-[54ch] text-ink-ondeep-muted"
            style={d(430)}
          >
            {lede}
          </p>
        ) : null}

        {children ? (
          <div className="anim-in" style={d(520)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
