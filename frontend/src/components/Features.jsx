import SectionHeading from './SectionHeading'
import { Chart, Check, Clock, Gauge, Route, Trophy } from './Icons'

const trailSteps = [
  { label: 'Base', state: 'done' },
  { label: 'Palavras', state: 'current' },
  { label: 'Frases', state: '' },
  { label: 'Textos', state: '' },
]

export default function Features() {
  return (
    <section className="section features" id="recursos" aria-labelledby="features-title">
      <div className="container">
        <div className="features__head">
          <SectionHeading
            id="features-title"
            eyebrow="Por que DigitaCourse"
            title={
              <>
                Evoluir fica mais leve quando você <span className="soft-mark">enxerga cada passo.</span>
              </>
            }
            description="Uma experiência de aprendizado pensada para criar constância — não para decorar teclas."
          />
          <p className="features__aside" data-reveal>
            Aprender a digitar é um exercício de repetição inteligente. Aqui, cada prática tem um
            objetivo claro e um retorno visível.
          </p>
        </div>

        <div className="features__grid">
          <article className="feature-card feature-card--trails" data-reveal>
            <div className="feature-card__top">
              <span className="icon-chip">
                <Route size={21} />
              </span>
              <span className="feature-card__tag">Trilhas</span>
            </div>
            <h3>Trilhas que respeitam seu ritmo</h3>
            <p>
              Do reconhecimento das teclas a textos reais, cada lição prepara a próxima. Você avança
              com segurança, sem pular etapas.
            </p>

            <div className="trail-map" aria-hidden="true">
              <div className="trail-map__line">
                <span />
              </div>
              {trailSteps.map((step, index) => (
                <div className={`trail-node trail-node--${step.state || 'todo'}`} key={step.label}>
                  <span className="trail-node__dot">
                    {step.state === 'done' ? <Check size={14} /> : index + 1}
                  </span>
                  <span className="trail-node__label">{step.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="feature-card feature-card--feedback" data-reveal>
            <div className="feature-card__top">
              <span className="icon-chip icon-chip--light">
                <Gauge size={21} />
              </span>
              <span className="feature-card__tag feature-card__tag--light">Tempo real</span>
            </div>
            <h3>Feedback em tempo real</h3>
            <p>
              Velocidade e precisão calculadas enquanto você digita. O erro aparece na hora — e vira
              aprendizado.
            </p>

            <div className="gauge-visual" aria-hidden="true">
              <svg viewBox="0 0 150 150">
                <circle className="gauge-visual__track" cx="75" cy="75" r="64" pathLength="100" />
                <circle
                  className="gauge-visual__value"
                  cx="75"
                  cy="75"
                  r="64"
                  pathLength="100"
                  strokeDasharray="72 100"
                />
              </svg>
              <div className="gauge-visual__center">
                <strong>72</strong>
                <span>WPM</span>
              </div>
              <span className="gauge-visual__dot" />
            </div>

            <div className="feedback-line" aria-hidden="true">
              <span className="feedback-line__done">a prática constante</span>
              <span className="feedback-line__cursor">t</span>
              <span className="feedback-line__rest">ransforma o esforço</span>
            </div>

            <div className="feedback-meta">
              <span>
                <i className="dot dot--mint" />
                precisão 98,4%
              </span>
              <span>2 erros</span>
            </div>
          </article>

          <article className="feature-card feature-card--short" data-reveal style={{ '--reveal-delay': '60ms' }}>
            <div className="feature-card__top">
              <span className="icon-chip">
                <Clock size={21} />
              </span>
              <span className="feature-card__tag">Hábito</span>
            </div>
            <h3>Sessões curtas</h3>
            <p>Dez minutos por dia bastam para criar o hábito e sentir a diferença.</p>
            <div className="time-visual" aria-hidden="true">
              <strong>10</strong>
              <span>
                min
                <br />
                por dia
              </span>
              <i />
            </div>
          </article>

          <article className="feature-card feature-card--rewards" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <div className="feature-card__top">
              <span className="icon-chip">
                <Trophy size={21} />
              </span>
              <span className="feature-card__tag">Conquistas</span>
            </div>
            <h3>Recompensas com propósito</h3>
            <p>Metas e sequências que celebram a constância — não a sorte.</p>
            <div className="reward-visual" aria-hidden="true">
              <span className="reward-chip">
                <Trophy size={15} />
                Nível 04
              </span>
              <span className="reward-chip reward-chip--muted">7 dias</span>
              <span className="reward-chip reward-chip--ghost">+120 XP</span>
            </div>
          </article>

          <article className="feature-card feature-card--wide" data-reveal style={{ '--reveal-delay': '80ms' }}>
            <div className="feature-card__wide-copy">
              <div className="feature-card__top">
                <span className="icon-chip">
                  <Chart size={21} />
                </span>
                <span className="feature-card__tag">Evolução</span>
              </div>
              <h3>Seu progresso, sempre visível</h3>
              <p>
                Histórico de velocidade, precisão e tempo de prática em um painel simples de
                entender. Você sabe onde está e para onde está indo.
              </p>
            </div>

            <div className="spark-visual" aria-hidden="true">
              <div className="spark-visual__head">
                <span>Últimas 8 semanas</span>
                <b>+18%</b>
              </div>
              <svg viewBox="0 0 360 112" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="spark-visual__area"
                  d="M4 98 C30 94 42 90 64 86 C90 80 104 84 126 70 C150 56 168 62 190 50 C212 38 230 46 252 34 C276 22 296 28 320 16 C334 10 344 12 356 6 L356 112 L4 112 Z"
                  fill="url(#sparkArea)"
                />
                <path
                  className="spark-visual__line"
                  d="M4 98 C30 94 42 90 64 86 C90 80 104 84 126 70 C150 56 168 62 190 50 C212 38 230 46 252 34 C276 22 296 28 320 16 C334 10 344 12 356 6"
                />
                <circle className="spark-visual__point" cx="356" cy="6" r="4.5" />
              </svg>
              <div className="spark-visual__axis">
                <span>S1</span>
                <span>S2</span>
                <span>S3</span>
                <span>S4</span>
                <span>S5</span>
                <span>S6</span>
                <span>S7</span>
                <span>S8</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
