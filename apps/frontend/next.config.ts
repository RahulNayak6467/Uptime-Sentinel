import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["echarts", "zrender"],
  // Pin the workspace root so Next doesn't infer it from a stray lockfile in
  // the home dir (that one is pnpm's self-management install). This is the
  // monorepo root, two levels up from apps/frontend, where the hoisted
  // node_modules and pnpm-workspace.yaml live.
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
};

export default nextConfig;
