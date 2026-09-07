import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { replaceArtifact } from './wordpress-artifact.mjs';
const root = path.resolve(import.meta.dirname, '..');
if (!process.argv[2])
  throw new Error('Specify the reviewed WordPress export directory');
const source = path.resolve(process.argv[2]);
const check = spawnSync(
  process.execPath,
  [path.join(root, 'scripts/verify-pages.mjs')],
  {
    cwd: root,
    env: {
      ...process.env,
      STATIC_SITE_DIRECTORY: source,
      NEXT_PUBLIC_SITE_ORIGIN: 'https://aaa3710.github.io',
    },
    stdio: 'inherit',
  },
);
if (check.status !== 0)
  throw new Error('Verification failed; previous snapshot retained');
await replaceArtifact(source, path.join(root, 'site-output'));
console.log(
  'Prepared the same public snapshot for Sites and GitHub Pages. No remote deployment was performed.',
);
