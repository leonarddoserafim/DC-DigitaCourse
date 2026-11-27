import { expect, test } from './fixtures.js'

test.describe('Perfil e ajustes', () => {
  test('atualiza nome, meta e preferências e persiste após recarregar', async ({ demo }) => {
    const page = demo.page

    await page.goto('/app/perfil')
    await expect(page.getByRole('heading', { name: 'Sua conta, suas regras.' })).toBeVisible()
    await expect(page.getByText('marina@digitacourse.com')).toBeVisible()

    await page.getByLabel('Nome completo').fill('Marina E2E')
    await page.getByRole('button', { name: /^15\s*min$/ }).click()
    await page.getByText('Perfil público no ranking', { exact: true }).click()
    await page.getByRole('button', { name: 'Salvar alterações' }).click()

    await expect(page.getByText('Preferências salvas', { exact: true })).toBeVisible()
    await expect(page.getByText('Salvo', { exact: true })).toBeVisible()

    await page.reload()
    await expect(page.getByLabel('Nome completo')).toHaveValue('Marina E2E')
    await expect(page.getByRole('button', { name: /^15\s*min$/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(
      page.getByRole('checkbox', { name: /Perfil público no ranking/ }),
    ).not.toBeChecked()
  })

  test('redefine o progresso após confirmação', async ({ demo }) => {
    const page = demo.page

    await page.goto('/app/perfil')
    await expect(page.getByRole('heading', { name: 'Sua conta, suas regras.' })).toBeVisible()

    await page.getByRole('button', { name: 'Redefinir' }).click()
    await expect(page.getByText('Redefinir todo o seu progresso?')).toBeVisible()
    await page.getByRole('button', { name: 'Confirmar' }).click()

    await expect(page.getByText('Progresso redefinido', { exact: true })).toBeVisible()

    await page.goto('/app/progresso')
    await expect(page.getByText('Seu histórico começa na primeira lição')).toBeVisible()
    await expect(page.getByText('0 tentativas registradas', { exact: true })).toBeVisible()
  })
})
