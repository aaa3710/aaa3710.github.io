import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { lstat, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { exportWordPress } from './wordpress-export.mjs';

const publicOrigin = 'https://aaa3710.github.io';

async function fixture(t, respond) {
  const requests = [];
  const server = createServer((request, response) => {
    requests.push({ url: request.url, cookie: request.headers.cookie });
    respond(request, response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const directory = await mkdtemp(
    path.join(os.tmpdir(), 'wordpress-export-test-'),
  );
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    directory,
    requests,
  };
}

function routeList() {
  const routes = [];
  for (const lang of ['ja', 'en']) {
    const prefix = lang === 'ja' ? '/apps/' : '/apps/en/';
    routes.push({ path: prefix, lang, indexable: true });
    routes.push({ path: `${prefix}contact/`, lang, indexable: true });
    routes.push({ path: `${prefix}card-relay/`, lang, indexable: false });
    for (const slug of [
      'focus-exposure-calculator',
      'tsutawaru-moji',
      'location-logger',
    ]) {
      for (const section of ['', 'support/', 'privacy/', 'feedback/']) {
        routes.push({
          path: `${prefix}${section}${slug}/`,
          lang,
          indexable: section !== 'feedback/',
        });
      }
    }
  }
  return routes;
}

test('exports the bilingual public site, all referenced assets, stable metadata and legacy routes without a login session', async (t) => {
  const routes = routeList();
  const assets = new Map([
    [
      '/assets/theme.css',
      [
        'text/css',
        '@import "./base.css"; @font-face{font-family:Example;src:url("./font.woff2?ver=1")} /*# sourceMappingURL=theme.css.map */',
      ],
    ],
    [
      '/assets/base.css',
      ['text/css', '.tile{background:url(../assets/bg.svg)}'],
    ],
    ['/assets/font.woff2', ['font/woff2', Buffer.from('fixture-font')]],
    [
      '/assets/bg.svg',
      [
        'image/svg+xml',
        '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v1z"/></svg>',
      ],
    ],
    [
      '/assets/icon.png',
      [
        'image/png',
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
          'base64',
        ),
      ],
    ],
    [
      '/assets/icon@2x.png',
      [
        'image/png',
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
          'base64',
        ),
      ],
    ],
    [
      '/assets/og.png',
      [
        'image/png',
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
          'base64',
        ),
      ],
    ],
    [
      '/assets/ui.js',
      [
        'text/javascript',
        'export { caption } from "./caption.js";\n//# sourceMappingURL=ui.js.map\n',
      ],
    ],
    [
      '/assets/caption.js',
      ['text/javascript', 'export const caption = "読みやすい文章";'],
    ],
    ['/assets/guide.pdf', ['application/pdf', Buffer.from('%PDF-1.7 fixture')]],
  ]);
  const state = await fixture(t, (request, response) => {
    const url = new URL(request.url, origin);
    const route = routes.find((entry) => entry.path === url.pathname);
    if (route) {
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': 'admin_session=must-not-be-forwarded; Path=/',
      });
      response.end(`<!doctype html><html lang="ja"><head><meta charset="utf-8">
        <link rel="https://api.w.org/" href="${origin}/wp-json/">
        <link rel="dns-prefetch" href="//localhost">
        <link rel="alternate" type="application/rss+xml" href="${origin}/feed/">
        <link rel="alternate" type="application/json" href="${origin}/wp-json/wp/v2/pages/7">
        <link rel="alternate" type="application/json+oembed" href="${origin}/wp-json/oembed/1.0/embed">
        <link rel="shortlink" href="${origin}/?p=42">
        <meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${origin}${route.path}">
        <link rel="alternate" hreflang="ja" href="${origin}/apps/">
        <link rel="alternate" hreflang="en" href="${publicOrigin}/apps/en/">
        <meta property="og:url" content="${origin}${route.path}">
        <meta property="og:image" content="${publicOrigin}/assets/og.png">
        <meta name="twitter:image" content="${publicOrigin}/assets/og.png">
        <link rel="stylesheet" href="${origin}/assets/theme.css?ver=1">
        <script type="module" src="${origin}/assets/ui.js"></script>
        <script type="speculationrules">{"prefetch":[{"source":"document","where":{"not":{"href_matches":"/wp-admin/*"}}}]}</script>
        </head><body><main style="background-image:url('${origin}/assets/bg.svg')">
        <h1>${route.lang === 'ja' ? 'アプリ' : 'Apps'}</h1>
        <a href="${origin}/apps/">日本語</a><a href="${origin}/apps/en/">English</a>
        <a href="https://apps.apple.com/jp/">App Store</a><a href="${origin}/assets/guide.pdf">PDF</a>
        <img src="${origin}/assets/icon.png" srcset="${origin}/assets/icon.png 1x, ${origin}/assets/icon@2x.png 2x" alt="">
        <details><summary>詳しく</summary><p>公開用の本文。</p></details></main></body></html>`);
      return;
    }
    const asset = assets.get(url.pathname);
    if (asset) {
      response.writeHead(200, { 'Content-Type': asset[0] });
      response.end(asset[1]);
      return;
    }
    response.writeHead(404).end();
  });
  const origin = state.origin;
  const output = path.join(state.directory, 'public');
  const result = await exportWordPress({
    origin,
    routes,
    output,
    publicOrigin,
  });
  assert.equal(result.pages, 30);
  assert.equal(result.indexablePages, 22);
  assert.equal(result.assets, assets.size);
  const english = await readFile(
    path.join(output, 'apps/en/index.html'),
    'utf8',
  );
  assert.match(english, /<html lang="en">/);
  assert.match(
    english,
    /rel="canonical" href="https:\/\/aaa3710\.github\.io\/apps\/en\/"/,
  );
  assert.match(
    english,
    /hreflang="ja" href="https:\/\/aaa3710\.github\.io\/apps\/"/,
  );
  assert.match(
    english,
    /srcset="\/assets\/icon\.png 1x, \/assets\/icon@2x\.png 2x"/,
  );
  assert.match(english, /content="index, follow"/);
  assert.match(
    english,
    /content="https:\/\/aaa3710\.github\.io\/assets\/og\.png"/,
  );
  assert.equal(
    await readFile(path.join(output, 'apps/en.html'), 'utf8'),
    english,
  );
  const feedback = await readFile(
    path.join(output, 'apps/feedback/location-logger/index.html'),
    'utf8',
  );
  assert.match(feedback, /content="noindex, nofollow"/);
  assert.doesNotMatch(feedback, /<link[^>]*(?:rel="canonical"|hreflang=)/);
  assert.match(feedback, /<a href="\/apps\/">日本語<\/a>/);
  assert.match(feedback, /<a href="\/apps\/en\/">English<\/a>/);
  const preparation = await readFile(
    path.join(output, 'apps/card-relay/index.html'),
    'utf8',
  );
  assert.match(preparation, /content="noindex, nofollow"/);
  assert.match(
    preparation,
    /rel="canonical" href="https:\/\/aaa3710\.github\.io\/apps\/card-relay\/"/,
  );
  assert.match(preparation, /hreflang="en"/);
  const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 22);
  assert.doesNotMatch(sitemap, /feedback|localhost|127\.0\.0\.1/);
  assert.match(
    await readFile(path.join(output, 'robots.txt'), 'utf8'),
    /Sitemap: https:\/\/aaa3710\.github\.io\/sitemap\.xml/,
  );
  assert.equal(await readFile(path.join(output, '.nojekyll'), 'utf8'), '');
  const notFound = await readFile(path.join(output, '404.html'), 'utf8');
  assert.match(notFound, /ページが見つかりません/);
  assert.match(notFound, /Page not found/);
  assert.match(notFound, /href="\/apps\/"/);
  assert.match(notFound, /href="\/apps\/en\/"/);
  assert.match(notFound, /noindex, nofollow/);
  assert.doesNotMatch(notFound, /http-equiv="refresh"/);
  assert.match(
    await readFile(path.join(output, 'index.html'), 'utf8'),
    /content="0;url=\/apps\/"/,
  );
  assert.match(
    await readFile(
      path.join(output, 'en/apps/location-logger/index.html'),
      'utf8',
    ),
    /url=\/apps\/en\/location-logger\//,
  );
  assert.match(
    await readFile(path.join(output, 'feedback/location-logger.html'), 'utf8'),
    /noindex, nofollow/,
  );
  const css = await readFile(path.join(output, 'assets/theme.css'), 'utf8');
  assert.match(css, /@import "\/assets\/base\.css"/);
  assert.match(css, /url\("\/assets\/font\.woff2"\)/);
  assert.doesNotMatch(css, /sourceMappingURL/);
  assert.match(
    await readFile(path.join(output, 'assets/ui.js'), 'utf8'),
    /from "\/assets\/caption\.js"/,
  );
  const manifestText = await readFile(
    path.join(output, 'export-manifest.json'),
    'utf8',
  );
  const manifest = JSON.parse(manifestText);
  assert(manifest.files.some((file) => file.path === '404.html'));
  assert(manifest.files.some((file) => file.path === 'assets/og.png'));
  assert(state.requests.some((request) => request.url === '/assets/og.png'));
  assert.doesNotMatch(
    manifestText + english,
    /admin_session|127\.0\.0\.1|wp-json|\?p=42/,
  );
  assert.doesNotMatch(
    english,
    /dns-prefetch|speculationrules|application\/rss\+xml/,
  );
  for (const file of manifest.files) {
    const bytes = await readFile(path.join(output, file.path));
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
    assert.doesNotMatch(
      file.path,
      /wp-admin|wp-json|database|\.php$|\.sqlite$|\.map$|focus-map/,
    );
  }
  assert(state.requests.every((request) => !request.cookie));
  assert(
    !state.requests.some((request) =>
      /wp-json|\.map|wp-admin|\.php/.test(request.url),
    ),
  );
  await assert.rejects(
    exportWordPress({ origin, routes, output, publicOrigin }),
    /already exists/,
  );
  assert.equal(
    await readFile(path.join(output, 'export-manifest.json'), 'utf8'),
    manifestText,
  );
});

