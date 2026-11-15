import { SocialIcon, socialLabels } from "@/components/icons/social";
import { site, socialEntries } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The coach's social profiles — Instagram only, configured in
 * `site.social`. Each opens in a new tab and says so to assistive tech.
 */
export function SocialLinks({
  tone = "deep",
  className,
}: {
  tone?: "light" | "deep";
  className?: string;
}) {
  const entries = socialEntries();
  if (entries.length === 0) return null;

  const link =
    tone === "deep"
      ? "border-line-deep text-mist-100/80 hover:border-tan-500 hover:text-tan-500"
      : "border-line text-ink-muted hover:border-tan-500 hover:text-accent-text";

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {entries.map(({ platform, href }) => (
        <li key={platform}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on ${socialLabels[platform]} (opens in a new tab)`}
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center rounded-full border transition-colors",
              link,
            )}
          >
            <SocialIcon platform={platform} className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
