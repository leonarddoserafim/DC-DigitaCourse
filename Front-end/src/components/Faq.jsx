import SectionHeading from './SectionHeading'
import { Spark } from './Icons'

const faqs = [
  {
    question: 'Preciso saber digitar para começar?',
    answer:
      'Não. O DigitaCourse foi pensado para acompanhar você desde o primeiro contato com as teclas até a fluência. As trilhas começam pelo reconhecimento do teclado e avançam no seu ritmo.',
  },
  {
    question: 'Quanto tempo por dia preciso praticar?',
    answer:
      'Sessões curtas de 10 a 15 minutos ajudam a criar consistência sem sobrecarregar. O importante é a frequência: pouco e sempre costuma render mais do que muito de uma vez só.',
  },
  {
    question: 'O que significam WPM e precisão?',
    answer:
      'WPM (palavras por minuto) mede sua velocidade de digitação. A precisão mostra a proporção de caracteres digitados corretamente. As duas métricas juntas contam uma história mais honesta do que a velocidade isolada.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'A interface é responsiva e funciona em navegadores modernos no computador, tablet ou celular. O treino completo de digitação, porém, foi pensado para teclados físicos.',
  },
  {
    question: 'Como funciona a conta nesta etapa?',
    answer:
      'Você já pode criar uma conta local e entrar na área do aluno. Nesta etapa de front-end, cadastro, login, progresso e preferências ficam salvos apenas no navegador; não há back-end nem envio real de e-mail. A conta de demonstração traz dados de exemplo para explorar todos os recursos.',
  },
]

export default function Faq() {
  return (
    <section className="section faq" id="duvidas" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__left">
          <SectionHeading
            id="faq-title"
            eyebrow="Dúvidas frequentes"
            title={
              <>
                Antes de colocar
                <br />
                os dedos no teclado.
              </>
            }
            description="Reunimos as perguntas mais comuns sobre a plataforma e o treino de digitação."
          />

          <div className="faq__note" data-reveal>
            <Spark size={17} />
            <p>
              Ficou com outra dúvida? O projeto está em construção e novas informações serão
              publicadas conforme as próximas etapas forem entregues.
            </p>
          </div>
        </div>

        <div className="faq__list" data-reveal style={{ '--reveal-delay': '80ms' }}>
          {faqs.map((faq, index) => (
            <details className="faq__item" key={faq.question} open={index === 0}>
              <summary>
                <span className="faq__index">0{index + 1}</span>
                <span className="faq__question">{faq.question}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
