import { test as base, expect } from '@playwright/test'

export const TOKEN_KEY = 'digitacourse:token:v1'

export async function restoreDemo(request) {
  const response = await request.post('/api/auth/demo/restore')
  if (!response.ok()) {
    throw new Error(
      `Não foi possível restaurar a conta demo (${response.status()}): ${await response.text()}`,
    )
  }
  return response.json()
}

export const test = base.extend({
  demo: async ({ page, request }, use) => {
    const session = await restoreDemo(request)

    await page.goto('/')
    await page.evaluate(
      ({ key, token }) => {
        window.localStorage.setItem(key, token)
      },
      { key: TOKEN_KEY, token: session.token },
    )
    await page.goto('/app')
    await expect(page.locator('.app-shell')).toBeVisible()

    await use({ page, session })

    await request.post('/api/auth/demo/restore')
  },
})

export { expect }
