import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { ArrowUpRight, Eye, EyeOff, Lock, Mail, Spark } from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import usePageMeta from '../../hooks/usePageMeta'
import { DEMO_EMAIL } from '../../data/seed'

export default function LoginPage() {
  const { login, loginDemo } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  usePageMeta('Entrar — DigitaCourse', 'Acesse sua conta do DigitaCourse e continue praticando.')

  const destination = location.state?.from || '/app'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = login(form.email, form.password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    showToast('Bem-vindo de volta', 'Sua jornada continua de onde parou.')
    navigate(destination, { replace: true })
  }

  const handleDemo = () => {
    loginDemo()
    showToast('Conta de demonstração', 'Você entrou como Marina Costa.')
    navigate(destination, { replace: true })
  }

  return (
    <AuthLayout>
      <div className="auth-card" data-reveal>
        <span className="app-eyebrow">Entrar</span>
        <h1>Bem-vindo de volta.</h1>
        <p className="auth-card__lead">
          Retome suas trilhas e acompanhe cada passo da sua evolução.
        </p>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field__label">E-mail</span>
            <span className="field__control">
              <Mail size={17} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                autoFocus
                required
                aria-invalid={Boolean(error)}
              />
            </span>
          </label>

          <label className="field">
            <span className="field__label">Senha</span>
            <span className="field__control">
              <Lock size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
                aria-describedby="login-password-hint"
              />
              <button
                className="field__eye"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
            <span className="field__hint" id="login-password-hint">
              Nesta etapa, qualquer senha com 4 ou mais caracteres é aceita.
            </span>
          </label>

          <div className="auth-form__row">
            <span className="auth-form__note">Autenticação simulada · sem back-end</span>
            <Link className="auth-link" to="/recuperar-senha">
              Esqueci minha senha
            </Link>
          </div>

          <button className="btn btn--primary auth-submit" type="submit">
            Entrar na plataforma
            <span className="btn__icon" aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </button>
        </form>

        <div className="auth-divider">
          <span>ou experimente sem cadastro</span>
        </div>

        <button className="auth-demo" type="button" onClick={handleDemo}>
          <span className="auth-demo__icon">
            <Spark size={18} />
          </span>
          <span className="auth-demo__text">
            <strong>Entrar com conta de demonstração</strong>
            <small>{DEMO_EMAIL} · dados de exemplo completos</small>
          </span>
          <ArrowUpRight size={18} />
        </button>

        <p className="auth-switch">
          Ainda não tem uma conta? <Link to="/cadastro">Criar conta gratuita</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
