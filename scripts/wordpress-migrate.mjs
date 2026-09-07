// One-time import only. Never run over an already imported editor database.
import { parse, serializeOuter } from 'parse5';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { jaModel } from 'budoux';
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'work/wordpress/migration');
const attr = (n, k) => n?.attrs?.find((a) => a.name === k)?.value;
const classes = (n) => attr(n, 'class') || '';
const hasClass = (n, c) => classes(n).split(' ').includes(c);
const children = (n) => n.childNodes || [];
const find = (n, predicate) =>
  predicate(n)
    ? n
    : children(n)
        .map((c) => find(c, predicate))
        .find(Boolean);
const text = (n) =>
  n.nodeName === '#text' ? n.value : children(n).map(text).join('');
const escape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
function inline(n) {
  if (n.nodeName === '#text') return escape(n.value);
  if (['wbr', 'svg', 'script'].includes(n.tagName) || n.nodeName === '#comment')
    return '';
  if (n.tagName === 'span') return children(n).map(inline).join('');
  if (
    ['strong', 'em', 'a', 'code', 'br', 's', 'sup', 'sub'].includes(n.tagName)
  ) {
    if (n.tagName === 'br') return '<br>';
    const attrs = (n.attrs || [])
      .filter((a) => ['href', 'target', 'rel'].includes(a.name))
      .map((a) => ` ${a.name}="${escape(a.value)}"`)
      .join('');
    return `<${n.tagName}${attrs}>${children(n).map(inline).join('')}</${n.tagName}>`;
  }
  return children(n).map(inline).join('');
}
function block(name, attrs, html = null) {
  const json = Object.keys(attrs).length
    ? ` ${JSON.stringify(attrs).replaceAll('--', '\\u002d\\u002d')}`
    : '';
  return html === null
    ? `<!-- wp:${name}${json} /-->\n`
    : `<!-- wp:${name}${json} -->\n${String(html)}\n<!-- /wp:${name} -->\n`;
}
function common(n) {
  return {
    ...(classes(n) ? { className: classes(n) } : {}),
    ...(attr(n, 'id') ? { anchor: attr(n, 'id') } : {}),
  };
}
function htmlAttrs(attrs, base = '') {
  const className = [base, attrs.className].filter(Boolean).join(' ');
  return `${className ? ` class="${escape(className)}"` : ''}${attrs.anchor ? ` id="${escape(attrs.anchor)}"` : ''}`;
}
function convert(n) {
  if (n.nodeName === '#text')
    return n.value.trim()
      ? block('paragraph', {}, `<p>${escape(n.value)}</p>`)
      : '';
  if (!n.tagName || ['script', 'wbr'].includes(n.tagName)) return '';
  if (hasClass(n, 'site-header') || hasClass(n, 'site-footer')) return '';
  if (hasClass(n, 'app-navigation'))
    return block('apps/navigation', { area: 'app' });
  const attrs = common(n);
  const content = () => children(n).map(convert).join('');
  if (/^h[1-6]$/.test(n.tagName))
    return block(
      'heading',
      { level: Number(n.tagName[1]), ...attrs },
      `<${n.tagName}${htmlAttrs(attrs, 'wp-block-heading')}>${inline(n)}</${n.tagName}>`,
    );
  if (n.tagName === 'p' || n.tagName === 'span')
    return block('paragraph', attrs, `<p${htmlAttrs(attrs)}>${inline(n)}</p>`);
  if (['ul', 'ol'].includes(n.tagName))
    return block(
      'list',
      { ...(n.tagName === 'ol' ? { ordered: true } : {}), ...attrs },
      `<${n.tagName}${htmlAttrs(attrs, 'wp-block-list')}>${content()}</${n.tagName}>`,
    );
  if (n.tagName === 'li') {
    const nested = children(n).filter((c) => ['ul', 'ol'].includes(c.tagName));
    const body = children(n)
      .filter((c) => !nested.includes(c))
      .map(inline)
      .join('');
    return block(
      'list-item',
      attrs,
      `<li${htmlAttrs(attrs)}>${body}${nested.map(convert).join('')}</li>`,
    );
  }
  if (n.tagName === 'img')
    return block(
      'image',
      attrs,
      `<figure${htmlAttrs(attrs, 'wp-block-image')}><img src="${escape(attr(n, 'src'))}" alt="${escape(attr(n, 'alt') || '')}"/></figure>`,
    );
  if (n.tagName === 'details') {
    const summary = children(n).find((c) => c.tagName === 'summary');
    return block(
      'details',
      attrs,
      `<details${htmlAttrs(attrs, 'wp-block-details')}><summary>${inline(summary)}</summary>${children(
        n,
      )
        .filter((c) => c !== summary)
        .map(convert)
        .join('')}</details>`,
    );
  }
  if (n.tagName === 'a') {
    if (hasClass(n, 'portfolio-card')) {
      const last = children(n).find((c) => hasClass(c, 'card-link'));
      const rest = children(n)
        .filter((c) => c !== last)
        .map(convert)
        .join('');
      const link = block(
        'paragraph',
        { className: 'card-link' },
        `<p class="card-link"><a href="${escape(attr(n, 'href'))}">${inline(last)}</a></p>`,
      );
      return block(
        'group',
        { ...attrs, layout: { type: 'default' } },
        `<div${htmlAttrs(attrs, 'wp-block-group')}>${rest}${link}</div>`,
      );
    }
    return block('paragraph', attrs, `<p${htmlAttrs(attrs)}>${inline(n)}</p>`);
  }
  if (n.tagName === 'svg') return block('html', {}, serializeOuter(n));
  if (['div', 'section', 'article', 'header', 'main'].includes(n.tagName)) {
    const tagName = n.tagName === 'main' ? 'div' : n.tagName;
    return block(
      'group',
      { tagName, ...attrs, layout: { type: 'default' } },
      `<${tagName}${htmlAttrs(attrs, 'wp-block-group')}>${content()}</${tagName}>`,
    );
  }
  if (n.tagName === 'hr')
    return block(
      'separator',
      {},
      '<hr class="wp-block-separator has-alpha-channel-opacity"/>',
    );
  throw new Error(`Unsupported content element: ${n.tagName}`);
}
async function files(dir) {
  return (
    await Promise.all(
      (
        await readdir(dir, { withFileTypes: true })
      ).map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      ),
    )
  ).flat();
}
await mkdir(output, { recursive: true });
const pages = [];
for (const file of (await files(path.join(root, 'dist/client/apps')))
  .filter((f) => f.endsWith('/index.html'))
  .sort()) {
  const route =
    '/' +
    path
      .relative(path.join(root, 'dist/client'), file)
      .replace(/index.html$/, '');
  const doc = parse(await readFile(file, 'utf8'));
  const main = find(doc, (n) => n.tagName === 'main');
  if (!main) throw new Error(`Missing main: ${route}`);
  const title = text(find(doc, (n) => n.tagName === 'title'));
  const description =
    attr(
      find(
        doc,
        (n) => n.tagName === 'meta' && attr(n, 'name') === 'description',
      ),
      'content',
    ) || '';
  const noindex = /noindex/.test(
    attr(
      find(doc, (n) => n.tagName === 'meta' && attr(n, 'name') === 'robots'),
      'content',
    ) || '',
  );
  const content = children(main).map(convert).join('');
  pages.push({
    path: route,
    title,
    description,
    content,
    lang: route.startsWith('/apps/en/') ? 'en' : 'ja',
    indexable: !noindex,
  });
}
await writeFile(
  path.join(output, 'pages.json'),
  JSON.stringify(pages, null, 2) + '\n',
);
await writeFile(
  path.join(output, 'routes.json'),
  JSON.stringify(
    pages.map(({ path, lang, indexable }) => ({ path, lang, indexable })),
    null,
    2,
  ) + '\n',
);
await mkdir(path.join(root, 'wordpress/theme/assets'), { recursive: true });
const css = await readFile(path.join(root, 'app/globals.css'), 'utf8');
await writeFile(
  path.join(root, 'wordpress/theme/assets/site.css'),
  css.slice(css.indexOf(':root {')),
);
await writeFile(
  path.join(root, 'wordpress/plugin/budoux-ja.json'),
  JSON.stringify(jaModel) + '\n',
);
console.log(
  `Prepared ${pages.length} editable pages; ${pages.filter((p) => p.indexable).length} indexable routes.`,
);
