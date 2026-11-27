import { expect, test } from './fixtures.js'

test.describe('Painel do aluno', () => {
  test('mostra a retomada, a meta e o resumo da conta demo', async ({ demo }) => {
    const page = demo.page

    await expect(page.getByRole('heading', { name: /Marina/ })).toBeVisible()
    await expect(page.getByText('Continue de onde parou')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mensagens e e-mails' })).toBeVisible()
    await expect(page.getByText('Meta de hoje')).toBeVisible()
    await expect(page.getByText('10 min', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('6 lições concluídas')).toBeVisible()
    await expect(page.getByText('Sequência de 13 dias')).toBeVisible()
  })
})

test.describe('Trilhas', () => {
  test('lista as trilhas e abre os detalhes da trilha de fundamentos', async ({ demo }) => {
    const page = demo.page

    await page.goto('/app/trilhas')
    await expect(page.getByRole('heading', { name: 'Uma jornada, três níveis.' })).toBeVisible()
    await expect(page.getByText('6 de 12 lições concluídas')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Fundamentos do teclado' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Palavras do dia a dia' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Textos com fluência' })).toBeVisible()

    await page
      .getByRole('link', { name: /Revisar trilha/ })
      .first()
      .click()

    await expect(page).toHaveURL(/\/app\/trilhas\/fundamentos$/)
    await expect(page.getByRole('heading', { name: 'Fundamentos do teclado' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Primeiros passos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ganhe ritmo' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Encontre a posição das mãos' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Revisar' }).first()).toBeVisible()
  })
})

test.describe('Prática e progresso', () => {
  test('pratica uma lição, exibe o resultado e registra a tentativa', async ({ demo }) => {
    const page = demo.page

    await page.goto('/app/praticar/fund-01')
    await expect(page.getByRole('heading', { name: 'Encontre a posição das mãos' })).toBeVisible()

    const surface = page.getByRole('textbox', { name: /Exercício de digitação/ })
    await expect(surface).toBeVisible()

    const label = await surface.getAttribute('aria-label')
    const prefix = 'Exercício de digitação: '
    const suffix = '. Digite o texto exibido.'
    expect(label).toBeTruthy()
    expect(label.startsWith(prefix)).toBe(true)
    expect(label.endsWith(suffix)).toBe(true)

    const text = label.slice(prefix.length, label.length - suffix.length)
    expect(text.length).toBeGreaterThan(10)

    const attemptSaved = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/api\/lessons\/[^/]+\/attempts$/.test(new URL(response.url()).pathname),
    )

    await surface.click()
    await page.keyboard.type(text, { delay: 80 })

    await expect(page.getByRole('heading', { name: 'Boa, Marina.' })).toBeVisible()
    await expect(page.getByText('Novo recorde pessoal')).toBeVisible()
    await expect(page.getByText('Velocidade', { exact: true })).toBeVisible()
    await expect(page.getByText('Precisão', { exact: true })).toBeVisible()
    await expect(page.getByText('Experiência', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Próxima lição' })).toBeVisible()

    const savedResponse = await attemptSaved
    expect(savedResponse.ok(), await savedResponse.text()).toBe(true)

    await page.getByRole('link', { name: 'Ver trilha' }).click()
    await expect(page).toHaveURL(/\/app\/trilhas\/fundamentos$/)

    await page.goto('/app/progresso')
    await expect(page.getByText('22 tentativas registradas', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tentativas recentes' })).toBeVisible()
    await expect(page.getByText('Encontre a posição das mãos').first()).toBeVisible()
  })

  test('exibe métricas, gráfico e histórico da conta demo', async ({ demo }) => {
    const page = demo.page

    await page.goto('/app/progresso')
    await expect(page.getByRole('heading', { name: 'Sua evolução, sem achismo.' })).toBeVisible()
    await expect(page.getByText('Velocidade média')).toBeVisible()
    await expect(page.getByText('Precisão média')).toBeVisible()
    await expect(page.getByText('Sequência', { exact: true })).toBeVisible()
    await expect(page.getByText('Tempo total')).toBeVisible()
    await expect(page.getByText('21 tentativas registradas', { exact: true })).toBeVisible()
    await expect(page.getByText('21 no total')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tentativas recentes' })).toBeVisible()

    await page.getByRole('button', { name: 'Precisão', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Precisão por exercício' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Precisão', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
