import Link from "next/link";

import { LogoMark } from "@/components/brand/logo-mark";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Mark plus wordmark, used in the header, the mobile menu and the footer so
 * the brand reads identically everywhere.
 *
 * `asLink` is off for the footer, where the lockup is not a navigation target.
 */
export function BrandLockup({
  tone = "light",
  size = "default",
  asLink = true,
  showWordmark = true,
  onNavigate,
  className,
}: {
  /** "deep" for navy surfaces, "light" for the off-white page. */
  tone?: "light" | "deep";
  size?: "default" | "lg";
  asLink?: boolean;
  /** The header shows the mark alone; the footer keeps the full lockup. */
  showWordmark?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const content = (
    <>
      <LogoMark
        className={cn(
          "shrink-0 transition-transform duration-300 ease-entrance group-hover/mark:-translate-y-px",
          size === "lg" ? "size-9" : "size-7",
        )}
      />
      {showWordmark ? (
        <span
          className={cn(
            /* nowrap: at 320px the wordmark would otherwise break across two
               lines and push the header out of alignment. */
            "font-display leading-none tracking-tight whitespace-nowrap",
            size === "lg"
              ? "text-lg sm:text-xl"
              : "text-[0.9375rem] sm:text-[1.0625rem]",
          )}
          style={{ fontVariationSettings: '"wdth" 112, "wght" 700' }}
        >
          MOHAMED NAAMA
        </span>
      ) : (
        <span className="sr-only">{site.name}</span>
      )}
    </>
  );

  const classes = cn(
    "group/mark flex items-center",
    showWordmark && "gap-2.5",
    tone === "deep" ? "text-mist-100" : "text-ink",
    className,
  );

  if (!asLink) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(classes, "cursor-pointer")}
      aria-label={`${site.name} — home`}
    >
      {content}
    </Link>
  );
}
