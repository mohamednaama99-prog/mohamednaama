import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import type { ReactNode } from "react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { PageHero } from "@/components/layout/page-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SocialLinks } from "@/components/layout/social-links";
import { Reveal } from "@/components/primitives/reveal";
import { Section, SectionHeading } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { site, whatsappDisplayNumber, whatsappLink } from "@/content/site";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.contact.title,
  description: seo.contact.description,
  alternates: { canonical: "/contact" },
};

/**
 * An email address is one unbreakable word, wider than a card on a phone.
 * This gives it a single break point, before the "@", so a narrow card shows
 * the name and the domain on two clean lines instead of overflowing.
 */
function breakableEmail(address: string): ReactNode {
  const at = address.indexOf("@");
  if (at <= 0) return address;
  return (
    <>
      {address.slice(0, at)}
      <wbr />
      {address.slice(at)}
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  hint,
  href,
  external,
  delay,
  featured,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint: string;
  href: string;
  external?: boolean;
  delay: number;
  featured?: boolean;
}) {
  return (
    /* min-w-0: a grid item is otherwise at least as wide as its longest
       word, which is what pushed the cards off the screen. */
    <Reveal delay={delay} className="min-w-0">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`group/card flex h-full cursor-pointer flex-col gap-5 rounded-xl border bg-surface-raised p-6 transition-all duration-500 ease-entrance hover:-translate-y-1 hover:shadow-lift sm:p-8 ${
          featured ? "border-tan-500 shadow-soft" : "border-line hover:border-tan-500"
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-tan-100 text-accent-text">
          {icon}
        </span>

        <div className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink-muted">{label}</span>
          <span
            data-numeric
            className="font-display text-xl leading-tight text-ink wrap-anywhere"
            style={{ fontVariationSettings: '"wdth" 110, "wght" 680' }}
          >
            {value}
          </span>
          <span className="text-sm text-ink-muted">{hint}</span>
        </div>

        <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-accent-text">
          Open
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-300 ease-entrance group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          />
        </span>
      </a>
    </Reveal>
  );
}

export default function ContactPage() {
  const whatsapp = whatsappLink(
    "Hi Mohamed, I'd like to ask about your online coaching.",
  );
  const number = whatsappDisplayNumber();

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="main" className="flex-1">
        <PageHero
          eyebrow="Contact"
          title={["Talk to Mohamed", "directly."]}
          lede="Message him on WhatsApp or by email. If you would rather set out your training first, the application form gives him the full picture before you speak."
        />

        <Section tone="base">
          <SectionHeading
            eyebrow="Get in touch"
            title="Two ways to message him."
            lede="Both go to Mohamed himself — there is no assistant and no ticket queue."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:max-w-4xl">
            {whatsapp ? (
              <ContactCard
                icon={<WhatsAppIcon className="size-5" />}
                label="WhatsApp"
                value={number ?? "Message on WhatsApp"}
                hint="Usually the quickest reply."
                href={whatsapp}
                external
                featured
                delay={0}
              />
            ) : null}

            {/* Rendered only when an address is configured in
                src/content/site.ts. */}
            {site.email ? (
              <ContactCard
                icon={<Mail aria-hidden className="size-5" />}
                label="Email"
                value={breakableEmail(site.email)}
                hint="For anything longer."
                href={`mailto:${site.email}`}
                delay={90}
              />
            ) : null}
          </div>
        </Section>

        <Section tone="warm">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <SectionHeading
                eyebrow="Applying for coaching?"
                title="Start with the application instead."
                lede="It asks about your goal, your experience and the days you can train, so the first conversation starts from something useful. It takes a couple of minutes and takes no payment."
              />
              <Reveal delay={240}>
                <Button asChild size="xl" variant="brand">
                  <Link href="/apply">Apply for coaching</Link>
                </Button>
              </Reveal>
            </div>

            <Reveal
              delay={120}
              className="flex flex-col gap-4 rounded-xl border border-tan-500/40 bg-surface-raised p-7 sm:p-8"
            >
              <h3 className="t-h3">Follow along</h3>
              <p className="text-sm text-ink-muted">
                Follow Mohamed on Instagram.
              </p>
              <SocialLinks tone="light" className="pt-1" />
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
