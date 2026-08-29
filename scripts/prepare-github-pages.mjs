import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDirectory = path.join(root, 'dist', 'client');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

const filesBeforePreparation = await collectFiles(clientDirectory);
const htmlFiles = filesBeforePreparation.filter(
  (file) =>
    file.endsWith('.html') &&
    path.basename(file) !== 'index.html' &&
    path.basename(file) !== '404.html',
);

for (const htmlFile of htmlFiles) {
  const routeDirectory = htmlFile.slice(0, -'.html'.length);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(htmlFile, path.join(routeDirectory, 'index.html'));

  const rscFile = htmlFile.slice(0, -'.html'.length) + '.rsc';
  if (filesBeforePreparation.includes(rscFile)) {
    await copyFile(rscFile, path.join(routeDirectory, 'index.rsc'));
  }
}

await writeFile(path.join(clientDirectory, '.nojekyll'), '');

const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? '').replace(/\/$/, '');
if (!origin.startsWith('https://')) {
  throw new Error(
    'NEXT_PUBLIC_SITE_ORIGIN must be an HTTPS origin for GitHub Pages.',
  );
}

const indexablePaths = [
  '/',
  '/en',
  '/apps/focus-map',
  '/en/apps/focus-map',
  '/privacy/focus-map',
  '/en/privacy/focus-map',
  '/support/focus-map',
  '/en/support/focus-map',
];

await writeFile(
  path.join(clientDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);

const urls = indexablePaths
  .map((route) => `  <url><loc>${origin}${route}</loc></url>`)
  .join('\n');

await writeFile(
  path.join(clientDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(
  `Prepared ${htmlFiles.length + 1} GitHub Pages routes in dist/client.`,
);
