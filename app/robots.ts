import type { MetadataRoute } from "next";
import { isStaging } from "@/lib/siteEnv";

export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://bauma.si/sitemap.xml",
  };
}