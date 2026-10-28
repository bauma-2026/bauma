import type { NextConfig } from "next";
import { isIndexable, isStaging } from "./lib/siteEnv";

/**
 * Captured when Next loads this file and written into the routes manifest.
 * A later `next start` does not recompute it, so SITE_ENV at startup cannot
 * reopen a production artifact. `next dev` loads this with NODE_ENV=development.
 * Staging is still only SITE_ENV=staging; isStaging itself is unchanged.
 */
const developmentRoutesClosed =
  process.env.NODE_ENV === "production" && !isStaging;

/**
 * Lab files requested through the image optimizer are closed in every built
 * artifact, staging included. The optimizer fetches the file internally and
 * accepts only a 2xx answer; staging's `/lab/*` redirect would answer 307 and
 * the optimizer turns that into a 500. Rewriting the optimizer request itself
 * to the not-found route gives a real 404 and never reaches that redirect.
 * `next dev` keeps lab images working (NODE_ENV=development).
 */
const labImagesClosed = process.env.NODE_ENV === "production";

const CLOSED = "/_not-found";

const LAB_IMAGE_RULES = [
  {
    source: "/_next/image",
    has: [{ type: "query" as const, key: "url", value: "/lab/.*" }],
    destination: CLOSED,
  },
  {
    source: "/_next/image",
    has: [{ type: "query" as const, key: "url", value: "%2Flab(?:%2F|/).*" }],
    destination: CLOSED,
  },
];

const nextConfig: NextConfig = {
  // `app/global-not-found.tsx`: with separate root layouts ((sl), en, lab) it renders every unmatched URL and the
  // CLOSED rewrites below; without it those get Next's bare 404 document with no `lang`.
  experimental: { globalNotFound: true },
  // Route access, not indexing: staging only (SITE_ENV=staging) keeps unfinished lab routes out of reach.
  async redirects() {
    return isStaging
      ? [{ source: "/lab/:path*", destination: "/", permanent: false }]
      : [];
  },
  async rewrites() {
    // Staging closes only the optimizer path; its /lab/* pages and files keep the redirect above.
    if (!developmentRoutesClosed) {
      return labImagesClosed ? { beforeFiles: LAB_IMAGE_RULES } : [];
    }
    return {
      // beforeFiles runs before public/ and app routes, so one rule covers
      // HTML routes and files under /lab without looking at the extension.
      beforeFiles: [
        { source: "/lab/:path*", destination: CLOSED },
        { source: "/mini", destination: CLOSED },
        { source: "/en/mini", destination: CLOSED },
        { source: "/about-preview", destination: CLOSED },
        { source: "/en/about-preview", destination: CLOSED },
        ...LAB_IMAGE_RULES,
      ],
    };
  },
  async headers() {
    return [
      // Anything that is not an explicit production build (staging, preview, local,
      // missing or mistyped SITE_ENV) is noindex on every response.
      ...(!isIndexable
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
