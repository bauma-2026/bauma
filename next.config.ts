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
    ];
  },
};

export default nextConfig;