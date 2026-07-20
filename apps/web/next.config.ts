import type { NextConfig } from "next";

// Zero-secret static-first build. No env vars required.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
