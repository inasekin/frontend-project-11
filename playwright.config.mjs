// playwright.config.mjs
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__',
  timeout: 30000, // 30 секунд на тест
  retries: 0,
  use: {
    headless: true, // Установите в false, если хотите видеть браузер
    baseURL: 'http://localhost:8080', // Убедитесь, что сервер запускается на этом URL
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000, // 10 секунд на действие
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npx webpack serve', // Команда для запуска вашего сервера
    url: 'http://localhost:8080', // URL, по которому доступен сервер
    timeout: 120 * 1000, // Время ожидания запуска сервера (в миллисекундах)
    reuseExistingServer: !process.env.CI, // Использовать уже запущенный сервер, если он существует
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
