// Local-only SPA proof server; never logs request URLs or invitation tokens.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
};
createServer(async (req, res) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const path = resolve(
      root,
      '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname),
    );
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    let file = path === root ? resolve(root, 'index.html') : path;
    try {
      if (!(await stat(file)).isFile()) throw Error();
    } catch {
      if (!extname(path) && req.headers.accept?.includes('text/html'))
        file = resolve(root, 'index.html');
      else {
        res.writeHead(404).end();
        return;
      }
    }
    res.setHeader(
      'Content-Type',
      types[extname(file)] ?? 'application/octet-stream',
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(400).end('Invalid request');
  }
}).listen(4173, '127.0.0.1', () =>
  console.log('Local preview ready on port 4173'),
);
