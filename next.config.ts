import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // base path untuk subdirectory deployment
  basePath: "/report",

  // supaya semua static asset (js, css, images, dll) resolve ke /report/_next/...
  assetPrefix: "/report",

  // trailing slash
  trailingSlash: true,

  // optional: kalau deploy pakai pm2/docker lebih ringan
  output: "standalone",

  // config webpack tambahan (SVG loader)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
