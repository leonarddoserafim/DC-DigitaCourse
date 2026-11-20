import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { ArrowLeft, CheckCircle, Mail } from '../../components/Icons'
import usePageMeta from '../../hooks/usePageMeta'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  usePageMeta('Recuperar senha — DigitaCourse', 'Recupere o acesso à sua conta do DigitaCourse.')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Informe um e-mail válido.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthLayout>
      <div className="auth-card" data-reveal>
        <span className="app-eyebrow">Recuperar acesso</span>
        <h1>{sent ? 'Verifique seu e-mail.' : 'Esqueceu a senha?'}</h1>
        <p className="auth-card__lead">
          {sent
            ? 'Se existir uma conta com este e-mail, as instruções de recuperação apareceriam aqui.'
            : 'Informe o e-mail da sua conta. Nesta demonstração, o envio é apenas simulado.'}
        </p>

        {sent ? (
          <div className="auth-success" role="status">
            <span className="auth-success__icon">
              <CheckCircle size={28} />
            </span>
            <strong>Pedido registrado</strong>
            <p>
              Em um ambiente real, você receberia um link seguro para criar uma nova senha. Nenhum
              e-mail foi enviado nesta etapa.
            </p>
            <Link className="btn btn--outline" to="/entrar">
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="auth-alert" role="alert">
                {error}
              </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label className="field">
                <span className="field__label">E-mail da conta</span>
                <span className="field__control">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </span>
              </label>

              <button className="btn btn--primary auth-submit" type="submit">
                Enviar instruções
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          Lembrou a senha? <Link to="/entrar">Voltar para o login</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
