import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      root: '../../', // Silences the inferred workspace root warning
    }
  },
  // @ts-ignore - added to avoid type errors in some next.js versions
  allowedDevOrigins: ['192.168.31.204'],
};

export default nextConfig;
