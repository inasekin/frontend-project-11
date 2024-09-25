// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Некорректный URL RSS', () => {
  test('должно отображать сообщение об ошибке для некорректного URL', async ({ page }) => {
    await page.goto('/');

    // Заполнение поля ввода некорректным URL
    const input = page.locator('[data-testid="url-input"]');
    await input.fill('invalid-url');

    // Отправка формы
    const submitButton = page.locator('[data-testid="submit-button"]');
    await Promise.all([
      submitButton.click(),
    ]);

    // Проверка сообщения об ошибке
    const feedback = page.locator('.feedback');
    await expect(feedback).toHaveClass(/text-danger/);
    await expect(feedback).toHaveText('Ссылка должна быть валидным URL');

    // Убедиться, что фид не добавлен
    const feeds = page.locator('.feeds .list-group-item');
    await expect(feeds).toHaveCount(0);
  });
});
