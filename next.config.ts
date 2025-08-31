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
};

export default nextConfig;
