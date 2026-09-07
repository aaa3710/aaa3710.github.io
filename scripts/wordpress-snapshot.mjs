import { spawnSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { exportWordPress } from './wordpress-export.mjs';
const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'work/wordpress/site');
const stamp = new Date()
  .toISOString()
  .replaceAll(':', '-')
  .replace(/\.\d+Z$/, 'Z');
const output = path.resolve(
  process.argv[2] || path.join(root, 'work/wordpress/exports', stamp),
);
function wp(args) {
  const r = spawnSync(
    path.join(root, 'scripts/studio.sh'),
    ['wp', ...args, '--path', site],
    { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
  );
  if (r.status !== 0)
    throw new Error(r.stderr || r.stdout || 'WordPress command failed');
  return r.stdout.trim();
}
const origin = wp(['option', 'get', 'home']);
const routes = JSON.parse(
  wp(['eval-file', 'wp-content/plugins/apps-editor/public-routes.php']),
);
const result = await exportWordPress({
  origin,
  routes,
  output,
  publicOrigin: 'https://aaa3710.github.io',
});
const check = spawnSync(
  process.execPath,
  [path.join(root, 'scripts/verify-pages.mjs')],
  {
    cwd: root,
    env: {
      ...process.env,
      STATIC_SITE_DIRECTORY: output,
      NEXT_PUBLIC_SITE_ORIGIN: 'https://aaa3710.github.io',
    },
    stdio: 'inherit',
  },
);
if (check.status !== 0)
  throw new Error(
    'Static verification failed. The current published snapshot was not changed.',
  );
await mkdir(path.join(root, 'work/wordpress'), { recursive: true });
await writeFile(
  path.join(root, 'work/wordpress/latest-export.json'),
  JSON.stringify({ directory: output, ...result }, null, 2) + '\n',
);
console.log(`確認版を書き出しました: ${output}`);
