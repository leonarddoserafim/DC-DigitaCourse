import { ArrowDown, ArrowUpRight, Check, Keyboard } from './Icons'
import PracticeCard from './PracticeCard'

const proof = ['Sem instalar nada', 'Sessões de 10 min', 'Direto no navegador']

export default function Hero({ onComingSoon }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__glow hero__glow--teal" />
        <span className="hero__glow hero__glow--amber" />
        <span className="hero__keycap hero__keycap--f">F</span>
        <span className="hero__keycap hero__keycap--j">J</span>
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            Treino de digitação · do zero à fluência
          </span>

          <h1 id="hero-title">
            Suas ideias
            <br />
            merecem dedos
            <br />
            <span className="mark">mais rápidos.</span>
            <span className="hero__caret" aria-hidden="true" />
          </h1>

          <p className="hero__lead">
            Trilhas guiadas, exercícios interativos e feedback em tempo real para transformar o
            teclado em uma extensão natural do seu pensamento.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" type="button" onClick={onComingSoon}>
              Começar a praticar
              <span className="btn__icon">
                <ArrowUpRight size={18} />
              </span>
            </button>
            <a className="btn btn--outline btn--lg" href="#como-funciona">
              Ver como funciona
              <ArrowDown size={17} />
            </a>
          </div>

          <ul className="hero__proof" aria-label="Destaques da plataforma">
            {proof.map((item) => (
              <li key={item}>
                <Check size={14} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <PracticeCard />
          <div className="hero__caption" aria-hidden="true">
            <Keyboard size={16} />
            <span>
              uma prática pequena por dia — <strong>um resultado que aparece.</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
