import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.archivehonar.ir",
        pathname: "/**",
      },
    ],
  },
  // Prod serves /api from the same origin via nginx. Dev has no such proxy, so
  // point API_ORIGIN at a backend (e.g. http://localhost:3000) in .env.local.
  // ponytail: unset falls back to the live site so a missing env never yields
  // a localhost URL; override with API_ORIGIN when running against a local backend.
  async rewrites() {
    const origin = process.env.API_ORIGIN ?? "https://archivehonar.ir";
    return [{ source: "/api/:path*", destination: `${origin}/api/:path*` }];
  },
};

export default nextConfig;
