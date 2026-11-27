import { expect, restoreDemo, test, TOKEN_KEY } from './fixtures.js'

test.describe('Autenticação', () => {
  test('entra com a conta de demonstração e abre o painel', async ({ page, request }) => {
    await restoreDemo(request)
    await page.goto('/entrar')
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible()

    await page.getByRole('button', { name: /Entrar com conta de demonstração/ }).click()

    await expect(page).toHaveURL(/\/app$/)
    await expect(page.getByText('Marina Costa').first()).toBeVisible()
    await expect(page.getByText('Visão geral', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Marina/ })).toBeVisible()
  })

  test('cria uma conta, encerra a sessão e entra novamente', async ({ page }) => {
    const email = `e2e.${Date.now()}@digitacourse.test`
    const password = 'e2e1234'

    await page.goto('/cadastro')
    await page.getByLabel('Nome completo').fill('Aluno E2E')
    await page.getByLabel('E-mail').fill(email)
    await page.getByPlaceholder('Mínimo de 6 caracteres').fill(password)
    await page.getByPlaceholder('Repita a senha').fill(password)
    await page.getByRole('checkbox', { name: /Concordo com os termos/ }).check()
    await page.getByRole('button', { name: 'Criar minha conta' }).click()

    await expect(page).toHaveURL(/\/app$/)
    await expect(page.getByText('Aluno E2E').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Aluno/ })).toBeVisible()
    await expect(page.getByText('Nenhuma prática ainda')).toBeVisible()

    await page.getByRole('button', { name: 'Sair da conta' }).click()
    await expect(page).toHaveURL(/\/entrar$/)
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible()

    await page.getByLabel('E-mail').fill(email)
    await page.getByPlaceholder('Sua senha').fill(password)
    await page.getByRole('button', { name: 'Entrar na plataforma' }).click()

    await expect(page).toHaveURL(/\/app$/)
    await expect(page.getByText('Aluno E2E').first()).toBeVisible()
  })

  test('encerra a sessão demo e protege as rotas privadas', async ({ demo }) => {
    await expect(demo.page.getByText('Visão geral', { exact: true }).first()).toBeVisible()

    await demo.page.getByRole('button', { name: 'Sair da conta' }).click()

    await expect(demo.page).toHaveURL(/\/entrar$/)
    await expect(demo.page.getByText('Sessão encerrada', { exact: true })).toBeVisible()
    const token = await demo.page.evaluate((key) => window.localStorage.getItem(key), TOKEN_KEY)
    expect(token).toBeNull()

    await demo.page.goto('/app')
    await expect(demo.page).toHaveURL(/\/entrar$/)
    await expect(demo.page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible()
  })
})
