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
const locationLoggerFeedbackReady =
  process.env.NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY === 'true';
const locationLoggerFeedbackUrls = {
  ja: process.env.NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA?.trim() ?? '',
  en: process.env.NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN?.trim() ?? '',
};
const slug = 'focus-exposure-calculator';
const locales = ['ja', 'en'];
const kinds = ['home', 'app', 'privacy', 'support', 'feedback', 'contact'];
const names = {
  ja: '撮影のものさし',
  en: 'Photo Yardstick',
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
  const prefix = locale === 'en' ? '/apps/en' : '/apps';
  if (kind === 'home') return `${prefix}/`;
  if (kind === 'contact') return `${prefix}/contact/`;
  return `${prefix}/${kind === 'app' ? '' : `${kind}/`}${slug}/`;
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
    ![
      'Focus Map',
      'ピントと光',
      'Focus & Light',
      'Focus &amp; Light',
      'Photo Measure',
    ].some((oldName) => html.includes(oldName)),
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

// Check the migration independently from the generator: every former entry
// must lead directly to its counterpart, and current navigation avoids aliases.
const redirects = new Map([
  ['/', '/apps/'],
  ['/en/', '/apps/en/'],
]);
for (const locale of locales) {
  const oldPrefix = locale === 'en' ? '/en' : '';
  const newPrefix = locale === 'en' ? '/apps/en' : '/apps';
  redirects.set(`${oldPrefix}/contact/`, `${newPrefix}/contact/`);
  for (const app of [
    'focus-exposure-calculator',
    'tsutawaru-moji',
    'location-logger',
  ]) {
    for (const kind of ['support', 'privacy', 'feedback'])
      redirects.set(
        `${oldPrefix}/${kind}/${app}/`,
        `${newPrefix}/${kind}/${app}/`,
      );
  }
}
for (const app of [
  'focus-exposure-calculator',
  'tsutawaru-moji',
  'location-logger',
  'card-relay',
  'wrist-morse',
  'genome-notebook',
  'spatial-fold',
  'task-rail',
  'mastery-steps',
])
  redirects.set(`/en/apps/${app}/`, `/apps/en/${app}/`);
for (const [before, after] of redirects) {
  check(
    publicRouteSet.has(after) && !redirects.has(after),
    `${before}: destination missing or another redirect`,
  );
  for (const file of [
    pageFile(before),
    ...(before === '/'
      ? []
      : [path.join(clientDirectory, `${before.slice(0, -1)}.html`)]),
  ]) {
    if (!(await exists(file))) {
      check(false, `${before}: redirect file missing: ${file}`);
      continue;
    }
    const html = markupOnly(await readFile(file, 'utf8'));
    const meta = tags(html, 'meta');
    check(
      meta.some(
        (tag) =>
          tag['http-equiv'] === 'refresh' && tag.content === `0;url=${after}`,
      ),
      `${before}: incorrect redirect`,
    );
    check(
      metaValues(meta, 'robots').includes('noindex, nofollow'),
      `${before}: redirect must stay out of search`,
    );
    check(linksTo(tags(html, 'a'), after), `${before}: missing fallback link`);
    check(
      !tags(html, 'link').some(
        (tag) => tag.rel === 'canonical' || tag.hreflang,
      ),
      `${before}: redirect advertises indexing alternates`,
    );
  }
}
for (const routePath of publicRouteSet) {
  if (redirects.has(routePath)) continue;
  check(
    routePath.startsWith('/apps/'),
    `${routePath}: app content outside /apps/`,
  );
  const html = markupOnly(await readFile(pageFile(routePath), 'utf8'));
  for (const anchor of tags(html, 'a')) {
    const target = normalizedLink(anchor.href);
    if (!target) continue;
    const localTarget = target.slice(basePath.length);
    check(
      publicRouteSet.has(localTarget) && !redirects.has(localTarget),
      `${routePath}: internal link is missing or uses a legacy URL: ${target}`,
    );
  }
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
      if (!/class="app-navigation"/.test(navigation[index][0]))
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
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(names[locale]),
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

const tsutawaruIndexable = [];
for (const locale of locales) {
  const prefix = locale === 'en' ? '/apps/en' : '/apps';
  const appPath = (kind, language = locale) =>
    `${language === 'en' ? '/apps/en' : '/apps'}/${kind === 'app' ? '' : `${kind}/`}tsutawaru-moji/`;
  for (const kind of ['app', 'support', 'privacy', 'feedback']) {
    const routePath = appPath(kind);
    const present = await exists(pageFile(routePath));
    check(present, `${routePath}: missing Tsutawaru page`);
    if (!present) continue;
    requiredPages += 1;
    const raw = await readFile(pageFile(routePath), 'utf8');
    const html = markupOnly(raw);
    const anchors = tags(html, 'a');
    const links = tags(html, 'link');
    const meta = tags(html, 'meta');
    check(
      tags(html, 'html')[0]?.lang === locale,
      `${routePath}: document language mismatch`,
    );
    check(
      decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
        locale === 'ja' ? '伝わる文字' : 'Tsutawaru Moji',
      ),
      `${routePath}: localized name missing`,
    );
    check(
      (html.match(/<h1\b/g) ?? []).length === 1,
      `${routePath}: expected one main heading`,
    );
    check(
      anchors.some(
        (anchor) =>
          anchor['aria-label'] === 'Language / 言語' &&
          linksTo([anchor], appPath(kind, locale === 'ja' ? 'en' : 'ja')),
      ),
      `${routePath}: counterpart language link missing`,
    );
    check(
      linksTo(anchors, `${prefix}/contact/`),
      `${routePath}: common Contact missing`,
    );
    if (kind === 'app')
      check(
        html.includes(
          locale === 'ja'
            ? 'まだダウンロードできません'
            : 'not available to download yet',
        ),
        `${routePath}: unreleased app status missing`,
      );
    if (kind === 'feedback')
      check(
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
          locale === 'ja'
            ? '現在は送信できません'
            : 'Submissions are not available yet',
        ),
        `${routePath}: intake status missing`,
      );
    check(
      !/<iframe|<form\b|<input|<textarea/.test(html),
      `${routePath}: unconfirmed input UI present`,
    );
    check(
      !/docs\.google\.com\/forms|forms\.gle|mailto:|apps\.apple\.com/.test(raw),
      `${routePath}: unverified form, email or Store URL`,
    );
    check(
      !/公開管理|Release control|\{\{|OWNER INPUT|90日|90 days/.test(raw),
      `${routePath}: private preface or unadopted retention promise`,
    );
    check(
      tags(html, 'img').every(
        (img) => img.src === `${basePath}/images/tsutawaru-moji/icon.png`,
      ),
      `${routePath}: imagery other than the approved Tsutawaru icon present`,
    );
    check(
      !anchors.some((anchor) =>
        /focus-exposure-calculator/.test(anchor.href ?? ''),
      ),
      `${routePath}: another app route leaked`,
    );
    if (kind === 'feedback') {
      check(
        metaValues(meta, 'robots').some(
          (value) => value.includes('noindex') && value.includes('nofollow'),
        ),
        `${routePath}: missing noindex/nofollow`,
      );
      check(
        !links.some((link) => link.rel === 'canonical' || link.hreflang),
        `${routePath}: Feedback must not advertise indexing alternates`,
      );
    } else {
      tsutawaruIndexable.push(absoluteUrl(routePath));
      check(
        links.some(
          (link) =>
            link.rel === 'canonical' &&
            sameUrl(link.href, absoluteUrl(routePath)),
        ),
        `${routePath}: canonical mismatch`,
      );
      for (const language of locales)
        check(
          links.some(
            (link) =>
              link.hreflang === language &&
              sameUrl(link.href, absoluteUrl(appPath(kind, language))),
          ),
          `${routePath}: hreflang mismatch`,
        );
    }
    if (kind === 'support')
      check(
        linksTo(anchors, appPath('feedback')),
        `${routePath}: dedicated Feedback link missing`,
      );
    if (kind === 'app')
      check(
        !linksTo(anchors, appPath('feedback')),
        `${routePath}: introduction must route feedback via Support`,
      );
    for (const anchor of anchors) {
      const target = normalizedLink(anchor.href);
      if (target?.startsWith('/') && !target.includes('#') && target !== '/')
        check(
          publicRouteSet.has(target.endsWith('/') ? target : `${target}/`),
          `${routePath}: missing internal target ${target}`,
        );
    }
  }
  const contact = tags(
    markupOnly(await readFile(pageFile(`${prefix}/contact/`), 'utf8')),
    'a',
  );
  check(
    linksTo(contact, appPath('support')),
    `${prefix}/contact/: Tsutawaru support missing`,
  );
  check(
    !linksTo(contact, appPath('feedback')),
    `${prefix}/contact/: direct Feedback link`,
  );
  const home = tags(
    markupOnly(await readFile(pageFile(`${prefix}/`), 'utf8')),
    'a',
  );
  check(
    linksTo(home, appPath('app')),
    `${prefix}/: Tsutawaru introduction missing`,
  );
}

const locationLoggerIndexable = [];
for (const locale of locales) {
  const prefix = locale === 'en' ? '/apps/en' : '/apps';
  const appPath = (kind, language = locale) =>
    `${language === 'en' ? '/apps/en' : '/apps'}/${kind === 'app' ? '' : `${kind}/`}location-logger/`;
  for (const kind of ['app', 'support', 'privacy', 'feedback']) {
    const routePath = appPath(kind);
    const present = await exists(pageFile(routePath));
    check(present, `${routePath}: missing LocationLogger page`);
    if (!present) continue;
    requiredPages += 1;
    const raw = await readFile(pageFile(routePath), 'utf8');
    const html = markupOnly(raw);
    const anchors = tags(html, 'a');
    const links = tags(html, 'link');
    const meta = tags(html, 'meta');
    check(
      tags(html, 'html')[0]?.lang === locale,
      `${routePath}: document language mismatch`,
    );
    check(
      decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
        locale === 'ja' ? '道の記録' : 'LocationLogger',
      ),
      `${routePath}: app name missing`,
    );
    check(
      (html.match(/<h1\b/g) ?? []).length === 1,
      `${routePath}: expected one main heading`,
    );
    check(
      anchors.some(
        (anchor) =>
          anchor['aria-label'] === 'Language / 言語' &&
          linksTo([anchor], appPath(kind, locale === 'ja' ? 'en' : 'ja')),
      ),
      `${routePath}: counterpart language link missing`,
    );
    check(
      linksTo(anchors, `${prefix}/contact/`),
      `${routePath}: common Contact missing`,
    );
    if (kind === 'app')
      check(
        html.includes(
          locale === 'ja'
            ? 'まだダウンロードできません'
            : 'not available to download yet',
        ),
        `${routePath}: unreleased app status missing`,
      );
    if (kind === 'feedback')
      check(
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
          locationLoggerFeedbackReady
            ? locale === 'ja'
              ? '専用フィードバックは送信できます'
              : 'Dedicated feedback is available'
            : locale === 'ja'
              ? '現在は送信できません'
              : 'Submissions are not available yet',
        ),
        `${routePath}: intake status missing`,
      );
    if (kind === 'feedback' && locationLoggerFeedbackReady) {
      const expectedForm = locationLoggerFeedbackUrls[locale];
      const otherForm =
        locationLoggerFeedbackUrls[locale === 'ja' ? 'en' : 'ja'];
      check(
        tags(html, 'iframe').some(
          (iframe) => iframe.src === `${expectedForm}?embedded=true`,
        ),
        `${routePath}: matching embedded form missing`,
      );
      check(
        anchors.some((anchor) => anchor.href === expectedForm),
        `${routePath}: matching external form link missing`,
      );
      check(
        !otherForm || !raw.includes(otherForm),
        `${routePath}: other locale form leaked`,
      );
      check(
        !Object.values(formUrls).some((urls) =>
          Object.values(urls).some((url) => raw.includes(url)),
        ),
        `${routePath}: Focus or Contact form reused`,
      );
      check(
        !/<form\b|<input|<textarea/.test(html),
        `${routePath}: unexpected local input UI present`,
      );
      check(
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
          locale === 'ja'
            ? 'AI処理の現在の稼働は確認済みではなく'
            : 'Current AI operation has not been verified',
        ),
        `${routePath}: unverified AI status boundary missing`,
      );
    } else {
      check(
        !/<iframe|<form\b|<input|<textarea/.test(html),
        `${routePath}: unconfirmed input UI present`,
      );
      check(
        !/docs\.google\.com\/forms|forms\.gle/.test(raw),
        `${routePath}: unverified form URL present`,
      );
    }
    check(
      !/mailto:|apps\.apple\.com/.test(raw),
      `${routePath}: unverified email or Store URL`,
    );
    check(
      tags(html, 'img').length === 0,
      `${routePath}: unverified app imagery present`,
    );
    if (kind === 'support')
      check(
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
          locale === 'ja'
            ? '位置記録や端末情報を自動で付けることはありません'
            : 'will not automatically attach location records or device information',
        ),
        `${routePath}: voluntary Feedback boundary missing`,
      );
    if (kind === 'privacy')
      check(
        decodeHtml(html.replace(/<[^>]*>/g, '')).includes(
          locale === 'ja'
            ? '利用者が自分で送信する報告の取扱いは別です'
            : 'separate from handling a report you choose to send',
        ),
        `${routePath}: location records and voluntary report boundary missing`,
      );
    if (kind === 'feedback') {
      check(
        metaValues(meta, 'robots').some(
          (value) => value.includes('noindex') && value.includes('nofollow'),
        ),
        `${routePath}: missing noindex/nofollow`,
      );
      check(
        !links.some((link) => link.rel === 'canonical' || link.hreflang),
        `${routePath}: Feedback must not advertise indexing alternates`,
      );
    } else {
      locationLoggerIndexable.push(absoluteUrl(routePath));
      check(
        links.some(
          (link) =>
            link.rel === 'canonical' &&
            sameUrl(link.href, absoluteUrl(routePath)),
        ),
        `${routePath}: canonical mismatch`,
      );
      for (const language of locales)
        check(
          links.some(
            (link) =>
              link.hreflang === language &&
              sameUrl(link.href, absoluteUrl(appPath(kind, language))),
          ),
          `${routePath}: hreflang mismatch`,
        );
    }
    if (kind === 'support')
      check(
        linksTo(anchors, appPath('feedback')),
        `${routePath}: dedicated Feedback link missing`,
      );
    if (kind === 'app')
      check(
        !linksTo(anchors, appPath('feedback')),
        `${routePath}: introduction must route feedback via Support`,
      );
    for (const anchor of anchors) {
      const target = normalizedLink(anchor.href);
      if (target?.startsWith('/') && !target.includes('#') && target !== '/')
        check(
          publicRouteSet.has(target.endsWith('/') ? target : `${target}/`),
          `${routePath}: missing internal target ${target}`,
        );
    }
  }
  const contact = tags(
    markupOnly(await readFile(pageFile(`${prefix}/contact/`), 'utf8')),
    'a',
  );
  check(
    linksTo(contact, appPath('support')),
    `${prefix}/contact/: LocationLogger support missing`,
  );
  check(
    !linksTo(contact, appPath('feedback')),
    `${prefix}/contact/: direct LocationLogger Feedback link`,
  );
  const home = tags(
    markupOnly(await readFile(pageFile(`${prefix}/`), 'utf8')),
    'a',
  );
  check(
    linksTo(home, appPath('app')),
    `${prefix}/: LocationLogger introduction missing`,
  );
}

