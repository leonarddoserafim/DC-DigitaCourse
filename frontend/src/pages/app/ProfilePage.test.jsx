import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProfilePage from './ProfilePage'

const mocks = vi.hoisted(() => ({
  app: null,
  updateProfile: vi.fn(),
  resetProgress: vi.fn(),
  restoreDemo: vi.fn(),
  logout: vi.fn(),
  showToast: vi.fn(),
}))

vi.mock('../../context/AppContext', () => ({
  useApp: () => mocks.app,
}))

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}))

const user = {
  id: 'user-1',
  name: 'Marina Costa',
  email: 'marina@digitacourse.com',
  role: 'Aluno',
  joinedAt: '2026-09-23T12:00:00.000Z',
}

const prefs = {
  dailyGoalMinutes: 10,
  publicProfile: true,
  emailReminders: true,
  weeklySummary: true,
}

const stats = {
  lessonsCompleted: 6,
  xp: 1250,
  streak: 13,
  totalSeconds: 3600,
  attempts: 21,
}

const courses = [
  { id: 'fundamentos', complete: true, totalLessons: 4 },
  { id: 'dia-a-dia', complete: false, totalLessons: 4 },
  { id: 'fluencia', complete: false, totalLessons: 4 },
]

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={['/app/perfil']}>
      <Routes>
        <Route path="/app/perfil" element={<ProfilePage />} />
        <Route path="/entrar" element={<h1>Entrar</h1>} />
        <Route path="/app" element={<h1>Painel</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    mocks.updateProfile.mockReset()
    mocks.resetProgress.mockReset()
    mocks.restoreDemo.mockReset()
    mocks.logout.mockReset()
    mocks.showToast.mockReset()
    mocks.app = {
      user,
      prefs,
      stats,
      courses,
      updateProfile: mocks.updateProfile,
      resetProgress: mocks.resetProgress,
      restoreDemo: mocks.restoreDemo,
      logout: mocks.logout,
    }
  })

  it('mostra a identidade e as preferências atuais da conta', () => {
    renderProfile()

    expect(screen.getByRole('heading', { name: 'Sua conta, suas regras.' })).toBeInTheDocument()
    expect(screen.getByText('Marina Costa')).toBeInTheDocument()
    expect(screen.getByText('marina@digitacourse.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '15min' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Perfil público no ranking/ })).toBeChecked()
  })

  it('salva nome, meta e preferências alteradas', async () => {
    mocks.updateProfile.mockResolvedValue({ ok: true })
    const userEventInstance = userEvent.setup()
    renderProfile()

    const name = screen.getByLabelText('Nome completo')
    await userEventInstance.clear(name)
    await userEventInstance.type(name, 'Marina E2E')
    await userEventInstance.click(screen.getByRole('button', { name: '15min' }))
    await userEventInstance.click(
      screen.getByRole('checkbox', { name: /Perfil público no ranking/ }),
    )
    await userEventInstance.click(screen.getByRole('checkbox', { name: /Lembretes por e-mail/ }))
    await userEventInstance.click(screen.getByRole('checkbox', { name: /Resumo semanal/ }))
    await userEventInstance.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(mocks.updateProfile).toHaveBeenCalledWith({
      name: 'Marina E2E',
      prefs: {
        dailyGoalMinutes: 15,
        publicProfile: false,
        emailReminders: false,
        weeklySummary: false,
      },
    })
    expect(await screen.findByText('Salvo')).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Preferências salvas',
      'Seu perfil e sua meta diária foram atualizados no banco.',
    )
  })

  it('valida o nome antes de chamar a API', async () => {
    const userEventInstance = userEvent.setup()
    renderProfile()

    const name = screen.getByLabelText('Nome completo')
    await userEventInstance.clear(name)
    await userEventInstance.type(name, 'A')
    await userEventInstance.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Informe um nome com pelo menos 2 caracteres.',
    )
    expect(mocks.updateProfile).not.toHaveBeenCalled()
  })

  it('mostra o erro retornado ao salvar o perfil', async () => {
    mocks.updateProfile.mockResolvedValue({ ok: false, error: 'Falha ao salvar o perfil.' })
    const userEventInstance = userEvent.setup()
    renderProfile()

    await userEventInstance.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha ao salvar o perfil.')
  })

  it('confirma a redefinição do progresso', async () => {
    mocks.resetProgress.mockResolvedValue({ ok: true })
    const userEventInstance = userEvent.setup()
    renderProfile()

    await userEventInstance.click(screen.getByRole('button', { name: 'Redefinir' }))
    expect(screen.getByText('Redefinir todo o seu progresso?')).toBeInTheDocument()

    await userEventInstance.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(mocks.resetProgress).toHaveBeenCalledTimes(1)
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Progresso redefinido',
      'Seu histórico de prática foi zerado na sua conta.',
    )
  })

  it('restaura a conta demo e volta para o painel', async () => {
    mocks.restoreDemo.mockResolvedValue({ ok: true })
    const userEventInstance = userEvent.setup()
    renderProfile()

    await userEventInstance.click(screen.getByRole('button', { name: 'Restaurar demo' }))
    await userEventInstance.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(mocks.restoreDemo).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('heading', { name: 'Painel' })).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Conta demo restaurada',
      'Você voltou para a conta de demonstração com os dados completos.',
    )
  })

  it('encerra a sessão e navega para o login', async () => {
    const userEventInstance = userEvent.setup()
    renderProfile()

    await userEventInstance.click(screen.getByRole('button', { name: 'Sair da conta' }))

    expect(mocks.logout).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(mocks.showToast).toHaveBeenCalledWith('Sessão encerrada', 'Até a próxima prática.')
  })
})
