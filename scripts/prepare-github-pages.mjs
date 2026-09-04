import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
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

const preparedHtmlFiles = (await collectFiles(clientDirectory)).filter((file) =>
  file.endsWith('.html'),
);

for (const htmlFile of preparedHtmlFiles) {
  const relativePath = path.relative(clientDirectory, htmlFile);
  const isEnglishRoute =
    relativePath === 'en.html' || relativePath.startsWith(`en${path.sep}`);

  if (!isEnglishRoute) {
    continue;
  }

  const source = await readFile(htmlFile, 'utf8');

  if (source.includes('<html lang="en">')) {
    continue;
  }

  if (!source.includes('<html lang="ja">')) {
    throw new Error(`Could not find document language: ${relativePath}`);
  }

  const localized = source.replace('<html lang="ja">', '<html lang="en">');
  await writeFile(htmlFile, localized);
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
  '/en/',
  '/apps/focus-exposure-calculator/',
  '/en/apps/focus-exposure-calculator/',
  '/privacy/focus-exposure-calculator/',
  '/en/privacy/focus-exposure-calculator/',
  '/support/focus-exposure-calculator/',
  '/en/support/focus-exposure-calculator/',
  '/contact/',
  '/en/contact/',
  '/apps/tsutawaru-moji/',
  '/en/apps/tsutawaru-moji/',
  '/support/tsutawaru-moji/',
  '/en/support/tsutawaru-moji/',
  '/privacy/tsutawaru-moji/',
  '/en/privacy/tsutawaru-moji/',
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
