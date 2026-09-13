import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import chat from '../api/chat.js';
const root = resolve(process.argv[2] || '.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/chat') return await chat(req, res);
    if (!(pathname === '/' || ['/index.html', '/styles.css', '/script.js', '/robots.txt', '/sitemap.xml'].includes(pathname) || /^\/assets\/[a-zA-Z0-9_-]+\.(svg|jpg|png|webp)$/.test(pathname))) { res.writeHead(404); res.end('Not found'); return; }
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('Preview: http://localhost:3000'));
