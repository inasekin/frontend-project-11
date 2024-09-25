// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Просмотр поста в модальном окне', () => {
  test('должно открывать модальное окно с деталями поста при клике на кнопку Просмотр', async ({ page }) => {
    await page.goto('/');

    // Добавление RSS-фида
    const rssUrl = 'https://rssexport.rbc.ru/rbcnews/news/30/full.rss';
    const input = page.locator('[data-testid="url-input"]');
    await input.fill(rssUrl);

    const submitButton = page.locator('[data-testid="submit-button"]');
    await Promise.all([
      submitButton.click(),
      page.waitForResponse((response) => response.status() === 200),
    ]);

    // Проверка, что посты загружены
    const posts = page.locator('.posts > .list-group > .list-group-item');
    await expect(posts).toHaveCount(30);

    // Клик на кнопку "Просмотр" первого поста
    const firstPostViewButton = posts.first().locator('button');
    await firstPostViewButton.click();

    // Проверка, что модальное окно отображается
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    // Проверка содержимого модального окна
    const modalTitle = modal.locator('.modal-title');
    const modalBody = modal.locator('.modal-body');
    const modalLink = modal.locator('.modalLink');
    const modalCloseButton = modal.locator('.btn-secondary');

    // Проверка, что заголовок и тело модального окна не пусты
    await expect(modalTitle).not.toBeEmpty();
    await expect(modalBody).not.toBeEmpty();

    // Проверка ссылки "Читать полностью"
    const postUrl = await posts.first().locator('a').getAttribute('href');
    await expect(modalLink).toHaveAttribute('href', postUrl);
    await expect(modalLink).toHaveText('Читать полностью');

    // Проверка кнопки "Закрыть"
    await expect(modalCloseButton).toHaveText('Закрыть');

    // Закрытие модального окна
    await modalCloseButton.click();
    await expect(modal).not.toBeVisible();
  });
});
