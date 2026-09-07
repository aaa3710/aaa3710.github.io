import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  rmdir,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';

const ASSET_EXTENSIONS = new Set([
  '.css',
  '.js',
  '.mjs',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
  '.mp4',
  '.webm',
  '.mp3',
  '.ogg',
  '.wav',
  '.pdf',
  '.json',
]);
const MAX_FILE_BYTES = 64 * 1024 * 1024;
const MAX_TOTAL_BYTES = 256 * 1024 * 1024;
const MAX_ASSETS = 2000;
const DISCOVERY_RELS = new Set([
  'https://api.w.org/',
  'shortlink',
  'edituri',
  'wlwmanifest',
  'pingback',
  'dns-prefetch',
  'preconnect',
  'prefetch',
  'prerender',
]);
const DISCOVERY_TYPES = new Set([
  'application/rss+xml',
  'application/atom+xml',
  'application/json',
]);
const NAMESPACE_URLS = new Set([
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1999/xlink',
  'http://www.w3.org/1999/xhtml',
]);

function fail(message) {
  throw new Error(`WordPress export: ${message}`);
}

function hasControlCharacters(value) {
  return [...value].some(
    (character) =>
      character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  );
}

function originUrl(value, local) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail('A valid origin is required.');
  }
  if (
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    fail('Origins must not contain credentials, paths, queries, or fragments.');
  }
  if (local) {
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    ) {
      fail('--origin must be a local loopback WordPress server.');
    }
  } else if (url.protocol !== 'https:') {
    fail('--public-origin must use HTTPS.');
  }
  return url;
}

function safePathname(value) {
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    fail('Invalid URL path encoding.');
  }
  if (
    !decoded.startsWith('/') ||
    decoded.includes('\\') ||
    hasControlCharacters(decoded) ||
    /%[0-9a-f]{2}/i.test(decoded)
  ) {
    fail('Unsafe URL path.');
  }
  const segments = decoded.split('/').filter(Boolean);
  if (segments.some((part) => part.startsWith('.')) || /%2f|%5c/i.test(value))
    fail('Hidden or encoded path is not exportable.');
  if (
    /(?:^|\/)(?:wp-admin|wp-json|database|backups?|node_modules)(?:\/|$)/i.test(
      decoded,
    ) ||
    /\.(?:php\d*|phtml|phar|sql|sqlite\d*|db|map|zip|gz|tar|log|ini|env|md|tsx?|jsx)(?:\/|$)/i.test(
      decoded,
    ) ||
    /(?:^|\/)(?:editor|block-editor)(?:\.min)?\.js$/i.test(decoded) ||
    /(?:^|\/)focus-map(?:\/|$)/i.test(decoded)
  ) {
    fail(
      `Private, dynamic, source, or retired path is not exportable: ${value}`,
    );
  }
  return decoded;
}