test('rejects draft, management and live intake leakage before producing any export', async (t) => {
  let injected = '';
  let status = 200;
  const state = await fixture(t, (request, response) => {
    response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      `<!doctype html><html><head></head><body>${injected}</body></html>`,
    );
  });
  const routes = [{ path: '/apps/', lang: 'ja', indexable: true }];
  const cases = [
    [
      'draft-link',
      '<a href="/draft-page/">Unapproved draft</a>',
      /outside the approved route list/,
    ],
    [
      'preview-query',
      '<a href="/apps/?preview=true">Draft preview</a>',
      /Dynamic page query/,
    ],
    ['admin-link', '<a href="/wp-admin/">Manage</a>', /Private, dynamic/],
    [
      'rest-script',
      '<script src="/wp-json/wp/v2/pages"></script>',
      /Private, dynamic/,
    ],
    [
      'database-file',
      '<a href="/wp-content/database/.ht.sqlite">Backup</a>',
      /Hidden|Private, dynamic/,
    ],
    [
      'source-map',
      '<a href="/assets/theme.css.map">Source</a>',
      /Private, dynamic/,
    ],
    [
      'external-asset',
      '<img src="https://unapproved.example/image.png">',
      /External asset/,
    ],
    ['password-page', '<input name="post_password">', /password/],
    ['admin-bar', '<div id="wpadminbar">Admin</div>', /Editing/],
    ['php-form', '<form action="/wp-login.php"><input></form>', /form/],
    [
      'iframe-intake',
      '<iframe src="https://docs.google.com/forms/d/e/test/viewform"></iframe>',
      /embedded UI/,
    ],
    [
      'google-intake-link',
      '<a href="https://docs.google.com/forms/d/e/test/viewform">Send</a>',
      /intake is disabled/,
    ],
    [
      'google-intake-shortlink',
      '<a href="https://forms.gle/example">Send</a>',
      /intake is disabled/,
    ],
    [
      'dynamic-js',
      '<script>fetch("/wp-json/wp/v2/pages")</script>',
      /dynamic or authenticated/,
    ],
  ];
  for (const [name, html, expected] of cases) {
    await t.test(name, async () => {
      injected = html;
      const output = path.join(state.directory, name);
      await assert.rejects(
        exportWordPress({ origin: state.origin, routes, output, publicOrigin }),
        expected,
      );
      await assert.rejects(lstat(output), { code: 'ENOENT' });
    });
  }
  const beforeInvalidInput = state.requests.length;
  await assert.rejects(
    exportWordPress({
      origin: state.origin,
      publicOrigin,
      output: path.join(state.directory, 'input-draft'),
      routes: [{ ...routes[0], status: 'draft' }],
    }),
    /Draft\/password metadata/,
  );
  assert.equal(state.requests.length, beforeInvalidInput);
  status = 401;
  await assert.rejects(
    exportWordPress({
      origin: state.origin,
      routes,
      publicOrigin,
      output: path.join(state.directory, 'private-response'),
    }),
    /HTTP 200, received 401/,
  );
  assert(state.requests.every((request) => request.url === '/apps/'));
});
