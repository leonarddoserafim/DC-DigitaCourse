import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import ProgressRing from '../../components/app/ProgressRing'
import EmptyState from '../../components/app/EmptyState'
import AppIcon from '../../components/AppIcon'
import {
  ArrowUpRight,
  CheckCircle,
  Lock,
  Play,
  Spark,
  Star,
  Trophy,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import { formatNumber } from '../../lib/format'

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'desbloqueadas', label: 'Desbloqueadas' },
  { id: 'bloqueadas', label: 'Em progresso' },
]

export default function AchievementsPage() {
  const { achievements, nextLessonInfo, stats } = useApp()
  const [filter, setFilter] = useState('todas')

  usePageMeta(
    'Conquistas — DigitaCourse',
    'Veja as conquistas desbloqueadas e o que falta para a próxima marca.',
  )

  const unlocked = achievements.filter((achievement) => achievement.unlocked)
  const percent = achievements.length
    ? Math.round((unlocked.length / achievements.length) * 100)
    : 0
  const nextAchievement = [...achievements]
    .filter((achievement) => !achievement.unlocked)
    .sort((a, b) => b.progress - a.progress)[0]
  const practiceHref = nextLessonInfo ? `/app/praticar/${nextLessonInfo.lesson.id}` : '/app/trilhas'

  const filtered = useMemo(() => {
    if (filter === 'desbloqueadas') {
      return achievements.filter((achievement) => achievement.unlocked)
    }
    if (filter === 'bloqueadas') {
      return achievements.filter((achievement) => !achievement.unlocked)
    }
    return achievements
  }, [achievements, filter])

  return (
    <div className="app-page achievements-page">
      <PageHeader
        eyebrow="Conquistas"
        title="Marcos que contam uma história."
        description="Conquistas não são troféus vazios: cada uma representa um hábito que você construiu no teclado."
        actions={
          <Link className="btn btn--primary" to={practiceHref}>
            Buscar próxima conquista
            <span className="btn__icon">
              <Play size={16} />
            </span>
          </Link>
        }
      />

      <section className="achievements-summary" data-reveal>
        <div className="achievements-summary__ring">
          <ProgressRing
            value={percent}
            size={150}
            stroke={11}
            tone="amber"
            label={`${unlocked.length}/${achievements.length}`}
            sublabel="desbloqueadas"
            ariaLabel={`${unlocked.length} de ${achievements.length} conquistas desbloqueadas.`}
          />
        </div>
        <div className="achievements-summary__copy">
          <span className="app-eyebrow">Seu mural</span>
          <h2>
            {unlocked.length} de {achievements.length} conquistas já são suas.
          </h2>
          <p>
            {nextAchievement
              ? `A mais próxima é “${nextAchievement.title}”. Faltam ${formatNumber(
                  nextAchievement.remaining,
                  nextAchievement.decimals ?? 0,
                )} ${nextAchievement.unit}.`
              : 'Você desbloqueou todas as conquistas disponíveis nesta etapa. Agora é manter o ritmo.'}
          </p>
          <div className="achievements-summary__stats">
            <span>
              <Star size={16} />
              <strong>{stats.xp}</strong>
              XP acumulados
            </span>
            <span>
              <Zap size={16} />
              <strong>{stats.level}</strong>
              nível atual
            </span>
            <span>
              <CheckCircle size={16} />
              <strong>{stats.lessonsCompleted}</strong>
              lições concluídas
            </span>
          </div>
        </div>
        {nextAchievement && (
          <aside className="achievements-next">
            <span className="achievements-next__icon">
              <AppIcon name={nextAchievement.icon} size={24} />
            </span>
            <span className="achievements-next__label">Mais perto de você</span>
            <strong>{nextAchievement.title}</strong>
            <p>{nextAchievement.description}</p>
            <div className="app-progress app-progress--dark" aria-hidden="true">
              <span style={{ width: `${nextAchievement.progress * 100}%` }} />
            </div>
            <small>
              {formatNumber(nextAchievement.current, nextAchievement.decimals ?? 0)} de{' '}
              {nextAchievement.target} {nextAchievement.unit}
            </small>
          </aside>
        )}
      </section>

      <div className="app-filterbar" role="group" aria-label="Filtrar conquistas">
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
        <span className="app-filterbar__count">{filtered.length} conquistas</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="Nada por aqui ainda"
          description={
            filter === 'desbloqueadas'
              ? 'Sua primeira conquista está a uma prática de distância.'
              : 'Você já desbloqueou tudo o que este filtro mostra. Que tal trocar de aba?'
          }
          action={
            <Link className="btn btn--primary btn--sm" to={practiceHref}>
              Praticar agora
              <ArrowUpRight size={15} />
            </Link>
          }
        />
      ) : (
        <div className="achievement-grid">
          {filtered.map((achievement) => {
            const percentValue = Math.round(achievement.progress * 100)
            return (
              <article
                className={`achievement-card achievement-card--${achievement.tone}${
                  achievement.unlocked ? ' is-unlocked' : ' is-locked'
                }`}
                key={achievement.id}
                data-reveal
              >
                <div className="achievement-card__top">
                  <span className="achievement-card__icon">
                    <AppIcon name={achievement.icon} size={24} />
                  </span>
                  <span className="achievement-card__status">
                    {achievement.unlocked ? (
                      <>
                        <CheckCircle size={14} />
                        Desbloqueada
                      </>
                    ) : (
                      <>
                        <Lock size={13} />
                        Em progresso
                      </>
                    )}
                  </span>
                </div>

                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>

                <div className="achievement-card__progress">
                  <div>
                    <span>
                      {formatNumber(achievement.current, achievement.decimals ?? 0)} /{' '}
                      {achievement.target} {achievement.unit}
                    </span>
                    <strong>{percentValue}%</strong>
                  </div>
                  <div className="app-progress" aria-hidden="true">
                    <span style={{ width: `${percentValue}%` }} />
                  </div>
                </div>

                <div className="achievement-card__foot">
                  {achievement.unlocked ? (
                    <span className="achievement-card__earned">
                      <Trophy size={15} />
                      No seu mural
                    </span>
                  ) : (
                    <span className="achievement-card__remaining">
                      <Spark size={14} />
                      Faltam {formatNumber(achievement.remaining, achievement.decimals ?? 0)}{' '}
                      {achievement.unit}
                    </span>
                  )}
                  <Link className="achievement-card__action" to={practiceHref}>
                    Praticar
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <section className="achievements-note" data-reveal>
        <Trophy size={22} />
        <div>
          <strong>Conquistas são permanentes.</strong>
          <p>
            Uma vez desbloqueadas, elas ficam no seu mural mesmo que você repita lições antigas. O
            histórico completo pode ser consultado na página de progresso.
          </p>
        </div>
        <Link className="app-panel__link" to="/app/progresso">
          Ver progresso
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  )
}
