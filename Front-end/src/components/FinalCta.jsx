import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ArrowUpRight, ArrowDown } from './Icons'

const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export default function FinalCta() {
  const { isAuthenticated, nextLessonInfo } = useApp()
  const practiceHref = isAuthenticated
    ? nextLessonInfo
      ? `/app/praticar/${nextLessonInfo.lesson.id}`
      : '/app'
    : '/cadastro'

  return (
    <section className="final-cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-panel__copy" data-reveal>
            <span className="cta-badge">
              <i />
              Plataforma em desenvolvimento
            </span>
            <h2 id="cta-title">Sua próxima tecla pode ser o começo.</h2>
            <p>
              O DigitaCourse está sendo construído para acompanhar você do primeiro exercício à
              fluência. Crie sua conta e experimente a área do aluno.
            </p>
            <div className="cta-actions">
              <Link className="btn btn--mint btn--lg" to={practiceHref}>
                {isAuthenticated ? 'Continuar jornada' : 'Quero começar'}
                <span className="btn__icon">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
              <a className="btn btn--on-dark btn--lg" href="#recursos">
                Rever os recursos
                <ArrowDown size={17} />
              </a>
            </div>
            <span className="cta-note">Sem instalação · direto no navegador</span>
          </div>

          <div className="cta-keyboard" aria-hidden="true">
            {rows.map((row, rowIndex) => (
              <div className="cta-keyboard__row" key={rowIndex}>
                {row.map((key) => (
                  <span
                    className={`cta-keycap${
                      key === 'f' || key === 'j' ? ' cta-keycap--home' : ''
                    }${key === 'a' ? ' cta-keycap--active' : ''}`}
                    key={key}
                  >
                    {key}
                  </span>
                ))}
              </div>
            ))}
            <div className="cta-keyboard__row">
              <span className="cta-keycap">shift</span>
              <span className="cta-keycap cta-keycap--space">espaço</span>
              <span className="cta-keycap">shift</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
