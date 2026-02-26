import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      // ✅ YOUR OWN DOMAIN (MOST IMPORTANT)
      {
        protocol: "https",
        hostname: "saharanpurprice.in",
      },

      // ✅ UNSPLASH (optional)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },

  staticPageGenerationTimeout: 100,
};

export default nextConfig;
