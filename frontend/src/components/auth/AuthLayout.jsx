import { Link } from 'react-router-dom'
import Logo from '../Logo'
import { ArrowLeft, ArrowUpRight, Flame, Target, Zap } from '../Icons'

const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-aside__top">
          <Logo light to="/" />
          <Link className="auth-aside__site" to="/">
            Voltar ao site
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="auth-aside__body">
          <span className="auth-aside__eyebrow">Área do aluno</span>
          <h2>
            Cada tecla te aproxima da <span>fluência.</span>
          </h2>
          <p>
            Entre para continuar suas trilhas, acompanhar sua evolução e transformar prática em
            resultado.
          </p>

          <div className="auth-preview" aria-hidden="true">
            <div className="auth-preview__head">
              <span>sessão de hoje</span>
              <span className="auth-preview__live">
                <i />
                ao vivo
              </span>
            </div>
            <div className="auth-preview__stats">
              <span>
                <strong>72</strong>
                <small>WPM</small>
              </span>
              <span>
                <strong>98,4%</strong>
                <small>precisão</small>
              </span>
              <span>
                <strong>13</strong>
                <small>dias</small>
              </span>
            </div>
            <div className="auth-preview__keys">
              {keys.map((key) => (
                <span
                  key={key}
                  className={key === 'f' || key === 'j' ? 'is-home' : ''}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>

          <ul className="auth-aside__points">
            <li>
              <Target size={16} />
              12 lições em 3 trilhas
            </li>
            <li>
              <Flame size={16} />
              Sequências e conquistas
            </li>
            <li>
              <Zap size={16} />
              Feedback em tempo real
            </li>
          </ul>
        </div>

        <blockquote className="auth-aside__quote">
          “A constância vence a intensidade.”
          <span>uma prática pequena por dia</span>
        </blockquote>
      </aside>

      <main className="auth-main">
        <div className="auth-main__top">
          <Logo to="/" />
          <Link className="auth-main__back" to="/">
            <ArrowLeft size={15} />
            Voltar ao site
          </Link>
        </div>

        <div className="auth-main__content">{children}</div>

        <p className="auth-main__foot">
          Projeto acadêmico · Fatec Praia Grande · dados locais de demonstração
        </p>
      </main>
    </div>
  )
}
