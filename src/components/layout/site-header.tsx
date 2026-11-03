"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { SocialLinks } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  legalNav,
  mobileNav,
  nav,
  stickyCta,
  whatsappLink,
} from "@/content/site";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/**
 * `overlay` sits transparently on the landing page's dark hero and turns solid
 * on scroll. `solid` is for pages that open on a light surface.
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
        {/* Mark only. The wordmark stays available on the lockup for the
            footer and anywhere else the full name is wanted. */}
        <BrandLockup
          tone={onDeep ? "deep" : "light"}
          showWordmark={false}
          className="shrink-0"
        />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex xl:gap-8"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative cursor-pointer text-sm whitespace-nowrap transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-tan-500 after:transition-all after:duration-300 after:ease-entrance hover:after:w-full",
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
                disappears on the navy panel. Ours is a 44px target. */}
            <SheetContent
              side="right"
              showCloseButton={false}
              className="border-line-deep bg-navy-900 data-[side=right]:w-full sm:data-[side=right]:max-w-sm"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-line-deep px-5 py-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <BrandLockup tone="deep" showWordmark={false} />

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

              {/* Scrolls only when the list genuinely outgrows the screen. */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <nav aria-label="Mobile" className="flex flex-col gap-7">
                  <ul className="flex flex-col">
                    {mobileNav.map((item, i) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="anim-in flex min-h-12 cursor-pointer items-center border-b border-line-deep/60 font-display text-xl text-mist-100 transition-colors hover:text-tan-500"
                            style={
                              { "--d": `${60 + i * 45}ms` } as CSSProperties
                            }
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3">
                    <h2 className="t-eyebrow text-ink-ondeep-muted">Legal</h2>
                    <ul className="flex flex-col gap-2.5">
                      {legalNav.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="cursor-pointer text-sm text-mist-100/70 transition-colors hover:text-tan-500"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h2 className="t-eyebrow text-ink-ondeep-muted">Follow</h2>
                    <SocialLinks tone="deep" />
                  </div>
                </nav>
              </div>

              <div className="flex shrink-0 flex-col gap-3 border-t border-line-deep px-5 pt-4 pb-7">
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
