import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Verify the prepared static output, not source components or a live deployment.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDirectory = path.join(root, 'dist', 'client');
const origin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://local.github.io'
).replace(/\/$/, '');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const supportEmail = (process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '').trim();
const formReadiness = {
  feedback: process.env.NEXT_PUBLIC_APP_FEEDBACK_READY === 'true',
  contact: process.env.NEXT_PUBLIC_CONTACT_READY === 'true',
};
const slug = 'focus-exposure-calculator';
const locales = ['ja', 'en'];
const kinds = ['home', 'app', 'privacy', 'support', 'feedback', 'contact'];
const names = {
  ja: 'ピントと光 — 撮影計算',
  en: 'Focus & Light — Photo Tools',
};
const formUrls = {
  feedback: {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSeIExpSJV8iJY0866WgjJPxhnMbDQSTg5lqukNU5YE-9fhxbw/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSeHQTMezEMlXcYxy6sY7rtoOItgaYLJdDvxVXO1-zMNrxghCw/viewform',
  },
  contact: {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSf6rKXgaPvHUx6kZI3J4bEwwzfsDJ0ToUXWEo0qDko2j14nww/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLScAt6o2DzHGOTgflSDjjbPHq3tjZm3AmqogGLOkAUpkY_3Bjg/viewform',
  },
};

let assertions = 0;
let requiredPages = 0;
const failures = [];

function check(condition, message) {
  assertions += 1;
  if (!condition) failures.push(message);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(file)));
    else files.push(file);
  }
  return files;
}

function route(locale, kind) {
  const prefix = locale === 'en' ? '/en' : '';
  if (kind === 'home') return `${prefix}/`;
  if (kind === 'contact') return `${prefix}/contact/`;
  const segment = kind === 'app' ? 'apps' : kind;
  return `${prefix}/${segment}/${slug}/`;
}

function absoluteUrl(routePath) {
  return `${origin}${basePath}${routePath}`;
}

function sameUrl(actual, expected) {
  if (!actual) return false;
  return new URL(actual).href === new URL(expected).href;
}

function pageFile(routePath) {
  return path.join(clientDirectory, routePath, 'index.html');
}

function decodeHtml(value) {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi,
    (_, entity) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith('#x')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      }
      if (normalized.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      }
      return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[normalized];
    },
  );
}

// These exported pages use ordinary quoted HTML attributes. A small parser is
// sufficient here; ignoring scripts also avoids mistaking RSC data for links.
function markupOnly(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(
    ([tag]) => {
      const attributes = {};
      for (const match of tag.matchAll(
        /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
      )) {
        attributes[match[1].toLowerCase()] = decodeHtml(
          match[2] ?? match[3] ?? match[4],
        );
      }
      return attributes;
    },
  );
}

function normalizedLink(href) {
  if (!href || href.startsWith('#')) return null;
  try {
    const url = new URL(href, absoluteUrl('/'));
    if (url.origin !== new URL(origin).origin) return null;
    return `${url.pathname.replace(/\/$/, '')}/`;
  } catch {
    return null;
  }
}

function linksTo(anchors, routePath) {
  return anchors.some(
    (anchor) => normalizedLink(anchor.href) === `${basePath}${routePath}`,
  );
}

function metaValues(metaTags, name) {
  return metaTags
    .filter((tag) => tag.name === name || tag.property === name)
    .map((tag) => tag.content);
}

if (!(await exists(clientDirectory))) {
  throw new Error('dist/client is missing. Run npm run build:pages first.');
}

const files = await collectFiles(clientDirectory);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const publicRouteSet = new Set();

