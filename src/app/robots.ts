import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The application form has nothing to offer search and is already
         marked noindex in its own metadata. */
      disallow: ["/apply"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
