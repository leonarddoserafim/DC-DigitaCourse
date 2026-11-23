import { Check, Flame, Spark, Trophy } from './Icons'

const highlights = [
  'Velocidade e precisão por sessão',
  'Histórico de evolução ao longo das semanas',
  'Metas, sequências e conquistas',
]

export default function ProgressSection() {
  return (
    <section className="section progress" id="progresso" aria-labelledby="progress-title">
      <div className="progress__bg" aria-hidden="true">
        <span className="progress__glow" />
      </div>

      <div className="container progress__grid">
        <div className="progress__copy">
          <span className="section-eyebrow section-eyebrow--light" data-reveal>
            <span />
            Evolução
          </span>
          <h2 id="progress-title" data-reveal>
            Seu esforço vira números que <span className="soft-mark soft-mark--light">fazem sentido.</span>
          </h2>
          <p className="progress__lead" data-reveal>
            Nada de treinar no escuro. Acompanhe sua velocidade média, precisão e hábito de prática
            em um painel claro — e saiba exatamente onde melhorar.
          </p>

          <ul className="progress__list" data-reveal>
            {highlights.map((item) => (
              <li key={item}>
                <span className="check-chip">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="progress__note" data-reveal>
            <Spark size={18} />
            <p>Cada erro é só um dado. O importante é voltar amanhã.</p>
          </div>
        </div>

        <div className="progress__visual">
          <div className="record-float" aria-hidden="true">
            <span className="record-float__icon">
              <Trophy size={19} />
            </span>
            <span>
              <small>Novo recorde pessoal</small>
              <strong>76 WPM</strong>
            </span>
          </div>

          <div className="dashboard" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <div className="dashboard__head">
              <div>
                <span className="dashboard__eyebrow">Painel do aluno</span>
                <strong>Meu progresso</strong>
              </div>
              <span className="range-pill">Últimas 8 semanas</span>
            </div>

            <div className="dashboard__chart">
              <div className="dashboard__chart-head">
                <div>
                  <span>Velocidade média</span>
                  <strong>
                    68 <small>WPM</small>
                  </strong>
                </div>
                <span className="delta-pill">+12%</span>
              </div>

              <svg
                viewBox="0 0 560 220"
                role="img"
                aria-label="Gráfico ilustrativo de evolução da velocidade média, subindo de 50 para 76 palavras por minuto ao longo de oito semanas."
              >
                <defs>
                  <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <g className="chart-grid">
                  <line x1="60" y1="40" x2="536" y2="40" />
                  <line x1="60" y1="84" x2="536" y2="84" />
                  <line x1="60" y1="128" x2="536" y2="128" />
                  <line x1="60" y1="172" x2="536" y2="172" />
                  <text x="44" y="44" textAnchor="end">
                    80
                  </text>
                  <text x="44" y="88" textAnchor="end">
                    70
                  </text>
                  <text x="44" y="132" textAnchor="end">
                    60
                  </text>
                  <text x="44" y="176" textAnchor="end">
                    50
                  </text>
                </g>

                <path
                  className="chart-area"
                  d="M60 180 C84 178 104 175 128 172 C152 169 172 163 196 158 C220 153 240 148 264 142 C288 136 308 132 332 126 C356 120 376 108 400 100 C424 92 444 87 468 82 C492 77 512 63 536 52 L536 200 L60 200 Z"
                  fill="url(#chartArea)"
                />
                <path
                  className="chart-line"
                  pathLength="1"
                  d="M60 180 C84 178 104 175 128 172 C152 169 172 163 196 158 C220 153 240 148 264 142 C288 136 308 132 332 126 C356 120 376 108 400 100 C424 92 444 87 468 82 C492 77 512 63 536 52"
                />
                <circle className="chart-point" cx="536" cy="52" r="5" />
                <g className="chart-point-label">
                  <rect x="498" y="16" width="68" height="24" rx="8" />
                  <text x="532" y="32" textAnchor="middle">
                    76 WPM
                  </text>
                </g>

                <g className="chart-dots">
                  <circle cx="60" cy="180" r="3" />
                  <circle cx="128" cy="172" r="3" />
                  <circle cx="196" cy="158" r="3" />
                  <circle cx="264" cy="142" r="3" />
                  <circle cx="332" cy="126" r="3" />
                  <circle cx="400" cy="100" r="3" />
                  <circle cx="468" cy="82" r="3" />
                </g>

                <g className="chart-labels">
                  <text x="60" y="218" textAnchor="middle">
                    S1
                  </text>
                  <text x="128" y="218" textAnchor="middle">
                    S2
                  </text>
                  <text x="196" y="218" textAnchor="middle">
                    S3
                  </text>
                  <text x="264" y="218" textAnchor="middle">
                    S4
                  </text>
                  <text x="332" y="218" textAnchor="middle">
                    S5
                  </text>
                  <text x="400" y="218" textAnchor="middle">
                    S6
                  </text>
                  <text x="468" y="218" textAnchor="middle">
                    S7
                  </text>
                  <text x="536" y="218" textAnchor="middle">
                    S8
                  </text>
                </g>
              </svg>
            </div>

            <div className="dashboard__stats">
              <div>
                <span>Precisão</span>
                <strong>97,8%</strong>
                <small>+2,4% no período</small>
              </div>
              <div>
                <span>Prática</span>
                <strong>4h32</strong>
                <small>nas últimas semanas</small>
              </div>
              <div>
                <span>Sequência</span>
                <strong>
                  12 <Flame size={14} />
                </strong>
                <small>dias seguidos</small>
              </div>
            </div>

            <div className="dashboard__achievements">
              <span className="dashboard__achievements-label">Conquistas</span>
              <div className="achievement-list">
                <span className="achievement-chip">
                  <Trophy size={14} />
                  Precisão de ouro
                </span>
                <span className="achievement-chip">
                  <Flame size={14} />
                  7 dias seguidos
                </span>
                <span className="achievement-chip achievement-chip--more">+3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