for (const file of htmlFiles) {
  const relativePath = path
    .relative(clientDirectory, file)
    .split(path.sep)
    .join('/');
  const html = await readFile(file, 'utf8');
  check(
    !html.includes('Focus Map'),
    `${relativePath}: old public app name remains`,
  );
  check(
    !/\/(?:en\/)?(?:apps|privacy|support|feedback)\/focus-map(?:[/\s?"'#<\\]|$)/.test(
      html,
    ) && !html.includes('/images/focus-map/'),
    `${relativePath}: old public URL remains`,
  );
  check(
    !html.includes('Focus &amp;amp;'),
    `${relativePath}: English app name is double-escaped`,
  );
  if (!supportEmail) {
    check(
      !tags(markupOnly(html), 'a').some((anchor) =>
        anchor.href?.startsWith('mailto:'),
      ),
      `${relativePath}: a public email link is present although no email is configured`,
    );
  }
  if (relativePath === '404.html') continue;
  const routePath =
    relativePath === 'index.html'
      ? '/'
      : `/${relativePath.replace(/(?:\/index)?\.html$/, '')}/`;
  publicRouteSet.add(routePath);
}

for (const locale of locales) {
  for (const kind of kinds) {
    const routePath = route(locale, kind);
    const file = pageFile(routePath);
    const present = await exists(file);
    check(present, `${routePath}: prepared index.html is missing`);
    if (!present) continue;
    requiredPages += 1;

    const html = markupOnly(await readFile(file, 'utf8'));
    const anchors = tags(html, 'a');
    const linkTags = tags(html, 'link');
    const metaTags = tags(html, 'meta');
    const canonicals = linkTags.filter((tag) => tag.rel === 'canonical');
    const alternates = linkTags.filter((tag) => tag.hreflang);
    const robots = metaValues(metaTags, 'robots')
      .join(',')
      .toLowerCase()
      .split(/[,\s]+/);

    check(
      tags(html, 'html')[0]?.lang === locale,
      `${routePath}: html language is not ${locale}`,
    );
    if (kind === 'feedback') {
      check(
        canonicals.length === 0,
        `${routePath}: private feedback has a canonical URL`,
      );
      check(
        alternates.length === 0,
        `${routePath}: private feedback has hreflang links`,
      );
      check(
        robots.includes('noindex') && robots.includes('nofollow'),
        `${routePath}: feedback must be noindex, nofollow`,
      );
    } else {
      check(
        canonicals.length === 1 &&
          sameUrl(canonicals[0].href, absoluteUrl(routePath)),
        `${routePath}: canonical URL mismatch`,
      );
      for (const alternateLocale of locales) {
        check(
          alternates.some(
            (tag) =>
              tag.hreflang === alternateLocale &&
              sameUrl(tag.href, absoluteUrl(route(alternateLocale, kind))),
          ),
          `${routePath}: ${alternateLocale} hreflang URL mismatch`,
        );
      }
      check(
        !robots.includes('noindex'),
        `${routePath}: indexable page is marked noindex`,
      );
      check(
        metaValues(metaTags, 'og:url').some((url) =>
          sameUrl(url, absoluteUrl(routePath)),
        ),
        `${routePath}: Open Graph URL mismatch`,
      );
    }

    const navigation = [...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)];
    check(
      navigation.length >= 2,
      `${routePath}: header/footer navigation is missing`,
    );
    for (const [index, [, navHtml]] of navigation.entries()) {
      const navLinks = tags(navHtml, 'a');
      check(
        linksTo(navLinks, route(locale, 'contact')),
        `${routePath}: navigation ${index + 1} has no Contact link`,
      );
      check(
        !navLinks.some(
          (anchor) =>
            anchor['aria-label'] !== 'Language / 言語' &&
            /\/(?:en\/)?feedback\//.test(normalizedLink(anchor.href) ?? ''),
        ),
        `${routePath}: ordinary navigation links to app-specific Feedback`,
      );
    }
    check(
      anchors.some(
        (anchor) =>
          anchor['aria-label'] === 'Language / 言語' &&
          linksTo([anchor], route(locale === 'ja' ? 'en' : 'ja', kind)),
      ),
      `${routePath}: language switch does not reach the counterpart page`,
    );

    if (kind === 'support') {
      check(
        linksTo(anchors, route(locale, 'feedback')),
        `${routePath}: Support has no app-specific Feedback link`,
      );
      if (supportEmail) {
        check(
          anchors.some((anchor) => anchor.href === `mailto:${supportEmail}`),
          `${routePath}: configured support email is missing or different`,
        );
      }
    }
    if (kind === 'contact') {
      check(
        linksTo(anchors, route(locale, 'support')),
        `${routePath}: Contact has no app Support link`,
      );
      check(
        !locales.some((targetLocale) =>
          linksTo(anchors, route(targetLocale, 'feedback')),
        ),
        `${routePath}: Contact links directly to app Feedback`,
      );
    }
    if (kind === 'contact' || kind === 'feedback') {
      const iframeTags = tags(html, 'iframe');
      if (formReadiness[kind]) {
        check(
          html.includes(
            locale === 'ja'
              ? '開発者へ回答としては届きません'
              : 'developer does not receive your text as a response',
          ),
          `${routePath}: response submission and Google processing are not distinguished`,
        );
        check(
          iframeTags.length === 1 &&
            iframeTags[0].src === `${formUrls[kind][locale]}?embedded=true`,
          `${routePath}: embedded Google Form URL mismatch`,
        );
        check(
          anchors.some((anchor) => anchor.href === formUrls[kind][locale]),
          `${routePath}: separate-page Google Form link mismatch`,
        );
      } else {
        check(
          html.includes(locale === 'ja' ? '準備中です' : 'being prepared'),
          `${routePath}: unavailable form does not explain its preparation state`,
        );
        check(
          iframeTags.length === 0,
          `${routePath}: unverified form is embedded although its readiness flag is false`,
        );
        check(
          !anchors.some((anchor) =>
            anchor.href?.startsWith('https://docs.google.com/forms/'),
          ),
          `${routePath}: unverified form is linked although its readiness flag is false`,
        );
      }
    }
    if (kind === 'app') {
      check(
        !tags(html, 'img').some((image) =>
          /\/(?:main|sensors)-(?:ja|en)\.png$/.test(image.src ?? ''),
        ),
        `${routePath}: pre-rename app captures must remain hidden until replacements are verified`,
      );
      check(
        decodeHtml(html).includes(names[locale]),
        `${routePath}: localized public app name is missing`,
      );
      const imageUrl = absoluteUrl(`/images/${slug}/og-${locale}.png`);
      check(
        metaValues(metaTags, 'og:image').includes(imageUrl),
        `${routePath}: localized Open Graph image mismatch`,
      );
      check(
        metaValues(metaTags, 'twitter:image').includes(imageUrl),
        `${routePath}: localized Twitter image mismatch`,
      );
    }
  }
}

