import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { ArrowUpRight, Eye, EyeOff, Lock, Mail, User } from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import usePageMeta from '../../hooks/usePageMeta'

export default function SignupPage() {
  const { signup } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  usePageMeta('Criar conta — DigitaCourse', 'Crie sua conta no DigitaCourse e comece sua jornada de digitação.')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    if (!form.terms) {
      setError('Aceite os termos para criar a conta.')
      return
    }
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setSubmitting(true)
    setError('')
    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    showToast('Conta criada', 'Sua jornada no DigitaCourse começa agora.')
    navigate('/app', { replace: true })
  }

  return (
    <AuthLayout>
      <div className="auth-card" data-reveal>
        <span className="app-eyebrow">Criar conta</span>
        <h1>Comece pelo primeiro passo.</h1>
        <p className="auth-card__lead">
          Leva menos de um minuto. Depois, é só escolher uma trilha e praticar.
        </p>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field__label">Nome completo</span>
            <span className="field__control">
              <User size={17} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Como podemos chamar você?"
                autoComplete="name"
                autoFocus
                required
              />
            </span>
          </label>

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
                required
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
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                required
                aria-describedby="signup-password-hint"
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
            <span className="field__hint" id="signup-password-hint">
              Use pelo menos 6 caracteres. A senha é armazenada como hash BCrypt.
            </span>
          </label>

          <label className="field">
            <span className="field__label">Confirmar senha</span>
            <span className="field__control">
              <Lock size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repita a senha"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </span>
          </label>

          <label className="auth-check">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <span>
              Concordo com os termos de uso e com o tratamento dos meus dados para esta
              demonstração local.
            </span>
          </label>

          <button
            className="btn btn--primary auth-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Criando sua conta…' : 'Criar minha conta'}
            <span className="btn__icon" aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </button>
        </form>

        <p className="auth-switch">
          Já tem uma conta? <Link to="/entrar">Entrar</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
