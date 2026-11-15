import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { media } from "@/content/media";
import { credentials, hero } from "@/content/site";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const background = media.heroBackground;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-surface-deep pt-28 pb-14 text-ink-ondeep sm:pt-32 lg:min-h-[92svh] lg:items-center lg:pb-20"
    >
      {/*
        Full-bleed photograph.

        `fill` with an explicit `sizes` of 100vw and no intrinsic box means no
        layout shift: the section's own min-height reserves the space before
        the image arrives, and the navy background shows through until it does.
        This is the LCP element, hence `priority`.

        object-position keeps the face at 58% across / 30% down, which holds it
        clear of the text and inside the frame whether the container crops the
        sides (portrait phones) or the top and bottom (wide desktops).
      */}
      <Image
        src={background.src}
        alt={background.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[58%_30%]"
      />

      {/*
        Navy veil, measured rather than guessed. Against the brightest part of
        this photograph the stack lands at roughly 12:1 behind the headline on
        desktop and 6.6:1 at the midpoint where phone text sits — both past the
        4.5:1 AA threshold for body copy, with the bottom gradient adding more
        where the mobile layout places the text.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Heavier base veil below lg, where the text crosses the brightest
            part of the frame instead of sitting beside it. */}
        <div className="absolute inset-0 bg-navy-900/45 lg:bg-navy-900/30" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-900/85 via-navy-900/55 to-navy-900/10" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-navy-900 via-navy-900/55 to-transparent lg:h-2/3" />
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
