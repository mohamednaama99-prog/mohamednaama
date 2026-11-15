import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { SocialLinks } from "@/components/layout/social-links";
import { Reveal } from "@/components/primitives/reveal";
import {
  credentials,
  legalNav,
  nav,
  site,
  whatsappLink,
} from "@/content/site";

/* Cache Components treats `new Date()` as an unstable value during
   prerender. Caching it keeps the page fully static while letting the
   copyright year revalidate on its own. */
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="cursor-pointer text-sm text-mist-100/85 transition-colors hover:text-tan-500"
    >
      {children}
    </Link>
  );
}

export async function SiteFooter() {
  const whatsapp = whatsappLink();
  const year = await currentYear();

  return (
    <footer className="border-t border-line-deep bg-surface-deep text-ink-ondeep">
      <div className="container-page pt-16 pb-32 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <BrandLockup tone="deep" size="lg" asLink={false} />

            <p className="max-w-[38ch] text-sm text-ink-ondeep-muted">
              {site.role}. Daily and weekly online coaching, built around the
              week you actually have.
            </p>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-ondeep-muted">
              {credentials.map((credential) => (
                <li key={credential} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-tan-500" />
                  {credential}
                </li>
              ))}
            </ul>

            <SocialLinks tone="deep" className="pt-1" />
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-4">
            <h2 className="t-eyebrow text-ink-ondeep-muted">Explore</h2>
            <ul className="flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className="flex flex-col gap-4">
            <h2 className="t-eyebrow text-ink-ondeep-muted">Get in touch</h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <FooterLink href="/apply">Apply for coaching</FooterLink>
              </li>

              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-mist-100/85 transition-colors hover:text-tan-500"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp
                  </a>
                </li>
              ) : null}

              {site.email ? (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="cursor-pointer text-sm text-mist-100/85 transition-colors hover:text-tan-500"
                  >
                    {site.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line-deep pt-8 text-xs text-ink-ondeep-muted">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="cursor-pointer transition-colors hover:text-tan-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p>
              &copy; {year} {site.name}. All rights reserved.
            </p>
            <p className="max-w-[52ch]">
              Coaching is not medical advice. Consult a qualified professional
              before beginning any new training or nutrition programme.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
