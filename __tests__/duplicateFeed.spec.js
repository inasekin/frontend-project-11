// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Дубль RSS Feed', () => {
  test('должен предотвратить добавление дублирующего RSS-канала и показать ошибку', async ({ page }) => {
    await page.goto('/');

    const rssUrl = 'https://rssexport.rbc.ru/rbcnews/news/30/full.rss';

    const input = page.locator('[data-testid="url-input"]');
    await input.fill(rssUrl);

    const submitButton = page.locator('[data-testid="submit-button"]');
    await Promise.all([
      page.waitForResponse((response) => response.status() === 200),
      submitButton.click(),
    ]);

    const feedback = page.locator('.feedback');
    const feeds = page.locator('.feeds');
    await expect(feedback).toHaveClass(/text-success/);
    await expect(feedback).toHaveText('RSS успешно загружен').then(async () => {
      await input.fill(rssUrl);
      await Promise.all([
        page.waitForResponse((response) => response.status() === 200),
        submitButton.click(),
      ]);

      await expect(feedback).toHaveClass(/text-danger/);
      await expect(feedback).toHaveText('RSS уже существует');

      await expect(feeds).toHaveCount(1);
    });
  });
});
