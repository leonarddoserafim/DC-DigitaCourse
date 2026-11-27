import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  loginDemo: vi.fn(),
  showToast: vi.fn(),
}))

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({ login: mocks.login, loginDemo: mocks.loginDemo }),
}))

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}))

function renderLogin(initialEntries = ['/entrar']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/app" element={<h1>Painel do aluno</h1>} />
        <Route path="/app/perfil" element={<h1>Perfil do aluno</h1>} />
        <Route path="/cadastro" element={<h1>Cadastro</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mocks.login.mockReset()
    mocks.loginDemo.mockReset()
    mocks.showToast.mockReset()
  })

  it('renderiza o formulário e o atalho da conta demo', () => {
    renderLogin()

    expect(screen.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Sua senha')).toBeInTheDocument()
    expect(screen.getByText(/marina@digitacourse.com/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Entrar com conta de demonstração/ }),
    ).toBeInTheDocument()
  })

  it('envia as credenciais e navega para o painel', async () => {
    mocks.login.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('E-mail'), 'marina@digitacourse.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'demo1234')
    await user.click(screen.getByRole('button', { name: /Entrar na plataforma/ }))

    expect(mocks.login).toHaveBeenCalledWith('marina@digitacourse.com', 'demo1234')
    expect(await screen.findByRole('heading', { name: 'Painel do aluno' })).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Bem-vindo de volta',
      'Sua jornada continua de onde parou.',
    )
  })

  it('respeita o destino salvo antes do login', async () => {
    mocks.login.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    renderLogin([{ pathname: '/entrar', state: { from: '/app/perfil' } }])

    await user.type(screen.getByLabelText('E-mail'), 'marina@digitacourse.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'demo1234')
    await user.click(screen.getByRole('button', { name: /Entrar na plataforma/ }))

    expect(await screen.findByRole('heading', { name: 'Perfil do aluno' })).toBeInTheDocument()
  })

  it('mostra o erro da API e limpa o alerta ao digitar novamente', async () => {
    mocks.login.mockResolvedValue({ ok: false, error: 'E-mail ou senha incorretos.' })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('E-mail'), 'marina@digitacourse.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'errada')
    await user.click(screen.getByRole('button', { name: /Entrar na plataforma/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText('E-mail'), 'x')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'false')
  })

  it('entra com a conta demo e navega para o painel', async () => {
    mocks.loginDemo.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /Entrar com conta de demonstração/ }))

    expect(mocks.loginDemo).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('heading', { name: 'Painel do aluno' })).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Conta de demonstração',
      'Você entrou como Marina Costa.',
    )
  })

  it('exibe erro quando a conta demo não está disponível', async () => {
    mocks.loginDemo.mockResolvedValue({ ok: false, error: 'Demo indisponível.' })
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /Entrar com conta de demonstração/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Demo indisponível.')
  })

  it('mostra o estado de carregamento enquanto prepara a demo', async () => {
    let resolveDemo
    mocks.loginDemo.mockReturnValue(
      new Promise((resolve) => {
        resolveDemo = resolve
      }),
    )
    const user = userEvent.setup()
    renderLogin()
    const demoButton = screen.getByRole('button', { name: /Entrar com conta de demonstração/ })

    await user.click(demoButton)

    expect(demoButton).toBeDisabled()
    expect(demoButton).toHaveTextContent('Preparando a demonstração…')

    resolveDemo({ ok: false, error: 'Falha temporária.' })
    await waitFor(() => expect(demoButton).not.toBeDisabled())
    expect(screen.getByRole('alert')).toHaveTextContent('Falha temporária.')
  })

  it('alterna a visibilidade da senha', async () => {
    const user = userEvent.setup()
    renderLogin()
    const password = screen.getByPlaceholderText('Sua senha')

    expect(password).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument()
  })
})
