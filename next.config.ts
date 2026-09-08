import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH?.trim();
const basePath =
  pagesBasePath && pagesBasePath !== "/"
    ? pagesBasePath.replace(/\/+$/, "")
    : undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
