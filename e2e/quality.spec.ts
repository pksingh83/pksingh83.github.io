import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const width of [360, 768, 1920]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });

  test('shows the content and the section links still work', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Senior Technical Manager');
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
  });
});

for (const theme of ['dark', 'light', 'system']) {
  test(`has no serious accessibility violations in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

const mocha = { background: 'rgb(30, 30, 46)', text: 'rgb(205, 214, 244)' };
const latte = { background: 'rgb(239, 241, 245)', text: 'rgb(76, 79, 105)' };

for (const [theme, osScheme, expected] of [
  ['dark', 'light', mocha],
  ['dark', 'dark', mocha],
  ['light', 'dark', latte],
  ['light', 'light', latte],
  ['system', 'light', latte],
  ['system', 'dark', mocha],
] as const) {
  test(`${theme} theme with an OS set to ${osScheme} paints the ${expected === mocha ? 'Mocha' : 'Latte'} palette`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: osScheme });
    const page = await context.newPage();
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto('/');
    const painted = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return { background: style.backgroundColor, text: style.color };
    });
    expect(painted).toEqual(expected);
    await context.close();
  });
}

test('button and nav link colors come from their own classes, not the base link color', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/');
  const colors = (locator: ReturnType<typeof page.locator>) =>
    locator.evaluate((el) => {
      const style = getComputedStyle(el);
      return { color: style.color, background: style.backgroundColor };
    });

  const primary = await colors(page.locator('#hero').getByRole('link', { name: 'Get in touch' }));
  expect(primary).toEqual({ color: 'rgb(30, 30, 46)', background: 'rgb(203, 166, 247)' });

  const secondary = await colors(page.locator('#hero').getByRole('link', { name: 'Download resume' }));
  expect(secondary.color).toBe('rgb(205, 214, 244)');

  const navLink = await colors(page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'About' }));
  expect(navLink.color).toBe('rgb(166, 173, 200)');
});
