import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

process.env.GITHUB_PAGES ??= 'true';
process.env.GITHUB_REPOSITORY ??= 'local/local.github.io';
process.env.NEXT_PUBLIC_SITE_ORIGIN ??= 'https://local.github.io';

const cli = path.join(root, 'node_modules', 'vinext', 'dist', 'cli.js');
const build = spawnSync(process.execPath, [cli, 'build'], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

await import('./prepare-github-pages.mjs');