for (const locale of locales) {
  const prefix = locale === 'en' ? '/en' : '';
  for (const segment of ['apps', 'privacy', 'support', 'feedback']) {
    const oldPath = `${prefix}/${segment}/focus-map`;
    check(
      !(await exists(path.join(clientDirectory, `${oldPath}.html`))),
      `${oldPath}: old flat route still exists`,
    );
    check(
      !(await exists(pageFile(`${oldPath}/`))),
      `${oldPath}: old prepared route still exists`,
    );
  }
  check(
    !(await exists(path.join(clientDirectory, `${prefix}/feedback.html`))),
    `${prefix}/feedback.html: old common Feedback route still exists`,
  );
  check(
    !(await exists(pageFile(`${prefix}/feedback/`))),
    `${prefix}/feedback/: old common Feedback index still exists`,
  );
}

const sitemapFile = path.join(clientDirectory, 'sitemap.xml');
check(await exists(sitemapFile), 'sitemap.xml is missing');
if (await exists(sitemapFile)) {
  const sitemap = await readFile(sitemapFile, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(
    ([, url]) => decodeHtml(url.trim()),
  );
  const expected = locales.flatMap((locale) =>
    kinds
      .filter((kind) => kind !== 'feedback')
      .map((kind) => absoluteUrl(route(locale, kind))),
  );
  check(locations.length === 10, 'sitemap must contain exactly 10 URLs');
  check(
    new Set(locations).size === locations.length,
    'sitemap contains duplicate URLs',
  );
  check(
    locations.every((url) => url.endsWith('/')),
    'sitemap URLs must have trailing slashes',
  );
  check(
    locations.every((url) => !url.includes('/feedback/')),
    'sitemap includes app-specific Feedback',
  );
  check(
    JSON.stringify([...locations].sort((a, b) => a.localeCompare(b))) ===
      JSON.stringify([...expected].sort((a, b) => a.localeCompare(b))),
    'sitemap URL set differs from the 10 expected indexable routes',
  );
}

const feedbackSource = await readFile(
  path.join(root, 'lib', 'feedback.ts'),
  'utf8',
);
for (const [kind, localizedUrls] of Object.entries(formUrls)) {
  for (const [locale, url] of Object.entries(localizedUrls)) {
    check(
      feedbackSource.includes(url),
      `lib/feedback.ts: original ${locale} ${kind} responder URL was changed`,
    );
  }
}

for (const locale of locales) {
  const relativePath = `images/${slug}/og-${locale}.png`;
  const file = path.join(clientDirectory, relativePath);
  const present = await exists(file);
  check(present, `${relativePath}: generated OG asset is missing`);
  if (!present) continue;
  const png = await readFile(file);
  const validHeader =
    png.length >= 24 &&
    png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    png.toString('ascii', 12, 16) === 'IHDR';
  check(validHeader, `${relativePath}: not a PNG with an IHDR header`);
  if (validHeader) {
    check(
      png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630,
      `${relativePath}: OG dimensions must be 1200 × 630`,
    );
  }
}

const summary = `${requiredPages}/12 required pages; ${publicRouteSet.size} generated public routes; ${htmlFiles.length} HTML files; ${assertions} assertions`;
if (failures.length) {
  console.error(
    `GitHub Pages verification failed: ${failures.length} failure(s), ${summary}.`,
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`GitHub Pages verification passed: ${summary}.`);
}
