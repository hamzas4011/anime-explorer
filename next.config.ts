import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.app",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.io",
      },
    ],
  },
};

export default nextConfig;