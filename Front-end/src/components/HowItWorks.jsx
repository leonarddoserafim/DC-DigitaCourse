import SectionHeading from './SectionHeading'
import { Chart, Keyboard, Spark, Target } from './Icons'

const steps = [
  {
    icon: Target,
    title: 'Descubra seu ponto de partida',
    text: 'Comece pelo nível que combina com você e familiarize-se com o teclado, uma tecla de cada vez.',
    hint: 'Nível iniciante',
  },
  {
    icon: Keyboard,
    title: 'Pratique todos os dias',
    text: 'Exercícios curtos e progressivos, com correções e métricas enquanto você digita.',
    hint: '10 minutos por dia',
  },
  {
    icon: Chart,
    title: 'Acompanhe a evolução',
    text: 'Veja velocidade, precisão e sequência crescerem ao longo das semanas.',
    hint: 'Progresso visível',
  },
]

export default function HowItWorks() {
  return (
    <section className="section how" id="como-funciona" aria-labelledby="how-title">
      <div className="container">
        <div className="how__head">
          <SectionHeading
            id="how-title"
            eyebrow="Como funciona"
            title={
              <>
                Três passos.
                <br />
                Uma tecla de cada vez.
              </>
            }
          />
          <p className="how__aside" data-reveal>
            Sem fórmulas mágicas: prática guiada, feedback honesto e constância. O resto é
            consequência.
          </p>
        </div>

        <ol className="steps">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <li
                className="step"
                key={step.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
              >
                <div className="step__top">
                  <span className="step__number">0{index + 1}</span>
                  <span className="step__icon">
                    <Icon size={23} />
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className="step__hint">{step.hint}</span>
              </li>
            )
          })}
        </ol>

        <div className="how__note" data-reveal>
          <span className="how__note-icon">
            <Spark size={19} />
          </span>
          <p>
            <strong>A constância vence a intensidade.</strong> No começo, foque em acertar. A
            velocidade vem como consequência.
          </p>
        </div>
      </div>
    </section>
  )
}
