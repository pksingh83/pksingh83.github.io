// Regenerates public/og.png. Run: node scripts/build-og.mjs
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const html = `<!doctype html><html><body style="margin:0;width:1200px;height:630px;background:#1e1e2e;color:#cdd6f4;font-family:ui-monospace,Menlo,monospace;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;position:relative;overflow:hidden">
<div style="position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 0%,rgba(203,166,247,0.2),transparent 70%)"></div>
<div style="position:relative;font-size:30px;color:#a6adc8"><span style="color:#cba6f7">$ whoami</span> → Prashant Kumar</div>
<div style="position:relative;font-size:68px;line-height:1.15;margin-top:28px;font-weight:500">Senior Technical Manager &amp; Full-Stack .NET Architect</div>
<div style="position:relative;font-size:28px;color:#a6adc8;margin-top:32px">.NET · Azure · AWS · AI-driven automation · Mumbai, India</div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: resolve('public/og.png') });
} finally {
  await browser.close();
}
console.log('Wrote public/og.png');
