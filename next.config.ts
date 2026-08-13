import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "mirogen-early-booking-landing-20260813";
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPagesBuild ? "export" : undefined,
  basePath,
  assetPrefix: isGitHubPagesBuild ? `${basePath}/` : undefined,
};

export default nextConfig;
