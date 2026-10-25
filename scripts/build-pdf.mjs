import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const dist = resolve('dist');
const printPage = resolve(dist, 'print/index.html');

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(printPage).href);
  await page.pdf({
    path: resolve(dist, 'Prashant-Kumar-Resume.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
}

rmSync(resolve(dist, 'print'), { recursive: true, force: true });
console.log('Wrote dist/Prashant-Kumar-Resume.pdf');
