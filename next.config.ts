import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-waterdeep.cursecdn.com',
      },
    ],
  },
};

export default nextConfig;
