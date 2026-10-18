import type { NextConfig } from "next";
import { isStaging } from "./lib/siteEnv";

const nextConfig: NextConfig = {
  // Staging only (SITE_ENV=staging): keep unfinished lab routes out of reach.
  async redirects() {
    return isStaging
      ? [{ source: "/lab/:path*", destination: "/", permanent: false }]
      : [];
  },
  async headers() {
    return [
      ...(isStaging
        ? [
            {
              source: "/:path*",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ]
        : []),
      {
        source: "/images/gregor/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, noimageindex",
          },
        ],
      },
      {
        // The About Preview delivers this local image through Next's image
        // optimizer, so protect that specific delivery path as well.
        source: "/_next/image",
        has: [
          {
            type: "query",
            key: "url",
            value: "/images/gregor/.*",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
