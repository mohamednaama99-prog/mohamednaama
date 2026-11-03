import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";

import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/content/site";

/**
 * Closing CTA. The full form lives at /apply — this section's job is to send
 * people there, not to carry a long form at the bottom of the page.
 */
export function FinalCta() {
  const whatsapp = whatsappLink(
    "Hi Mohamed, I'd like to ask about your online coaching.",
  );

  return (
    <section
      id="start"
      className="section-y relative isolate overflow-hidden bg-surface-deep text-ink-ondeep"
    >
      {/* The same drifting wash as the hero, closing the page where it opened. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="anim-drift absolute -top-1/4 right-[-15%] h-[70vh] w-[70vh] rounded-full bg-navy-700/40 blur-[130px]" />
        <div className="anim-drift-slow absolute bottom-[-30%] left-[-10%] h-[55vh] w-[55vh] rounded-full bg-tan-500/12 blur-[130px]" />
      </div>

      <div className="container-page flex flex-col items-center gap-7 text-center">
        <Reveal>
          <Eyebrow tone="deep">Start</Eyebrow>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="t-display-l max-w-[18ch] text-mist-100">
            Tell Mohamed about your training.
          </h2>
        </Reveal>

        <Reveal delay={170}>
          <p className="t-lede max-w-[48ch] text-ink-ondeep-muted">
            One short application, whether you have picked a plan or just want
            to ask a question. No payment and no booking — Mohamed picks the
            conversation up on WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" variant="accent">
              <Link href="/apply">
                Apply for coaching
                <ArrowRight />
              </Link>
            </Button>

            {whatsapp ? (
              <Button asChild size="xl" variant="onDeep">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  Message on WhatsApp
                </a>
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
