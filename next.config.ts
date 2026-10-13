import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH?.trim();
const isMobileBuild = process.env.IS_EMBEDDED_SHELL  === "true";

const basePath =
  !isMobileBuild && pagesBasePath && pagesBasePath !== "/"
    ? pagesBasePath.replace(/\/+$/, "")
    : undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
