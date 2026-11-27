import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SignupPage from './SignupPage'

const mocks = vi.hoisted(() => ({
  signup: vi.fn(),
  showToast: vi.fn(),
}))

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({ signup: mocks.signup }),
}))

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}))

function renderSignup() {
  return render(
    <MemoryRouter initialEntries={['/cadastro']}>
      <Routes>
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/app" element={<h1>Painel do aluno</h1>} />
        <Route path="/entrar" element={<h1>Entrar</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillForm(user, { confirm = 'demo1234', terms = true } = {}) {
  await user.type(screen.getByLabelText('Nome completo'), 'Marina Costa')
  await user.type(screen.getByLabelText('E-mail'), 'marina@digitacourse.com')
  await user.type(screen.getByPlaceholderText('Mínimo de 6 caracteres'), 'demo1234')
  await user.type(screen.getByPlaceholderText('Repita a senha'), confirm)
  if (terms) {
    await user.click(screen.getByRole('checkbox', { name: /Concordo com os termos/ }))
  }
}

describe('SignupPage', () => {
  beforeEach(() => {
    mocks.signup.mockReset()
    mocks.showToast.mockReset()
  })

  it('renderiza todos os campos obrigatórios', () => {
    renderSignup()

    expect(screen.getByRole('heading', { name: 'Comece pelo primeiro passo.' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mínimo de 6 caracteres')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repita a senha')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Concordo com os termos/ })).toBeInTheDocument()
  })

  it('exige o aceite dos termos antes de criar a conta', async () => {
    const user = userEvent.setup()
    renderSignup()

    await fillForm(user, { terms: false })
    await user.click(screen.getByRole('button', { name: /Criar minha conta/ }))

    expect(screen.getByRole('alert')).toHaveTextContent('Aceite os termos para criar a conta.')
    expect(mocks.signup).not.toHaveBeenCalled()
  })

  it('bloqueia o cadastro quando as senhas não coincidem', async () => {
    const user = userEvent.setup()
    renderSignup()

    await fillForm(user, { confirm: 'outra-senha' })
    await user.click(screen.getByRole('button', { name: /Criar minha conta/ }))

    expect(screen.getByRole('alert')).toHaveTextContent('As senhas não coincidem.')
    expect(mocks.signup).not.toHaveBeenCalled()
  })

  it('cria a conta e navega para o painel', async () => {
    mocks.signup.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    renderSignup()

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /Criar minha conta/ }))

    expect(mocks.signup).toHaveBeenCalledWith({
      name: 'Marina Costa',
      email: 'marina@digitacourse.com',
      password: 'demo1234',
    })
    expect(await screen.findByRole('heading', { name: 'Painel do aluno' })).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Conta criada',
      'Sua jornada no DigitaCourse começa agora.',
    )
  })

  it('exibe o erro da API sem sair da tela de cadastro', async () => {
    mocks.signup.mockResolvedValue({
      ok: false,
      error: 'Já existe uma conta com este e-mail. Faça login.',
    })
    const user = userEvent.setup()
    renderSignup()

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /Criar minha conta/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe uma conta com este e-mail. Faça login.',
    )
    expect(screen.queryByRole('heading', { name: 'Painel do aluno' })).not.toBeInTheDocument()
  })
})
