import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle libsql on the server
      config.externals.push('@libsql/client', 'libsql');
    }
    return config;
  },
  serverExternalPackages: ['@libsql/client', 'libsql'],
};

export default nextConfig;
