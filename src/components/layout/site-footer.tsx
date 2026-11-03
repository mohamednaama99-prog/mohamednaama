import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/whatsapp";

import { Reveal } from "@/components/primitives/reveal";
import { credentials, nav, site, whatsappLink } from "@/content/site";

/* Cache Components treats `new Date()` as an unstable value during
   prerender. Caching it keeps the page fully static while letting the
   copyright year revalidate on its own. */
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const whatsapp = whatsappLink();
  const year = await currentYear();

  const socials = Object.entries(site.social).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return (
    <footer className="border-t border-line-deep bg-surface-deep text-ink-ondeep">
      {/* Extra bottom room on small screens so the sticky action bar never
          sits on top of the legal copy. */}
      <div className="container-page pt-16 pb-32 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <p
              className="font-display text-2xl text-mist-100"
              style={{ fontVariationSettings: '"wdth" 112, "wght" 700' }}
            >
              MOHAMED NAAMA
            </p>
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
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-4">
            <h2 className="t-eyebrow text-ink-ondeep-muted">Explore</h2>
            <ul className="flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mist-100/85 transition-colors hover:text-tan-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className="flex flex-col gap-4">
            <h2 className="t-eyebrow text-ink-ondeep-muted">Get in touch</h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="#apply"
                  className="text-mist-100/85 transition-colors hover:text-tan-500"
                >
                  Apply for coaching
                </Link>
              </li>

              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-mist-100/85 transition-colors hover:text-tan-500"
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
                    className="text-mist-100/85 transition-colors hover:text-tan-500"
                  >
                    {site.email}
                  </a>
                </li>
              ) : null}

              {socials.map(([key, href]) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mist-100/85 capitalize transition-colors hover:text-tan-500"
                  >
                    {key}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-deep pt-8 text-xs text-ink-ondeep-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          {/* TODO(client): privacy policy, terms, and a health disclaimer —
              the disclaimer is not optional for coaching. */}
          <p className="max-w-[52ch]">
            Coaching is not medical advice. Consult a qualified professional
            before beginning any new training or nutrition programme.
          </p>
        </div>
      </div>
    </footer>
  );
}
