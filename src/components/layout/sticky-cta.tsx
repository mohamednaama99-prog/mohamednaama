"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";

import { Button } from "@/components/ui/button";
import { stickyCta, whatsappLink } from "@/content/site";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/**
 * Mobile-only action bar, in the thumb zone, appearing once the hero has left
 * the viewport. Clears the home indicator via the safe-area inset.
 */
export function StickyCta() {
  const visible = useScrolled(560);
  const whatsapp = whatsappLink();

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl transition-all duration-500 ease-entrance lg:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="container-page flex items-center gap-3 pt-3">
        <Button asChild size="xl" variant="brand" className="flex-1">
          <Link href={stickyCta.href} tabIndex={visible ? 0 : -1}>
            {stickyCta.label}
            <ArrowRight />
          </Link>
        </Button>

        {whatsapp ? (
          <Button asChild size="xl" variant="quiet" className="px-5">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={visible ? 0 : -1}
              aria-label="Message Mohamed on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