function normalizeRoutes(input) {
  if (!Array.isArray(input) || input.length === 0)
    fail('Routes must be a non-empty array.');
  const seen = new Set();
  return input.map((route) => {
    if (
      !route ||
      typeof route !== 'object' ||
      Array.isArray(route) ||
      Object.keys(route).some(
        (key) => !['path', 'lang', 'indexable'].includes(key),
      ) ||
      typeof route.path !== 'string' ||
      !['ja', 'en'].includes(route.lang) ||
      typeof route.indexable !== 'boolean'
    ) {
      fail(
        'Every route must contain only path, lang (ja/en), and indexable (boolean). Draft/password metadata must not enter the public list.',
      );
    }
    if (!/^\/(?:[a-z0-9-]+\/)*$/.test(route.path))
      fail('Routes must be clean, lowercase paths with a trailing slash.');
    safePathname(route.path);
    if (seen.has(route.path)) fail(`Duplicate route: ${route.path}`);
    if (/\/(?:feedback)\//.test(route.path) && route.indexable)
      fail('Feedback pages must remain noindex.');
    seen.add(route.path);
    return { path: route.path, lang: route.lang, indexable: route.indexable };
  });
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function setAttribute(node, name, value) {
  const item = node.attrs.find((entry) => entry.name === name);
  if (item) item.value = value;
  else node.attrs.push({ name, value });
}

function elements(node, result = []) {
  if (node.tagName) result.push(node);
  for (const child of node.childNodes ?? []) elements(child, result);
  if (node.content) elements(node.content, result);
  return result;
}

function removeNode(node) {
  const children = node.parentNode?.childNodes;
  if (children) children.splice(children.indexOf(node), 1);
}

function addElement(parent, tagName, attrs) {
  const node = {
    nodeName: tagName,
    tagName,
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    attrs: Object.entries(attrs).map(([name, value]) => ({ name, value })),
    childNodes: [],
    parentNode: parent,
  };
  parent.childNodes.push(node);
  return node;
}

function textContent(node) {
  return (node.childNodes ?? []).map((child) => child.value ?? '').join('');
}

function setText(node, value) {
  node.childNodes = [{ nodeName: '#text', value, parentNode: node }];
}

function xml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;');
}

function withoutSourceMaps(text) {
  return text
    .replace(/\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\//gi, '')
    .replace(/\/\/[#@]\s*sourceMappingURL=[^\r\n]*/gi, '');
}

function decodeCss(value) {
  return value.replace(
    /\\([0-9a-f]{1,6})\s?|\\([^\r\n])/gi,
    (_, hex, literal) =>
      hex ? String.fromCodePoint(parseInt(hex, 16)) : literal,
  );
}

// Match JavaScript strings and comments separately so URLs inside strings are
// never lost to a naive // comment remover. Unsupported network code fails shut.
function codeWithoutComments(source) {
  return source.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g,
    (whole, string) => string ?? ' ',
  );
}

function legacyRoute(route) {
  if (!route.startsWith('/apps/')) return null;
  const english = route.startsWith('/apps/en/');
  const suffix = route.slice(english ? '/apps/en/'.length : '/apps/'.length);
  if (!suffix) return english ? '/en/' : '/';
  if (/^(?:support|privacy|feedback|contact)\//.test(suffix))
    return `${english ? '/en' : ''}/${suffix}`;
  if (english) return `/en/apps/${suffix}`;
  return null;
}

function redirectHtml(route, lang) {
  const english = lang === 'en';
  const label = english ? 'Open the new page' : '新しいページを開く';
  const title = english ? 'This page has moved' : 'ページの場所が変わりました';
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0;url=${route}"></head><body><p><a href="${route}">${label}</a></p></body></html>\n`;
}

export async function exportWordPress({
  origin,
  routes: routeInput,
  output,
  publicOrigin,
}) {
  const sourceOrigin = originUrl(origin, true).origin;
  const destinationOrigin = originUrl(publicOrigin, false).origin;
  if (sourceOrigin === destinationOrigin)
    fail('Editing and public origins must differ.');
  const routes = normalizeRoutes(routeInput);
  const routeSet = new Set(routes.map((route) => route.path));
  if (typeof output !== 'string' || !output.trim())
    fail('An output directory is required.');
  const outputDirectory = path.resolve(output);
  try {
    await lstat(outputDirectory);
    fail(
      'The output directory already exists; choose a new directory. Existing exports are never overwritten.',
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const files = new Map();
  const assets = new Map();
  const importMap = new Map();
  let totalBytes = 0;
  let stage;

  function localize(text) {
    return text
      .replaceAll(sourceOrigin, '')
      .replaceAll(sourceOrigin.replaceAll('/', '\\/'), '');
  }

  function resolveReference(value, base) {
    if (
      typeof value !== 'string' ||
      hasControlCharacters(value) ||
      value.includes('\\')
    )
      fail('Unsafe reference in public HTML or assets.');
    let url;
    try {
      url = new URL(value, base);
    } catch {
      fail('Invalid URL reference.');
    }
    if (url.username || url.password)
      fail('Credentials must never appear in a public reference.');
    if (!['http:', 'https:'].includes(url.protocol))
      fail(`Unsupported URL scheme: ${url.protocol}`);
    safePathname(url.pathname);
    return url;
  }

  function routeReference(value, base, absolute = false) {
    if (!value || value.startsWith('#')) return value;
    if (/^mailto:|^tel:/i.test(value)) {
      if (absolute) fail('Page metadata requires a public page URL.');
      return value;
    }
    const url = resolveReference(value, base);
    if (
      (url.hostname === 'docs.google.com' &&
        url.pathname.startsWith('/forms/')) ||
      ['forms.gle', 'forms.google.com'].includes(url.hostname)
    ) {
      fail('Google Forms intake is disabled for this export.');
    }
    if (![sourceOrigin, destinationOrigin].includes(url.origin)) {
      if (absolute)
        fail('Canonical/hreflang metadata points outside the public site.');
      return url.href;
    }
    if (url.search)
      fail(`Dynamic page query is not exportable: ${url.pathname}`);
    const routePath = url.pathname.endsWith('/')
      ? url.pathname
      : `${url.pathname}/`;
    if (!routeSet.has(routePath))
      fail(`Internal page is outside the approved route list: ${url.pathname}`);
    return `${absolute ? destinationOrigin : ''}${routePath}${url.hash}`;
  }

  function assetReference(value, base) {
    if (!value || value.startsWith('#')) return value;
    if (/^data:/i.test(value)) {
      if (
        !/^data:(?:image\/(?:png|jpeg|gif|webp|avif|svg\+xml)|font\/[a-z0-9.+-]+|application\/(?:font-woff|vnd\.ms-fontobject))[;,]/i.test(
          value,
        )
      ) {
        fail('Only embedded image/font data is supported.');
      }
      return value;
    }
    const url = resolveReference(value, base);
    if (url.origin !== sourceOrigin)
      fail(
        `External asset is not approved for copying: ${url.origin}${url.pathname}`,
      );
    if ([...url.searchParams.keys()].some((key) => key !== 'ver'))
      fail(`Dynamic asset query is not exportable: ${url.pathname}`);
    const extension = path.posix.extname(url.pathname).toLowerCase();
    if (!ASSET_EXTENSIONS.has(extension))
      fail(`Unsupported asset type: ${url.pathname}`);
    const requestUrl = `${url.origin}${url.pathname}${url.search}`;
    const previous = assets.get(url.pathname);
    if (previous && previous !== requestUrl)
      fail(`Conflicting versions of asset: ${url.pathname}`);
    assets.set(url.pathname, requestUrl);
    if (assets.size > MAX_ASSETS) fail('Asset count limit exceeded.');
    return `${url.pathname}${url.hash}`;
  }

  function css(text, base) {
    const source = withoutSourceMaps(text);
    return source.replace(
      /url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\s*\)|@import\s+(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/gi,
      (
        whole,
        doubleQuoted,
        singleQuoted,
        unquoted,
        doubleImport,
        singleImport,
      ) => {
        const imported = doubleImport ?? singleImport;
        const reference = decodeCss(
          (imported ?? doubleQuoted ?? singleQuoted ?? unquoted).trim(),
        );
        const target = assetReference(reference, base).replaceAll('"', '%22');
        return imported === undefined
          ? `url("${target}")`
          : `@import "${target}"`;
      },
    );
  }

  function javascript(text, base) {
    let source = withoutSourceMaps(text);
    const code = codeWithoutComments(source);
    if (
      /\b(?:fetch|apiFetch)\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource)\b|\.(?:sendBeacon|ajax|getJSON)\s*\(/.test(
        code,
      ) ||
      /(?:wp-json|wp-admin|admin-ajax\.php|wp-login\.php|_wpnonce)/i.test(code)
    ) {
      fail(
        'A script still requires a dynamic or authenticated network operation.',
      );
    }
    if (/\bimport\s*\(\s*(?!["'])[^\s]/.test(code))
      fail(
        'Non-literal JavaScript imports require an explicit static adapter.',
      );
    const mapImport = (specifier) => {
      if (!/^(?:[./]|https?:|\/\/)/i.test(specifier)) {
        if (!importMap.has(specifier))
          fail(`Unresolved JavaScript import: ${specifier}`);
        return specifier;
      }
      return assetReference(specifier, base);
    };
    source = source.replace(
      /\b((?:import|export)\s+(?:[^'";]*?\s+from\s*)?)(["'])([^'"\r\n]+)\2/g,
      (_, prefix, quote, specifier) =>
        `${prefix}${quote}${mapImport(specifier)}${quote}`,
    );
    source = source.replace(
      /\bimport\s*\(\s*(["'])([^'"\r\n]+)\1\s*\)/g,
      (_, quote, specifier) =>
        `import(${quote}${mapImport(specifier)}${quote})`,
    );
    for (const match of code.matchAll(/https?:\/(?:\/|\\\/)[^\s"'`<>]+/g)) {
      const value = match[0].replaceAll('\\/', '/');
      if (NAMESPACE_URLS.has(value)) continue;
      const url = resolveReference(value, base);
      if (url.origin !== sourceOrigin)
        fail(
          `A script contains an external URL requiring review: ${url.origin}${url.pathname}`,
        );
      if (ASSET_EXTENSIONS.has(path.posix.extname(url.pathname).toLowerCase()))
        assetReference(value, base);
      else routeReference(value, base);
    }
    return localize(source);
  }

  async function fetchPublic(url, html = false) {
    const response = await fetch(url, {
      redirect: 'manual',
      credentials: 'omit',
      headers: { Accept: html ? 'text/html' : '*/*' },
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status !== 200)
      fail(
        `Expected HTTP 200, received ${response.status}: ${new URL(url).pathname}`,
      );
    if (Number(response.headers.get('content-length')) > MAX_FILE_BYTES)
      fail('Resource exceeds the export size limit.');
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      totalBytes += chunk.length;
      if (bytes > MAX_FILE_BYTES || totalBytes > MAX_TOTAL_BYTES)
        fail('Export size limit exceeded.');
      chunks.push(chunk);
    }
    const contentType = (response.headers.get('content-type') ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    if (html && contentType !== 'text/html')
      fail('A public page did not return HTML.');
    if (!html && (contentType === 'text/html' || !contentType))
      fail(
        `Asset returned HTML or an unknown content type: ${new URL(url).pathname}`,
      );
    return { bytes: Buffer.concat(chunks), contentType };
  }

  function save(relativePath, bytes) {
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
    if (files.has(relativePath)) fail(`Output path collision: ${relativePath}`);
    files.set(relativePath, buffer);
  }

  function savePage(routePath, html) {
    save(`${routePath.slice(1)}index.html`, html);
    if (routePath !== '/') save(`${routePath.slice(1, -1)}.html`, html);
  }

  function transformHtml(source, route) {
    const base = `${sourceOrigin}${route.path}`;
    const feedback = route.path.includes('/feedback/');
    const document = parse(source);
    const nodes = elements(document);
    const html = nodes.find((node) => node.tagName === 'html');
    const head = nodes.find((node) => node.tagName === 'head');
    setAttribute(html, 'lang', route.lang);
    for (const node of nodes) {
      const tag = node.tagName;
      const rel = (attribute(node, 'rel') ?? '').toLowerCase();
      const type = (attribute(node, 'type') ?? '').toLowerCase();
      const id = attribute(node, 'id') ?? '';
      const className = attribute(node, 'class') ?? '';
      if (
        ['form', 'iframe', 'object', 'embed', 'base'].includes(tag) ||
        id === 'wpadminbar' ||
        /(?:^|\s)(?:wp-admin|post-password-form)(?:\s|$)/.test(className) ||
        attribute(node, 'name') === 'post_password'
      ) {
        fail(
          `Editing, password, form, or embedded UI appeared on a public page: ${route.path}`,
        );
      }
      if (tag === 'meta' && attribute(node, 'http-equiv'))
        fail(`HTTP-equivalent metadata requires review: ${route.path}`);
      if (
        (tag === 'link' &&
          (DISCOVERY_RELS.has(rel) ||
            type.includes('+oembed') ||
            (rel === 'alternate' && DISCOVERY_TYPES.has(type)))) ||
        (tag === 'script' && type === 'speculationrules') ||
        (tag === 'meta' &&
          ['generator', 'robots'].includes(
            (attribute(node, 'name') ?? '').toLowerCase(),
          )) ||
        (tag === 'link' && rel === 'canonical') ||
        (feedback && tag === 'link' && attribute(node, 'hreflang'))
      ) {
        removeNode(node);
        continue;
      }
      for (const item of node.attrs ?? []) {
        if (
          /^on/i.test(item.name) ||
          ['srcdoc', 'action', 'formaction', 'ping'].includes(item.name)
        ) {
          fail(
            `Inline actions or dynamic requests require review: ${route.path}`,
          );
        }
      }
      if (attribute(node, 'style'))
        setAttribute(node, 'style', css(attribute(node, 'style'), base));
      if (tag === 'style') setText(node, css(textContent(node), base));
      if (tag === 'script' && type === 'importmap') {
        let data;
        try {
          data = JSON.parse(textContent(node));
        } catch {
          fail('Invalid JavaScript import map.');
        }
        if (Object.keys(data).some((key) => key !== 'imports'))
          fail(
            'Scoped or extended import maps require an explicit static adapter.',
          );
        for (const [key, value] of Object.entries(data.imports ?? {})) {
          const target = assetReference(value, base);
          if (importMap.has(key) && importMap.get(key) !== target)
            fail('Conflicting JavaScript import maps.');
          importMap.set(key, target);
          data.imports[key] = target;
        }
        setText(node, JSON.stringify(data));
      } else if (tag === 'script' && !attribute(node, 'src')) {
        if (type === 'application/ld+json' || type === 'application/json') {
          let data;
          try {
            data = JSON.parse(textContent(node));
          } catch {
            fail('Invalid inline JSON.');
          }
          setText(
            node,
            JSON.stringify(data).replaceAll(sourceOrigin, destinationOrigin),
          );
        } else if (
          !type ||
          ['module', 'text/javascript', 'application/javascript'].includes(type)
        ) {
          setText(node, javascript(textContent(node), base));
        } else fail('Unsupported inline script type.');
      }
      for (const name of ['src', 'poster']) {
        const value = attribute(node, name);
        if (value) setAttribute(node, name, assetReference(value, base));
      }
      for (const name of ['srcset', 'imagesrcset']) {
        const value = attribute(node, name);
        if (!value) continue;
        if (/data:/i.test(value))
          fail('Embedded data in srcset requires explicit normalization.');
        const candidates = value.split(',').map((candidate) => {
          const match = candidate
            .trim()
            .match(/^(\S+)(\s+(?:\d+w|\d+(?:\.\d+)?x))?$/);
          if (!match) fail('Unsupported srcset syntax.');
          return `${assetReference(match[1], base)}${match[2] ?? ''}`;
        });
        setAttribute(node, name, candidates.join(', '));
      }
      const href = attribute(node, 'href');
      if (href) {
        if (tag === 'a' || tag === 'area') {
          const url = /^https?:|^\/|^\./i.test(href)
            ? new URL(href, base)
            : null;
          const isDownload =
            url?.origin === sourceOrigin &&
            ASSET_EXTENSIONS.has(
              path.posix.extname(url.pathname).toLowerCase(),
            );
          setAttribute(
            node,
            'href',
            isDownload
              ? assetReference(href, base)
              : routeReference(href, base),
          );
        } else if (tag === 'link' && attribute(node, 'hreflang')) {
          setAttribute(node, 'href', routeReference(href, base, true));
        } else if (
          tag === 'link' &&
          rel
            .split(/\s+/)
            .some((part) =>
              [
                'stylesheet',
                'icon',
                'apple-touch-icon',
                'preload',
                'modulepreload',
                'mask-icon',
              ].includes(part),
            )
        ) {
          setAttribute(node, 'href', assetReference(href, base));
        } else if (tag === 'use' || tag === 'image') {
          setAttribute(node, 'href', assetReference(href, base));
        } else if (tag === 'link')
          fail(`Unsupported linked resource (${rel}): ${route.path}`);
      }
      if (tag === 'meta') {
        const property = (
          attribute(node, 'property') ??
          attribute(node, 'name') ??
          ''
        ).toLowerCase();
        const content = attribute(node, 'content');
        if (content && ['og:url', 'twitter:url'].includes(property))
          setAttribute(node, 'content', `${destinationOrigin}${route.path}`);
        if (
          content &&
          [
            'og:image',
            'og:image:url',
            'og:image:secure_url',
            'twitter:image',
            'twitter:image:src',
          ].includes(property)
        ) {
          // Public metadata deliberately names GitHub Pages. Fetch the matching
          // local image, never the live public website, when preparing a release.
          const imageUrl = resolveReference(content, base);
          const localImage =
            imageUrl.origin === destinationOrigin
              ? `${sourceOrigin}${imageUrl.pathname}${imageUrl.search}${imageUrl.hash}`
              : content;
          const target = assetReference(localImage, base);
          setAttribute(
            node,
            'content',
            target.startsWith('/') ? `${destinationOrigin}${target}` : target,
          );
        }
      }
    }
    if (!feedback) {
      addElement(head, 'link', {
        rel: 'canonical',
        href: `${destinationOrigin}${route.path}`,
      });
    }
    addElement(head, 'meta', {
      name: 'robots',
      content: route.indexable ? 'index, follow' : 'noindex, nofollow',
    });
    return `${localize(serialize(document))}\n`;
  }

  // No destination is written until every page/resource has passed validation.
  for (const route of routes) {
    const response = await fetchPublic(`${sourceOrigin}${route.path}`, true);
    savePage(route.path, transformHtml(response.bytes.toString('utf8'), route));
  }
  for (const [assetPath, requestUrl] of assets) {
    const response = await fetchPublic(requestUrl);
    const extension = path.posix.extname(assetPath).toLowerCase();
    let content = response.bytes;
    if (extension === '.css') {
      if (response.contentType !== 'text/css')
        fail(`CSS has an unexpected content type: ${assetPath}`);
      content = localize(css(content.toString('utf8'), requestUrl));
    } else if (extension === '.js' || extension === '.mjs') {
      if (
        ![
          'application/javascript',
          'text/javascript',
          'application/x-javascript',
        ].includes(response.contentType)
      )
        fail(`JavaScript has an unexpected content type: ${assetPath}`);
      content = javascript(content.toString('utf8'), requestUrl);
    } else if (extension === '.svg') {
      const svg = content.toString('utf8');
      const hasExternalCss = [
        ...svg.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi),
      ].some(
        (match) => !(match[1] ?? match[2] ?? match[3]).trim().startsWith('#'),
      );
      if (
        hasExternalCss ||
        /<(?:script|foreignObject|animate|set)\b|<!ENTITY|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["'](?!#|data:)|@import/i.test(
          svg,
        )
      )
        fail(`SVG contains active or external references: ${assetPath}`);
    } else if (extension === '.json') {
      try {
        JSON.parse(content.toString('utf8'));
      } catch {
        fail(`Invalid JSON asset: ${assetPath}`);
      }
      content = localize(content.toString('utf8'));
    }
    save(safePathname(assetPath).slice(1), content);
  }
  let redirects = 0;
  for (const route of routes) {
    const legacy = legacyRoute(route.path);
    if (!legacy) continue;
    savePage(legacy, redirectHtml(route.path, route.lang));
    redirects += 1;
  }
  const indexable = routes.filter((route) => route.indexable);
  save('.nojekyll', '');
  save(
    'robots.txt',
    `User-agent: *\nAllow: /\n\nSitemap: ${destinationOrigin}/sitemap.xml\n`,
  );
  save(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((route) => `  <url><loc>${xml(destinationOrigin + route.path)}</loc></url>`).join('\n')}\n</urlset>\n`,
  );
  save(
    '404.html',
    '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ページが見つかりません / Page not found</title><meta name="robots" content="noindex, nofollow"></head><body><main><h1>ページが見つかりません</h1><p lang="en">Page not found</p><p><a href="/apps/">アプリ一覧へ</a></p><p lang="en"><a href="/apps/en/">Browse apps</a></p></main></body></html>\n',
  );
  const manifest = {
    version: 1,
    publicOrigin: destinationOrigin,
    routes,
    files: [...files]
      .sort(([a], [b]) => a.localeCompare(b, 'en'))
      .map(([file, bytes]) => ({
        path: file,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })),
  };
  save('export-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
  try {
    await mkdir(path.dirname(outputDirectory), { recursive: true });
    stage = await mkdtemp(
      path.join(path.dirname(outputDirectory), '.wordpress-export-'),
    );
    for (const [file, bytes] of files) {
      const destination = path.join(stage, file);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes, { flag: 'wx' });
    }
    // Atomically reserve a previously absent destination after all validation.
    // rename alone could overwrite an empty directory created by another task.
    try {
      await mkdir(outputDirectory);
    } catch (error) {
      if (error.code === 'EEXIST')
        fail('Output appeared during export; refusing to replace it.');
      throw error;
    }
    try {
      await rename(stage, outputDirectory);
    } catch (error) {
      // Only remove our empty reservation, never another process's files.
      await rmdir(outputDirectory).catch(() => {});
      throw error;
    }
    stage = undefined;
  } finally {
    if (stage) await rm(stage, { recursive: true, force: true });
  }
  return {
    output: outputDirectory,
    pages: routes.length,
    indexablePages: indexable.length,
    assets: assets.size,
    redirects,
    files: files.size,
  };
}

async function main() {
  const flags = new Map();
  const args = process.argv.slice(2);
  const allowed = ['--origin', '--routes', '--output', '--public-origin'];
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    if (
      !allowed.includes(flag) ||
      flags.has(flag) ||
      !args[index + 1] ||
      args[index + 1].startsWith('--')
    ) {
      fail(
        'Usage: --origin <loopback origin> --routes <JSON file> --output <new directory> --public-origin <HTTPS origin>',
      );
    }
    flags.set(flag, args[index + 1]);
  }
  if (flags.size !== allowed.length)
    fail('All four export arguments are required.');
  const routes = JSON.parse(await readFile(flags.get('--routes'), 'utf8'));
  const result = await exportWordPress({
    origin: flags.get('--origin'),
    routes,
    output: flags.get('--output'),
    publicOrigin: flags.get('--public-origin'),
  });
  console.log(JSON.stringify(result));
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
