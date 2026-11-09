import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
        (!process.env.CI &&
        existsSync(
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        )
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : undefined),
    },
    viewport: { width: 390, height: 844 },
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
  },
});
