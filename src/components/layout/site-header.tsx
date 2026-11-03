"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { nav, site, stickyCta, whatsappLink } from "@/content/site";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

function Wordmark({ onDeep }: { onDeep: boolean }) {
  return (
    <Link
      href="/"
      className="group/mark flex cursor-pointer items-baseline gap-2"
      aria-label={`${site.name} — home`}
    >
      <span
        className={cn(
          "font-display text-[1.0625rem] tracking-tight transition-colors",
          onDeep ? "text-mist-100" : "text-ink",
        )}
        style={{ fontVariationSettings: '"wdth" 112, "wght" 700' }}
      >
        MOHAMED NAAMA
      </span>
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-tan-500 transition-transform duration-300 ease-entrance group-hover/mark:scale-125"
      />
    </Link>
  );
}

/**
 * `overlay` sits transparently on the landing page's dark hero and turns solid
 * on scroll. `solid` is for pages that open on a light surface, such as /apply.
 */
export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const scrolled = useScrolled(32);
  const pathname = usePathname();
  const whatsapp = whatsappLink();

  /* The menu remembers which route it was opened on, so a route change closes
     it by derivation rather than through an effect — including a back or
     forward navigation that no menu link triggered. */
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath !== null && openPath === pathname;
  const setOpen = (next: boolean) => setOpenPath(next ? pathname : null);

  const solid = variant === "solid" || scrolled;
  const onDeep = !solid;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-entrance",
        solid
          ? "border-b border-line bg-surface/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 sm:h-20">
        <Wordmark onDeep={onDeep} />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative cursor-pointer text-sm transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-tan-500 after:transition-all after:duration-300 after:ease-entrance hover:after:w-full",
                onDeep
                  ? "text-mist-100/80 hover:text-mist-100"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="pill"
            variant={onDeep ? "accent" : "brand"}
            className="hidden sm:inline-flex"
          >
            <Link href={stickyCta.href}>{stickyCta.label}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon-lg"
                variant={onDeep ? "onDeep" : "quiet"}
                className="size-11 rounded-full lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            {/* The built-in close is a 28px ghost button, which all but
                disappears on the navy panel. Ours is a 44px target with a
                visible border. */}
            <SheetContent
              side="right"
              showCloseButton={false}
              className="border-line-deep bg-navy-900 data-[side=right]:w-full sm:data-[side=right]:max-w-sm"
            >
              <div className="flex items-center justify-between border-b border-line-deep px-4 py-4">
                <SheetTitle className="font-display text-mist-100">Menu</SheetTitle>

                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-deep text-mist-100 transition-colors hover:border-tan-500 hover:text-tan-500"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </SheetClose>
              </div>

              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col gap-1 px-4 py-6"
              >
                {nav.map((item, i) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="anim-in flex min-h-12 cursor-pointer items-center border-b border-line-deep/60 font-display text-2xl text-mist-100 transition-colors hover:text-tan-500"
                      style={{ "--d": `${80 + i * 60}ms` } as CSSProperties}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="flex flex-col gap-3 px-4 pb-8">
                <SheetClose asChild>
                  <Button asChild size="xl" variant="accent" className="w-full">
                    <Link href={stickyCta.href}>{stickyCta.label}</Link>
                  </Button>
                </SheetClose>

                {whatsapp ? (
                  <Button asChild size="xl" variant="onDeep" className="w-full">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
