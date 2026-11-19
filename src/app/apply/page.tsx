import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Eyebrow } from "@/components/primitives/section";
import { ApplicationForm } from "@/components/application/application-form";
import { formCopy } from "@/content/form";
import { getPackage } from "@/content/packages";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.apply.title,
  description: seo.apply.description,
  alternates: { canonical: "/apply" },
  /* A form page has nothing to offer search; the landing page carries the SEO. */
  robots: { index: false, follow: true },
};

/**
 * Reads `?package=` and preselects that plan.
 *
 * Search params make a route request-time, so this lives inside its own
 * Suspense boundary — the page shell around it stays prerendered.
 */
async function PreselectedForm({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const requested = typeof params.package === "string" ? params.package : "";
  /* An unknown or malformed value simply falls back to no preselection. */
  const preselected = getPackage(requested)?.id ?? null;

  return <ApplicationForm initialPackageId={preselected} />;
}

function FormFallback() {
  return (
    <div className="flex flex-col gap-8" aria-hidden>
      <div className="flex flex-col gap-4">
        <div className="h-1.5 animate-pulse rounded-full bg-surface-sunken" />
        <div className="h-12 w-1/2 animate-pulse rounded-md bg-surface-sunken" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-md bg-surface-sunken" />
      ))}
    </div>
  );
}

export default function ApplyPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="main" className="flex-1 bg-surface pt-24 pb-24 sm:pt-28">
        <div className="container-page">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to the site
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>{formCopy.eyebrow}</Eyebrow>
              <div className="flex flex-col gap-3">
                <h1 className="t-display-l max-w-[14ch]">{formCopy.title}</h1>
                <p className="font-display text-lg text-accent-text sm:text-xl">
                  {formCopy.subtitle}
                </p>
              </div>
              <p className="t-lede max-w-[44ch] text-ink-muted">
                {formCopy.lede}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-line bg-surface-raised p-5 sm:p-9">
                <Suspense fallback={<FormFallback />}>
                  <PreselectedForm searchParams={props.searchParams} />
                </Suspense>
              </div>

            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
