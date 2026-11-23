import { Spark } from './Icons'

const keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']

export default function PracticeCard() {
  return (
    <div className="practice-wrap">
      <div className="practice-float practice-float--xp" aria-hidden="true">
        <span className="practice-float__icon">
          <Spark size={17} />
        </span>
        <span>
          <small>Meta batida</small>
          <strong>+120 XP</strong>
        </span>
      </div>

      <div className="practice-card">
        <div className="practice-card__bar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="practice-card__path">digitacourse / prática</span>
          <span className="practice-card__timer">01:24</span>
        </div>

        <div className="practice-card__body">
          <div className="practice-card__meta">
            <span className="level-pill">Nível 02</span>
            <span className="practice-card__title">Palavras do dia a dia</span>
            <span className="practice-card__lesson">Lição 04/12</span>
          </div>

          <div className="practice-progress" aria-hidden="true">
            <span style={{ width: '68%' }} />
          </div>

          <div className="typing-stage">
            <div className="typing-stage__label">
              <span>Digite o trecho abaixo</span>
              <span className="live-pill">
                <i />
                ao vivo
              </span>
            </div>

            <p
              className="typing-line"
              aria-label="Exemplo de exercício: a prática constante transforma o esforço em naturalidade"
            >
              <span className="typing-done">a prática constan</span>
              <span className="typing-current">t</span>
              <span className="typing-rest">e transforma o esforço em naturalidade</span>
            </p>

            <div className="typing-stats">
              <div>
                <span>Velocidade</span>
                <strong>
                  72<small>WPM</small>
                </strong>
              </div>
              <div>
                <span>Precisão</span>
                <strong>
                  98,4<small>%</small>
                </strong>
              </div>
              <div>
                <span>Sequência</span>
                <strong>
                  12<small>dias</small>
                </strong>
              </div>
            </div>
          </div>

          <div className="practice-keyboard" aria-hidden="true">
            <div className="practice-keyboard__label">
              <span>teclado</span>
              <span className="practice-keyboard__hint">F e J para se orientar</span>
            </div>
            <div className="keycaps">
              {keys.map((key) => (
                <span
                  key={key}
                  className={`keycap${key === 'f' || key === 'j' ? ' keycap--home' : ''}`}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
