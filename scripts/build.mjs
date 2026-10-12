import { cpSync, mkdirSync, rmSync } from 'node:fs';

const files = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'assets/maxima-logo.svg',
  'assets/maxima-enterprise-social-preview.png',
  'assets/hellman-friedman-logo.png',
  'assets/permira-logo.png',
  'assets/workflow-visuals.css',
  'assets/workflow-visuals.js',
  'fonts/SaansVF.woff2',
  'fonts/martina-plantijn-light.woff2',
  'fonts/roboto-mono-latin-wght-normal.woff2',
  'res/short-pay-comparison.html',
];

rmSync('dist', { recursive: true, force: true });
for (const file of files) {
  const destination = `dist/${file}`;
  mkdirSync(destination.slice(0, destination.lastIndexOf('/')), { recursive: true });
  cpSync(file, destination);
}
