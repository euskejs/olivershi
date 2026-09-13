import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js', 'assets', 'robots.txt', 'sitemap.xml']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Static site built to dist/');
