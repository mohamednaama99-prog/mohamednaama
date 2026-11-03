import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Eyebrow } from "@/components/primitives/section";

/**
 * Shared chrome for the supporting pages, so About, Contact and the three
 * policy documents sit on the same grid and type scale as the landing page
 * instead of each inventing a layout.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Small line under the title — a "last updated" date, for example. */
  meta?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="main" className="flex-1 bg-surface pt-24 pb-24 sm:pt-28">
        <div className="container-page">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to the site
          </Link>

          <header className="mt-10 flex flex-col gap-5 border-b border-line pb-10">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="t-display-l max-w-[18ch]">{title}</h1>
            {lede ? (
              <p className="t-lede max-w-[62ch] text-ink-muted">{lede}</p>
            ) : null}
            {meta ? (
              <p className="font-mono text-xs tracking-[0.12em] text-ink-muted uppercase">
                {meta}
              </p>
            ) : null}
          </header>

          <div className="mt-12">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
