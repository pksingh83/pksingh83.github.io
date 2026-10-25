import { expect, test } from '@playwright/test';

test.describe('theme', () => {
  test('starts dark, switches theme on click, and remembers the choice after reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: /theme/i }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('section jump palette', () => {
  test('opens with the keyboard shortcut, filters sections, and jumps on Enter', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+K');
    const dialog = page.getByRole('dialog', { name: /jump to section/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.type('proj');
    await expect(dialog.getByRole('link')).toHaveCount(1);

    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#projects$/);
  });

  test('closes with Escape and opens from the header button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /jump to section/i }).click();
    const dialog = page.getByRole('dialog', { name: /jump to section/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
