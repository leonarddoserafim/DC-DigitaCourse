import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import AppIcon from '../../components/AppIcon'
import ProgressRing from '../../components/app/ProgressRing'
import EmptyState from '../../components/app/EmptyState'
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  Play,
  Spark,
  Target,
  Trophy,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import { formatNumber } from '../../lib/format'

const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'Diário', label: 'Diários' },
  { id: 'Semanal', label: 'Semanais' },
  { id: 'Mensal', label: 'Mensais' },
]

export default function ChallengesPage() {
  const { challenges, nextLessonInfo, stats } = useApp()
  const [filter, setFilter] = useState('todos')

  usePageMeta(
    'Desafios — DigitaCourse',
    'Metas diárias, semanais e mensais para manter o ritmo de prática.',
  )

  const completed = challenges.filter((challenge) => challenge.complete)
  const availableXp = challenges
    .filter((challenge) => !challenge.complete)
    .reduce((total, challenge) => total + challenge.xp, 0)
  const overall = challenges.length
    ? Math.floor(
        (challenges.reduce((total, challenge) => total + challenge.progress, 0) /
          challenges.length) *
          100,
      )
    : 0
  const practiceHref = nextLessonInfo ? `/app/praticar/${nextLessonInfo.lesson.id}` : '/app/trilhas'

  const filtered = useMemo(() => {
    if (filter === 'todos') return challenges
    return challenges.filter((challenge) => challenge.period === filter)
  }, [challenges, filter])

  return (
    <div className="app-page challenges-page">
      <PageHeader
        eyebrow="Desafios"
        title="Pequenas metas, ritmo constante."
        description="Desafios curtos para dar direção à prática. Cada um combina com a sua rotina — sem pressa e sem punição por pausas."
        actions={
          <Link className="btn btn--primary" to={practiceHref}>
            Praticar e avançar
            <span className="btn__icon">
              <Play size={16} />
            </span>
          </Link>
        }
      />

      <section className="challenge-board" data-reveal>
        <div className="challenge-board__copy">
          <span className="app-eyebrow app-eyebrow--light">Temporada atual</span>
          <h2>
            Seu ritmo está em <span>{overall}%</span>.
          </h2>
          <p>
            {completed.length > 0
              ? `Você já concluiu ${completed.length} de ${challenges.length} desafios. Continue no seu tempo.`
              : 'Nenhum desafio concluído ainda. A primeira prática já coloca você no jogo.'}
          </p>
          <div className="challenge-board__stats">
            <span>
              <CheckCircle size={16} />
              <strong>{completed.length}</strong>
              concluídos
            </span>
            <span>
              <Zap size={16} />
              <strong>{formatNumber(availableXp)}</strong>
              XP disponíveis
            </span>
            <span>
              <Clock size={16} />
              <strong>
                {stats.todaySeconds > 0 ? Math.round(stats.todaySeconds / 60) : 0} min
              </strong>
              praticados hoje
            </span>
          </div>
        </div>
        <div className="challenge-board__ring">
          <ProgressRing
            value={overall}
            size={158}
            stroke={11}
            tone="mint"
            label={`${overall}%`}
            sublabel="da temporada"
            ariaLabel={`Temporada de desafios: ${overall}% concluída.`}
          />
          <span>
            <Spark size={14} />
            Cada prática conta
          </span>
        </div>
      </section>

      <div className="app-filterbar" role="group" aria-label="Filtrar desafios">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`app-filter${filter === item.id ? ' is-active' : ''}`}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
          >
            {item.label}
          </button>
        ))}
        <span className="app-filterbar__count">{filtered.length} desafios</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="compass"
          title="Nenhum desafio neste filtro"
          description="Escolha outro período ou volte para todos os desafios."
          action={
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={() => setFilter('todos')}
            >
              Ver todos
            </button>
          }
        />
      ) : (
        <div className="challenge-grid">
          {filtered.map((challenge) => {
            const percent = Math.round(challenge.progress * 100)
            return (
              <article
                className={`challenge-card challenge-card--${challenge.tone}${
                  challenge.complete ? ' is-complete' : ''
                }`}
                key={challenge.id}
                data-reveal
              >
                <div className="challenge-card__top">
                  <span className="challenge-card__icon">
                    <AppIcon name={challenge.icon} size={21} />
                  </span>
                  <span className="challenge-card__period">{challenge.period}</span>
                  <span className="challenge-card__xp">
                    {challenge.complete ? <CheckCircle size={13} /> : <Zap size={13} />}
                    {challenge.complete ? 'Concluído' : `+${challenge.xp} XP`}
                  </span>
                </div>

                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>

                <div className="challenge-card__progress">
                  <div>
                    <span>
                      {formatNumber(challenge.value, challenge.unit === '%' ? 1 : 0)} de{' '}
                      {challenge.target} {challenge.unit}
                    </span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="app-progress" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="challenge-card__foot">
                  <Link
                    className="challenge-card__link"
                    to={challenge.lessonId ? `/app/praticar/${challenge.lessonId}` : practiceHref}
                  >
                    {challenge.complete ? 'Continuar praticando' : 'Avançar neste desafio'}
                    <ArrowUpRight size={15} />
                  </Link>
                  {challenge.complete && (
                    <span className="challenge-card__seal">
                      <Trophy size={15} />
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <section className="challenge-note" data-reveal>
        <span className="challenge-note__icon">
          <Target size={21} />
        </span>
        <div>
          <h2>Como os desafios funcionam</h2>
          <p>
            O progresso é calculado a partir das suas tentativas registradas na sua conta. As metas
            renovam com o tempo, mas o histórico permanece. Você pode ajustar a meta diária no
            perfil.
          </p>
        </div>
        <Link className="app-panel__link" to="/app/perfil">
          Ajustar preferências
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  )
}
