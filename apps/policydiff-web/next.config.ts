import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ojpp/ui"],
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
