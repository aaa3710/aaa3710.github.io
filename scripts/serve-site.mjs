import { createServer } from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
const root = await realpath(
  path.resolve(process.env.STATIC_SITE_DIRECTORY || 'site-output'),
);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};
createServer(async (req, res) => {
  try {
    let candidate = path.resolve(
      root,
      '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname),
    );
    if (candidate !== root && !candidate.startsWith(root + path.sep))
      throw new Error('Outside public output');
    if ((await stat(candidate)).isDirectory())
      candidate = path.join(candidate, 'index.html');
    const actual = await realpath(candidate);
    if (!actual.startsWith(root + path.sep))
      throw new Error('Outside public output');
    const bytes = await readFile(actual);
    res
      .writeHead(200, {
        'Content-Type':
          mime[path.extname(actual)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      .end(bytes);
  } catch {
    res
      .writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(await readFile(path.join(root, '404.html')));
  }
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () =>
  console.log(
    'Site preview: http://localhost:' + (process.env.PORT || 3000) + '/apps/',
  ),
);
