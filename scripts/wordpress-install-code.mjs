import { cp, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'work/wordpress/site');
await access(path.join(site, 'wp-load.php'));
// Copy code only; never overwrite database, media, or saved Site Editor customizations.
await mkdir(path.join(site, 'wp-content/themes/apps-common'), {
  recursive: true,
});
await mkdir(path.join(site, 'wp-content/plugins/apps-editor'), {
  recursive: true,
});
await cp(
  path.join(root, 'wordpress/theme'),
  path.join(site, 'wp-content/themes/apps-common'),
  { recursive: true },
);
await cp(
  path.join(root, 'wordpress/plugin'),
  path.join(site, 'wp-content/plugins/apps-editor'),
  { recursive: true },
);
console.log(
  'Installed theme and editor plugin code. Database and uploads preserved.',
);
