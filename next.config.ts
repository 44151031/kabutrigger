import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack: (config) => {
    // Supabase Edge Functions (Deno) をビルドから除外
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/supabase/**"],
    };
    return config;
  },
};

export default nextConfig;
