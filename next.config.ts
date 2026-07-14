import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  trailingSlash: false,

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Set this to 10mb or 20mb depending on your needs
    },
  },

  images: {

    // security settigs go outside remote pattern

    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saharanpurprice.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    
    ],
  },

  staticPageGenerationTimeout: 100,
};

export default nextConfig;
