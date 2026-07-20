import type { NextConfig } from "next";

// Zero-secret static-first build. No env vars required.
// `output: 'standalone'` produces a minimal self-contained server bundle
// under .next/standalone that the production Docker image runs directly.
const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
