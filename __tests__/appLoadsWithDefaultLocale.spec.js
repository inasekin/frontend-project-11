// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Первоначальная нагрузка приложения', () => {
  test('должен загружаться с русской локалью и отображать правильные тексты', async ({ page }) => {
    await page.goto('/');

    // Проверяем title
    const title = await page.locator('h1');
    await expect(title).toHaveText('RSS агрегатор');

    // Проверяем subtitle
    const subtitle = await page.locator('.lead');
    await expect(subtitle).toHaveText('Начните читать RSS сегодня! Это легко, это красиво.');

    // Проверяем label
    const label = await page.locator('[for="url-input"]');
    await expect(label).toHaveText('Ссылка RSS');

    // Проверяем submit button
    const submitButton = await page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText('Добавить');
  });
});
