// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Добавление RSS-фида', () => {
  test('должно добавить новый RSS-фид и отобразить его посты', async ({ page }) => {
    await page.goto('/');

    // Заполнение поля ввода URL RSS
    const input = page.locator('[data-testid="url-input"]');
    await input.fill('https://rssexport.rbc.ru/rbcnews/news/30/full.rss');

    const submitButton = page.locator('[data-testid="submit-button"]');
    await Promise.all([
      submitButton.click(),
    ]);

    // Проверка сообщения об успехе
    const feedback = page.locator('.feedback');
    await expect(feedback).toHaveClass(/text-success/);
    await expect(feedback).toHaveText('RSS успешно загружен');

    // Проверка отображения фида
    const feeds = page.locator('.feeds');
    await expect(feeds).toHaveCount(1);
    // Проверка отображения постов
    const posts = page.locator('.posts > .list-group > .list-group-item');
    await expect(posts).toHaveCount(30);
  });
});
