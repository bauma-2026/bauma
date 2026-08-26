import type { MetadataRoute } from "next";

/**
 * Public indexable homepage URLs only.
 * Do not add About, Work, legal, lab, or preview routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://bauma.si",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          sl: "https://bauma.si",
          en: "https://bauma.si/en",
        },
      },
    },
    {
      url: "https://bauma.si/en",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          sl: "https://bauma.si",
          en: "https://bauma.si/en",
        },
      },
    },
  ];
}
