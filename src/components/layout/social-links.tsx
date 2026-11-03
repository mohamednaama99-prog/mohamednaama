import { SocialIcon, socialLabels } from "@/components/icons/social";
import { socialEntries } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The three social marks, shown whether or not a profile URL exists yet.
 *
 * A platform with a URL renders as a link. One without renders as a plain
 * element with no href, no pointer cursor and no hover state — visibly present
 * but obviously not yet clickable, which is honest. Nothing ever points at a
 * platform home page. Add the real URLs to `site.social` and each icon becomes
 * a link with no component change.
 */
export function SocialLinks({
  tone = "deep",
  className,
}: {
  tone?: "light" | "deep";
  className?: string;
}) {
  const entries = socialEntries();

  const base =
    "flex size-10 items-center justify-center rounded-full border transition-colors";

  const active =
    tone === "deep"
      ? "border-line-deep text-mist-100/80 hover:border-tan-500 hover:text-tan-500 cursor-pointer"
      : "border-line text-ink-muted hover:border-tan-500 hover:text-accent-text cursor-pointer";

  const placeholder =
    tone === "deep"
      ? "border-line-deep/60 text-mist-100/30"
      : "border-line text-ink-muted/40";

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {entries.map(({ platform, href }) => (
        <li key={platform}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${socialLabels[platform]} (opens in a new tab)`}
              className={cn(base, active)}
            >
              <SocialIcon platform={platform} className="size-4" />
            </a>
          ) : (
            <span
              role="img"
              aria-label={`${socialLabels[platform]} — link coming soon`}
              title={`${socialLabels[platform]} — link coming soon`}
              className={cn(base, placeholder)}
            >
              <SocialIcon platform={platform} className="size-4" />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
