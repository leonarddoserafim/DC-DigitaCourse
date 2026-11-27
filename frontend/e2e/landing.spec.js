import { expect, test } from '@playwright/test'

test.describe('Landing page', () => {
  test('apresenta a proposta e as seções principais', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/DigitaCourse/)
    await expect(
      page.getByRole('heading', { level: 1, name: /Suas ideias.*dedos.*mais rápidos/ }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Começar a praticar' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ver como funciona' })).toBeVisible()
    const navigation = page.getByRole('navigation', { name: 'Navegação principal' })
    await expect(navigation).toBeVisible()

    for (const label of ['Recursos', 'Como funciona', 'Evolução', 'Dúvidas']) {
      await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible()
    }

    await expect(page.getByRole('link', { name: 'Entrar', exact: true }).first()).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Começar agora', exact: true }).first(),
    ).toBeVisible()
  })

  test('leva ao cadastro e ao login pelos CTAs', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Começar a praticar' }).click()
    await expect(page).toHaveURL(/\/cadastro$/)
    await expect(page.getByRole('heading', { name: 'Comece pelo primeiro passo.' })).toBeVisible()

    await page.getByRole('link', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL(/\/entrar$/)
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible()
  })
})
