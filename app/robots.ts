import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/siteEnv";
import { SITE_ORIGIN } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
