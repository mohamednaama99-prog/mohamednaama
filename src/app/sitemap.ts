import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * Public routes only. /apply is excluded deliberately — it is `noindex`
 * (see its metadata), so listing it here would contradict that.
 *
 * No `lastModified`: Cache Components rejects `new Date()` during prerender,
 * and a hardcoded date would go stale silently. Omitting it is honest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/contact", "/privacy", "/terms", "/refunds"];

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.6,
  }));
}
