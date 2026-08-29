import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName =
  (process.env.GITHUB_REPOSITORY ?? '').split('/')[1] ?? '';
const inferredBasePath =
  repositoryName && !repositoryName.endsWith('.github.io')
    ? `/${repositoryName}`
    : '';
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isGitHubPages ? inferredBasePath : '');

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: false,
};

export default nextConfig;
