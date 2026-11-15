import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { media } from "@/content/media";
import { credentials, hero } from "@/content/site";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * `sizes` has to describe the width the image is *rendered* at, not the width
 * of the viewport. Under `object-cover` in a tall container those differ a
 * lot: at 375x715 the 4:5 crop renders ~572px wide, which is ~152vw. Claiming
 * 100vw is what made the browser pick a 750px file and upscale it ~2.9x.
 */
const MOBILE_SIZES = "160vw";
const DESKTOP_SIZES = "100vw";

/*
 * No `priority` and no `quality` here, both deliberate for Next 16:
 *
 * - `priority` is deprecated in favour of `preload`, and the docs say not to
 *   preload when more than one image could be the LCP element depending on
 *   the viewport — which is exactly an art-directed <picture>. Preloading
 *   would fetch the wrong crop. `loading="eager"` + `fetchPriority="high"` on
 *   the <img> is the documented alternative, and is set below.
 * - `images.qualities` now defaults to [75], so a quality of 80 is silently
 *   coerced back to 75. Asking for it only made the intent misleading.
 */
const shared = {
  alt: media.heroWide.alt,
};

const {
  props: { srcSet: desktopSrcSet },
} = getImageProps({
  ...shared,
  src: media.heroWide.src,
  width: media.heroWide.width,
  height: media.heroWide.height,
  sizes: DESKTOP_SIZES,
});

const {
  props: { srcSet: mobileSrcSet, ...imgProps },
} = getImageProps({
  ...shared,
  src: media.heroTall.src,
  width: media.heroTall.width,
  height: media.heroTall.height,
  sizes: MOBILE_SIZES,
});

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-surface-deep pt-28 pb-14 text-ink-ondeep sm:pt-32 lg:min-h-[92svh] lg:items-center lg:pb-20"
    >
      {/*
        Art-directed background: a 4:5 crop below lg, the 3:2 crop from lg up.
        One <picture>, so exactly one file downloads. The section's min-height
        reserves the space, so nothing shifts when the image arrives, and this
        is the LCP element on both — `priority` rides along from getImageProps.

        object-position 50% 30% is correct for both crops at once: below lg
        cover scales by height, so only the horizontal value applies and 50%
        centres him; from lg up it scales by width, so only the vertical value
        applies and 30% keeps his face clear of the top edge.
      */}
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={desktopSrcSet}
          sizes={DESKTOP_SIZES}
        />
        <source srcSet={mobileSrcSet} sizes={MOBILE_SIZES} />
        <img
          {...imgProps}
          alt={media.heroWide.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_34%]"
        />
      </picture>

      {/*
        Navy veil, measured against the rendered page rather than estimated.
        Roughly 11:1 behind the headline at 1440 and 13:1 at 375 — both past
        the 4.5:1 AA threshold for body copy.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Lighter than the previous photograph needed: this frame is
            already dark and desaturated, so the old veil flattened it to
            near-black. Measured after re-tuning rather than guessed. */}
        <div className="absolute inset-0 bg-navy-900/25 lg:bg-navy-900/15" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-900/80 via-navy-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-navy-900 via-navy-900/45 to-transparent lg:h-2/3" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 96px)",
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="flex max-w-[34rem] flex-col gap-7 lg:max-w-[42rem] lg:gap-8">
          <p
            className="anim-in t-eyebrow flex items-center gap-3 text-mist-100/75"
            style={d(60)}
          >
            <span aria-hidden className="h-px w-8 bg-tan-500" />
            {hero.eyebrow}
          </p>

          <h1 className="t-display-xl text-mist-100">
            {hero.headline.map((line, i) => (
              <span key={line} className="anim-line-mask">
                <span
                  style={d(90 + i * 80)}
                  className={cn(i === hero.accentLine && "text-tan-500")}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="anim-in t-lede max-w-[46ch] text-mist-100/85"
            style={d(420)}
          >
            {hero.lede}
          </p>

          <div
            className="anim-in flex flex-col gap-3 sm:flex-row sm:items-center"
            style={d(510)}
          >
            <Button asChild size="xl" variant="accent">
              <Link href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowRight />
              </Link>
            </Button>

            <Button asChild size="xl" variant="onDeep">
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>

          <ul
            className="anim-in flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-mist-100/75"
            style={d(600)}
          >
            {credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-tan-500" />
                {credential}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
