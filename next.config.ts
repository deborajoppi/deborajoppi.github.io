import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = "deborajoppi.github.io";
const isUserOrOrgSite = repo.endsWith(".github.io");
const ghPagesBasePath = isProd && !isUserOrOrgSite ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: ghPagesBasePath || undefined,
  assetPrefix: ghPagesBasePath ? `${ghPagesBasePath}/` : undefined,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: ghPagesBasePath,
  },
};

export default nextConfig;