// All app families expose the same three sections, in the same order.
for (const locale of locales) {
  const prefix = locale === 'ja' ? '/apps' : '/apps/en';
  for (const appSlug of [slug, 'tsutawaru-moji', 'location-logger']) {
    for (const kind of ['app', 'support', 'privacy', 'feedback']) {
      const appRoute = `${prefix}/${kind === 'app' ? '' : `${kind}/`}${appSlug}/`;
      const html = markupOnly(await readFile(pageFile(appRoute), 'utf8'));
      const nav =
        html.match(
          /<nav\b[^>]*class="app-navigation"[^>]*>([\s\S]*?)<\/nav>/,
        )?.[1] ?? '';
      const navLinks = tags(nav, 'a');
      const expected = ['app', 'support', 'privacy'].map(
        (page) => `${prefix}/${page === 'app' ? '' : `${page}/`}${appSlug}/`,
      );
      check(
        navLinks.length === 3 &&
          navLinks.every((link, i) => linksTo([link], expected[i])),
        `${appRoute}: app navigation order differs`,
      );
      const current = navLinks.filter(
        (link) => link['aria-current'] === 'page',
      );
      check(
        kind === 'feedback'
          ? current.length === 0
          : current.length === 1 && linksTo(current, appRoute),
        `${appRoute}: current section marker differs`,
      );
    }
  }
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
  expected.push(...tsutawaruIndexable);
  expected.push(...locationLoggerIndexable);
  check(locations.length === 22, 'sitemap must contain exactly 22 URLs');
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
    'sitemap URL set differs from the 22 expected indexable routes',
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

const summary = `${requiredPages}/28 required pages; ${publicRouteSet.size} generated public routes; ${htmlFiles.length} HTML files; ${assertions} assertions`;
if (failures.length) {
  console.error(
    `GitHub Pages verification failed: ${failures.length} failure(s), ${summary}.`,
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`GitHub Pages verification passed: ${summary}.`);
}
