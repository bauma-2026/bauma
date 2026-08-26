import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
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
