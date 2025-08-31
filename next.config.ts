import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: isProd ? "/fantasymaps" : "",
  assetPrefix: isProd ? "/fantasymaps/" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  output: "export",
  // Configure Turbopack for development
  experimental: {
    turbo: {
      // Allow Turbopack to handle assets correctly with base path
    },
  },
  // Configure webpack for production builds
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Ensure assets are properly prefixed in production
      config.output.publicPath = isProd ? "/fantasymaps/_next/" : "/_next/";
    }
    return config;
  },
};

export default nextConfig;
