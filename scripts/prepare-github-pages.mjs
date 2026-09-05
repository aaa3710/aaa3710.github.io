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
    relativePath === 'apps/en.html' ||
    relativePath.startsWith(`apps${path.sep}en${path.sep}`);

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
  '/apps/',
  '/apps/en/',
  '/apps/focus-exposure-calculator/',
  '/apps/en/focus-exposure-calculator/',
  '/apps/privacy/focus-exposure-calculator/',
  '/apps/en/privacy/focus-exposure-calculator/',
  '/apps/support/focus-exposure-calculator/',
  '/apps/en/support/focus-exposure-calculator/',
  '/apps/contact/',
  '/apps/en/contact/',
  '/apps/tsutawaru-moji/',
  '/apps/en/tsutawaru-moji/',
  '/apps/support/tsutawaru-moji/',
  '/apps/en/support/tsutawaru-moji/',
  '/apps/privacy/tsutawaru-moji/',
  '/apps/en/privacy/tsutawaru-moji/',
  '/apps/location-logger/',
  '/apps/en/location-logger/',
  '/apps/support/location-logger/',
  '/apps/en/support/location-logger/',
  '/apps/privacy/location-logger/',
  '/apps/en/privacy/location-logger/',
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

// Keep published bookmarks and app binaries working during the URL migration.
// GitHub Pages serves static HTML; these are HTML redirects, not HTTP 301s.
const currentPages = (await collectFiles(clientDirectory)).filter((file) =>
  file.endsWith(`${path.sep}index.html`),
);
let redirects = 0;
for (const file of currentPages) {
  const route = `/${path
    .relative(clientDirectory, file)
    .split(path.sep)
    .join('/')
    .replace(/index\.html$/, '')}`;
  if (!route.startsWith('/apps/')) continue;
  const english = route.startsWith('/apps/en/');
  const suffix = route.slice(english ? '/apps/en/'.length : '/apps/'.length);
  let legacy;
  if (!suffix) legacy = english ? '/en/' : '/';
  else if (/^(?:support|privacy|feedback|contact)\//.test(suffix))
    legacy = `${english ? '/en' : ''}/${suffix}`;
  else if (english) legacy = `/en/apps/${suffix}`;
  else continue;
  const label = english ? 'Open the new page' : '新しいページを開く';
  const title = english ? 'This page has moved' : 'ページの場所が変わりました';
  const html = `<!doctype html><html lang="${english ? 'en' : 'ja'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0;url=${route}"></head><body><p><a href="${route}">${label}</a></p></body></html>\n`;
  const directory = path.join(clientDirectory, legacy);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
  if (legacy !== '/')
    await writeFile(
      path.join(clientDirectory, `${legacy.slice(0, -1)}.html`),
      html,
    );
  redirects += 1;
}
console.log(
  `Prepared ${redirects} legacy redirects; app pages are under /apps/.`,
);
