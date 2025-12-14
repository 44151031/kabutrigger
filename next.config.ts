import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Turbopack設定（空の設定でTurbopackを明示的に有効化）
  turbopack: {},
};

export default nextConfig;
