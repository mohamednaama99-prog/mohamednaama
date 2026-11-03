import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { media } from "@/content/media";
import { credentials, hero } from "@/content/site";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const portrait = media.heroPortrait;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex flex-col overflow-hidden bg-surface-deep text-ink-ondeep"
    >
      {/* Atmosphere: two very slow drifting washes behind everything.
          Barely perceptible by design — the movement should register, not perform. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="anim-drift absolute -top-1/3 -left-1/4 h-[80vh] w-[80vh] rounded-full bg-navy-700/45 blur-[120px]" />
        <div className="anim-drift-slow absolute right-1/4 bottom-[-35%] h-[60vh] w-[60vh] rounded-full bg-tan-500/12 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 96px)",
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="flex flex-col gap-7 pt-28 pb-12 sm:pt-32 lg:min-h-[92svh] lg:w-[54%] lg:justify-center lg:gap-8 lg:py-32 lg:pr-12">
          <p
            className="anim-in t-eyebrow flex items-center gap-3 text-ink-ondeep-muted"
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
            className="anim-in t-lede max-w-[46ch] text-ink-ondeep-muted"
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
            className="anim-in flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-ink-ondeep-muted"
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

      {/*
        The portrait.

        One element, positioned two ways: in flow beneath the content on
        phones, and anchored to the right edge of the section from `lg` up.
        Rendering it once keeps a single image download — a second hidden
        <Image> would be fetched too.

        It is blended into the composition rather than framed: a navy tint
        pulls the photograph into the palette, and gradients dissolve its
        left and bottom edges into the section so there is no card and no
        visible boundary.
      */}
      <div
        className="anim-media relative h-[46vh] min-h-[300px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[44%]"
        style={d(240)}
      >
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover object-[center_26%] grayscale brightness-[1.28] contrast-[1.12] lg:object-[center_30%]"
        />

        {/* Duotone. Multiplying navy over a desaturated frame drops the
            highlights to the brand navy and the shadows to near-black; a thin
            tan screen puts warmth back into the midtones. The photograph ends
            up built from the palette rather than merely sitting on it. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-navy-800 opacity-[0.62] mix-blend-multiply"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-tan-500 opacity-[0.18] mix-blend-screen"
        />

        {/* Edge dissolves. Vertical on phones, horizontal on desktop. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-navy-900 via-transparent to-navy-900 lg:bg-linear-to-r lg:from-navy-900 lg:via-transparent lg:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-navy-900 to-transparent"
        />

        {/* A single tan hairline where the image meets the text column. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-px bg-linear-to-b from-transparent via-tan-500/45 to-transparent lg:block"
        />

      </div>
    </section>
  );
}
