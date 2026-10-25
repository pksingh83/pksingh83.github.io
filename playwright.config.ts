import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321', channel: 'chrome' },
  webServer: {
    command: 'npm run build && npx sirv dist --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 180000,
  },
});
