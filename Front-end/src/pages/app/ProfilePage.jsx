import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import ProgressRing from '../../components/app/ProgressRing'
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Eye,
  Flame,
  LogOut,
  Mail,
  RotateCcw,
  Shield,
  Spark,
  Target,
  User,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import usePageMeta from '../../hooks/usePageMeta'
import {
  formatFullDate,
  formatMinutesFromSeconds,
  formatNumber,
  getInitials,
} from '../../lib/format'

const goalOptions = [5, 10, 15, 20]

export default function ProfilePage() {
  const {
    user,
    prefs,
    stats,
    courses,
    updateProfile,
    resetProgress,
    restoreDemo,
    logout,
  } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    dailyGoalMinutes: prefs.dailyGoalMinutes ?? 10,
    publicProfile: prefs.publicProfile ?? true,
    emailReminders: prefs.emailReminders ?? true,
    weeklySummary: prefs.weeklySummary ?? true,
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [dangerAction, setDangerAction] = useState(null)

  usePageMeta('Perfil e ajustes — DigitaCourse', 'Gerencie seus dados, metas e preferências da conta local.')

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      dailyGoalMinutes: prefs.dailyGoalMinutes ?? 10,
      publicProfile: prefs.publicProfile ?? true,
      emailReminders: prefs.emailReminders ?? true,
      weeklySummary: prefs.weeklySummary ?? true,
    })
  }, [user?.id, user?.name, prefs.dailyGoalMinutes, prefs.publicProfile, prefs.emailReminders, prefs.weeklySummary])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.')
      return
    }

    updateProfile({
      name: form.name,
      prefs: {
        dailyGoalMinutes: form.dailyGoalMinutes,
        publicProfile: form.publicProfile,
        emailReminders: form.emailReminders,
        weeklySummary: form.weeklySummary,
      },
    })
    setSaved(true)
    showToast('Preferências salvas', 'Seu perfil e sua meta diária foram atualizados.')
  }

  const handleDanger = () => {
    if (dangerAction === 'reset') {
      resetProgress()
      showToast('Progresso redefinido', 'Seu histórico de prática foi zerado nesta conta local.')
    } else if (dangerAction === 'restore') {
      restoreDemo()
      showToast('Conta demo restaurada', 'Você voltou para a conta de demonstração com os dados completos.')
      navigate('/app')
    }
    setDangerAction(null)
  }

  const handleLogout = () => {
    logout()
    showToast('Sessão encerrada', 'Até a próxima prática.')
    navigate('/')
  }

  const completedCourses = courses.filter((course) => course.complete).length
  const overallPercent = courses.length
    ? Math.round(
        (stats.lessonsCompleted / courses.reduce((total, course) => total + course.totalLessons, 0)) *
          100,
      )
    : 0

  return (
    <div className="app-page profile-page">
      <PageHeader
        eyebrow="Perfil e ajustes"
        title="Sua conta, suas regras."
        description="Ajuste como quer ser chamado, sua meta diária e o que aparece para a comunidade. Tudo fica salvo neste navegador."
        actions={
          <button className="btn btn--outline" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Sair da conta
          </button>
        }
      />

      <div className="profile-grid">
        <aside className="profile-side">
          <section className="app-panel profile-identity" data-reveal>
            <span className="profile-identity__avatar app-avatar app-avatar--xl">
              {getInitials(user?.name)}
            </span>
            <span className="app-eyebrow">Conta local</span>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="profile-identity__role">
              <Shield size={14} />
              {user?.role ?? 'Aluno'} · demonstração
            </span>

            <div className="profile-identity__joined">
              <Calendar size={15} />
              Membro desde {formatFullDate(user?.joinedAt)}
            </div>

            <div className="profile-identity__stats">
              <div>
                <strong>{stats.lessonsCompleted}</strong>
                <span>lições</span>
              </div>
              <div>
                <strong>{formatNumber(stats.xp)}</strong>
                <span>XP</span>
              </div>
              <div>
                <strong>{stats.streak}</strong>
                <span>dias</span>
              </div>
            </div>

            <div className="profile-identity__progress">
              <ProgressRing
                value={overallPercent}
                size={96}
                stroke={8}
                tone="teal"
                label={`${overallPercent}%`}
                sublabel="jornada"
                ariaLabel={`${overallPercent}% da jornada concluída.`}
              />
              <div>
                <strong>{completedCourses} trilhas concluídas</strong>
                <p>{formatMinutesFromSeconds(stats.totalSeconds)} de prática acumulada.</p>
              </div>
            </div>
          </section>

          <section className="profile-privacy" data-reveal>
            <span className="profile-privacy__icon">
              <Shield size={19} />
            </span>
            <div>
              <strong>Seus dados ficam aqui.</strong>
              <p>
                Conta, preferências e progresso são salvos no <code>localStorage</code> deste
                navegador. Nada é enviado para um servidor nesta etapa.
              </p>
            </div>
            <Link className="app-panel__link" to="/app/ranking">
              Ver ranking
              <ArrowUpRight size={15} />
            </Link>
          </section>
        </aside>

        <div className="profile-main">
          <form className="app-panel profile-form" onSubmit={handleSubmit} data-reveal>
            <div className="app-panel__head">
              <div>
                <span className="app-eyebrow">Dados pessoais</span>
                <h2>Como você aparece</h2>
                <p>Essas informações identificam sua conta dentro da plataforma.</p>
              </div>
              {saved && (
                <span className="profile-saved">
                  <CheckCircle size={15} />
                  Salvo
                </span>
              )}
            </div>

            {error && (
              <div className="auth-alert" role="alert">
                {error}
              </div>
            )}

            <div className="profile-form__grid">
              <label className="field">
                <span className="field__label">Nome completo</span>
                <span className="field__control">
                  <User size={17} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    required
                  />
                </span>
              </label>

              <label className="field">
                <span className="field__label">E-mail</span>
                <span className="field__control field__control--disabled">
                  <Mail size={17} />
                  <input type="email" value={user?.email ?? ''} readOnly disabled />
                </span>
                <span className="field__hint">O e-mail é a chave da conta local e não pode ser alterado.</span>
              </label>
            </div>

            <div className="profile-goal">
              <div>
                <span className="field__label">Meta diária de prática</span>
                <p>Escolha um tempo que caiba na sua rotina. Sessões curtas também contam.</p>
              </div>
              <div className="profile-goal__options" role="group" aria-label="Meta diária de prática">
                {goalOptions.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={form.dailyGoalMinutes === minutes ? 'is-active' : ''}
                    onClick={() => updateField('dailyGoalMinutes', minutes)}
                    aria-pressed={form.dailyGoalMinutes === minutes}
                  >
                    <strong>{minutes}</strong>
                    <span>min</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-save-row">
              <span>
                <Spark size={15} />
                Alterações salvas localmente.
              </span>
              <button className="btn btn--primary" type="submit">
                Salvar alterações
              </button>
            </div>
          </form>

          <section className="app-panel profile-prefs" data-reveal>
            <div className="app-panel__head">
              <div>
                <span className="app-eyebrow">Preferências</span>
                <h2>Privacidade e avisos</h2>
                <p>Controle sua presença na comunidade e os lembretes simulados.</p>
              </div>
            </div>

            <div className="profile-toggles">
              <label className="profile-toggle">
                <span className="profile-toggle__icon profile-toggle__icon--mint">
                  <Target size={18} />
                </span>
                <span className="profile-toggle__copy">
                  <strong>Meta diária ativa</strong>
                  <small>Exibir a meta de {form.dailyGoalMinutes} minutos no topo da área do aluno.</small>
                </span>
                <span className="switch">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    aria-label="Meta diária sempre ativa"
                  />
                  <i aria-hidden="true" />
                </span>
              </label>

              <label className="profile-toggle">
                <span className="profile-toggle__icon profile-toggle__icon--teal">
                  <Eye size={18} />
                </span>
                <span className="profile-toggle__copy">
                  <strong>Perfil público no ranking</strong>
                  <small>Permite que seu nome e sua pontuação apareçam na classificação.</small>
                </span>
                <span className="switch">
                  <input
                    type="checkbox"
                    checked={form.publicProfile}
                    onChange={(event) => updateField('publicProfile', event.target.checked)}
                  />
                  <i aria-hidden="true" />
                </span>
              </label>

              <label className="profile-toggle">
                <span className="profile-toggle__icon profile-toggle__icon--amber">
                  <Mail size={18} />
                </span>
                <span className="profile-toggle__copy">
                  <strong>Lembretes por e-mail</strong>
                  <small>Avisos simulados de prática e metas. Nenhum e-mail real é enviado.</small>
                </span>
                <span className="switch">
                  <input
                    type="checkbox"
                    checked={form.emailReminders}
                    onChange={(event) => updateField('emailReminders', event.target.checked)}
                  />
                  <i aria-hidden="true" />
                </span>
              </label>

              <label className="profile-toggle">
                <span className="profile-toggle__icon profile-toggle__icon--coral">
                  <Flame size={18} />
                </span>
                <span className="profile-toggle__copy">
                  <strong>Resumo semanal</strong>
                  <small>Um apanhado de velocidade, precisão e dias ativos ao fim da semana.</small>
                </span>
                <span className="switch">
                  <input
                    type="checkbox"
                    checked={form.weeklySummary}
                    onChange={(event) => updateField('weeklySummary', event.target.checked)}
                  />
                  <i aria-hidden="true" />
                </span>
              </label>
            </div>

            <p className="profile-prefs__note">
              Depois de alterar as preferências, use o botão <strong>Salvar alterações</strong> no
              formulário acima.
            </p>
          </section>

          <section className="app-panel profile-danger" data-reveal>
            <div className="app-panel__head">
              <div>
                <span className="app-eyebrow">Zona de cuidado</span>
                <h2>Dados de demonstração</h2>
                <p>Estas ações alteram apenas o conteúdo salvo neste navegador.</p>
              </div>
            </div>

            <div className="profile-danger__rows">
              <div className="profile-danger__row">
                <span>
                  <strong>Redefinir meu progresso</strong>
                  <small>Apaga tentativas, lições concluídas e notificações desta conta.</small>
                </span>
                <button
                  className="btn btn--outline btn--sm"
                  type="button"
                  onClick={() => setDangerAction('reset')}
                >
                  <RotateCcw size={14} />
                  Redefinir
                </button>
              </div>

              <div className="profile-danger__row">
                <span>
                  <strong>Restaurar conta de demonstração</strong>
                  <small>Volta para a conta da Marina com 21 tentativas e progresso de exemplo.</small>
                </span>
                <button
                  className="btn btn--outline btn--sm"
                  type="button"
                  onClick={() => setDangerAction('restore')}
                >
                  <Spark size={14} />
                  Restaurar demo
                </button>
              </div>
            </div>

            {dangerAction && (
              <div className="profile-confirm" role="alert">
                <div>
                  <strong>
                    {dangerAction === 'reset'
                      ? 'Redefinir todo o seu progresso?'
                      : 'Entrar na conta demo restaurada?'}
                  </strong>
                  <p>
                    {dangerAction === 'reset'
                      ? 'Lições concluídas e histórico serão apagados. Esta ação não pode ser desfeita.'
                      : 'Você será levado para a conta de demonstração da Marina com os dados originais.'}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn--outline btn--sm"
                    type="button"
                    onClick={() => setDangerAction(null)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn--primary btn--sm" type="button" onClick={handleDanger}>
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {stats.attempts === 0 && (
              <div className="profile-empty-hint">
                <Zap size={16} />
                Sua conta ainda não tem tentativas. Comece pela primeira lição para ver os dados
                aparecerem.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
