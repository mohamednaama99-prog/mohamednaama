import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { SocialIcon } from "@/components/icons/social";
import { Button } from "@/components/ui/button";
import { media } from "@/content/media";
import { credentials, hero, site, socialHandle } from "@/content/site";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const instagram = socialHandle("instagram");

/**
 * `sizes` has to describe the width the image is *rendered* at, not the width
 * of the viewport. Below `lg` the tall crop is shown at exactly the screen
 * width. From `lg` up the 4:3 crop fills a box 60% of the viewport wide but is
 * scaled by its height under `object-cover`, so it renders at roughly
 * 70–92vw.
 */
const MOBILE_SIZES = "100vw";
const DESKTOP_SIZES = "92vw";

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
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-surface-deep pt-[64vw] pb-14 text-ink-ondeep lg:min-h-[92svh] lg:items-center lg:pt-32 lg:pb-20"
    >
      {/*
        Art-directed: a tall crop below lg, a 4:3 crop from lg up. One
        <picture>, so exactly one file downloads. The image is absolutely
        positioned and sized from its width/height attributes, so nothing
        shifts when it arrives.

        The coach sits opposite the headline at every width:
        - Below lg the photo spans the screen width at its natural aspect, so
          the coach fills the width at the top. His hands land at 60.5% of the
          image width, which is why the text band starts at 64vw: the eyebrow
          sits just under his hands and never over him. The photo's foot
          fades into the section navy behind the text; the fade is steeper
          from sm up because the text there sits higher on a taller image.
          Both stops were tuned against measured contrast, not by eye.
        - From lg up the photo fills the right 60% of the section and is
          scaled by its height, so he is as large as the frame allows without
          cropping a hand. Its left edge dissolves into the navy the headline
          sits on.
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
          className="absolute inset-x-0 top-0 -z-10 h-auto w-full [mask-image:linear-gradient(to_bottom,#000_38%,transparent_64%)] sm:[mask-image:linear-gradient(to_bottom,#000_36%,transparent_52%)] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-3/5 lg:object-cover lg:object-[55%_50%] lg:[mask-image:none]"
        />
      </picture>

      {/*
        Navy veil. Measured on the rendered page (worst pixel behind each line
        of text), not estimated — the figures are recorded in
        public/images/README.md.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Cools the gray pavement toward the palette. */}
        <div className="absolute inset-0 bg-navy-900/30 lg:left-2/5" />
        {/* Header legibility: the transparent header sits on the photo. */}
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-navy-900/80 to-transparent lg:left-2/5 lg:h-44" />
        {/* From lg: the photo's left edge dissolves into the section navy,
            and its foot blends into the band. */}
        <div className="absolute inset-y-0 left-2/5 hidden w-1/4 bg-linear-to-r from-navy-900 via-navy-900/70 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-linear-to-t from-navy-900 to-transparent lg:block" />
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

          {/*
            The three items need ~410px in a row; a phone has ~280–355px. A row
            that wraps leaves one item stranded on a second line, so below sm
            they stack as a short list instead, and from sm up they sit in one
            row. Every item leads with a marker in the same 14px slot — a dot,
            or the Instagram icon — so the labels line up when stacked.
          */}
          <ul
            className="anim-in flex flex-col items-start gap-y-2 pt-1 text-xs text-mist-100/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5"
            style={d(600)}
          >
            {credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-1.5">
                <span aria-hidden className="flex w-3.5 shrink-0 justify-center">
                  <span className="size-1 rounded-full bg-tan-500" />
                </span>
                {credential}
              </li>
            ))}
            {/* Same type and color as the credentials, so it reads as part of
                the list rather than a third call to action. -my-1/py-1 lift
                the tap target to 24px without changing the spacing. */}
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on Instagram, ${instagram} (opens in a new tab)`}
                className="-my-1 flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors hover:text-mist-100"
              >
                <SocialIcon
                  platform="instagram"
                  className="size-3.5 shrink-0 text-tan-500"
                />
                {instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
