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
};

export default nextConfig;
