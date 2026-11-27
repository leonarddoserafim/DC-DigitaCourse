import { defineConfig, devices } from '@playwright/test'
import { e2eConfig, e2eDatabaseUrl } from './e2e/support/config.js'

const baseURL = `http://127.0.0.1:${e2eConfig.webPort}`
const apiURL = `http://127.0.0.1:${e2eConfig.apiPort}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node e2e/scripts/start-backend.js',
      url: `${apiURL}/api/health`,
      timeout: 240_000,
      reuseExistingServer: false,
      env: {
        ...process.env,
        PORT: String(e2eConfig.apiPort),
        DIGITACOURSE_DB_URL: e2eDatabaseUrl,
        DIGITACOURSE_DB_USER: e2eConfig.database.user,
        DIGITACOURSE_DB_PASSWORD: e2eConfig.database.password,
        DIGITACOURSE_JWT_SECRET: e2eConfig.jwtSecret,
      },
    },
    {
      command: 'npm run e2e:serve',
      url: baseURL,
      timeout: 120_000,
      reuseExistingServer: false,
      env: {
        ...process.env,
        VITE_API_PROXY_TARGET: apiURL,
      },
    },
  ],
  globalTeardown: './e2e/global-teardown.js',
})
