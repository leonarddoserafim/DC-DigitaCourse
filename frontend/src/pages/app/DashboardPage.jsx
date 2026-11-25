import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import StatCard from '../../components/app/StatCard'
import ProgressRing from '../../components/app/ProgressRing'
import BarChart from '../../components/app/BarChart'
import CourseCard from '../../components/app/CourseCard'
import EmptyState from '../../components/app/EmptyState'
import AppIcon from '../../components/AppIcon'
import {
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  Play,
  Spark,
  Target,
  Trophy,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import {
  formatDate,
  formatMinutesFromSeconds,
  formatNumber,
  formatRelativeTime,
  getGreeting,
} from '../../lib/format'

export default function DashboardPage() {
  const {
    user,
    stats,
    courses,
    nextLessonInfo,
    achievements,
    challenges,
    weeklyActivity,
    prefs,
    attempts,
  } = useApp()

  usePageMeta('Visão geral — DigitaCourse', 'Seu painel de evolução no DigitaCourse.')

  const firstName = user?.name?.split(' ')[0] ?? 'aluno'
  const goal = prefs.dailyGoalMinutes ?? 10
  const todayMinutes = Math.round(stats.todaySeconds / 60)
  const goalPercent = Math.min(100, Math.round((todayMinutes / goal) * 100))
  const weeklyTotal = Math.round(weeklyActivity.reduce((total, day) => total + day.minutes, 0))
  const dailyChallenge = challenges[0]
  const earned = achievements.filter((achievement) => achievement.unlocked)
  const previewAchievements = [...earned, ...achievements.filter((item) => !item.unlocked)].slice(
    0,
    3,
  )
  const recentAttempts = attempts.slice(0, 4)
  const practiceHref = nextLessonInfo ? `/app/praticar/${nextLessonInfo.lesson.id}` : '/app/trilhas'

  return (
    <div className="app-page dashboard-page">
      <PageHeader
        eyebrow="Visão geral"
        title={`${getGreeting()}, ${firstName}.`}
        description={
          goalPercent >= 100
            ? 'Meta diária concluída. Cada minuto extra é lucro para a sua fluência.'
            : todayMinutes > 0
              ? `Você já praticou ${todayMinutes} min hoje. Faltam ${Math.max(
                  0,
                  goal - todayMinutes,
                )} min para fechar a meta.`
              : 'Sua próxima sessão começa com uma tecla. Que tal alguns minutos agora?'
        }
        actions={
          <>
            <Link className="btn btn--primary" to={practiceHref}>
              Praticar agora
              <span className="btn__icon">
                <Play size={16} />
              </span>
            </Link>
            <Link className="btn btn--outline app-btn-light" to="/app/progresso">
              Ver progresso
            </Link>
          </>
        }
      />

      <div className="dash-hero">
        {nextLessonInfo && (
          <section className="dash-continue" data-reveal>
            <div className="dash-continue__copy">
              <span className="dash-continue__badge">
                <Spark size={14} />
                Continue de onde parou
              </span>
              <span className="dash-continue__course">{nextLessonInfo.course.title}</span>
              <h2>{nextLessonInfo.lesson.title}</h2>
              <p>{nextLessonInfo.lesson.description}</p>

              <div className="dash-continue__meta">
                <span>
                  <Clock size={14} />
                  {nextLessonInfo.lesson.duration} min
                </span>
                <span>
                  <Zap size={14} />
                  {nextLessonInfo.lesson.xp} XP
                </span>
                <span>{nextLessonInfo.lesson.moduleTitle}</span>
              </div>

              <div className="dash-continue__progress">
                <div>
                  <span>Progresso da trilha</span>
                  <strong>{nextLessonInfo.course.percent}%</strong>
                </div>
                <div className="app-progress app-progress--dark" aria-hidden="true">
                  <span style={{ width: `${nextLessonInfo.course.percent}%` }} />
                </div>
              </div>

              <Link className="btn btn--mint" to={`/app/praticar/${nextLessonInfo.lesson.id}`}>
                Retomar lição
                <span className="btn__icon">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </div>

            <div className="dash-continue__visual" aria-hidden="true">
              <span className="dash-continue__key dash-continue__key--f">F</span>
              <span className="dash-continue__key dash-continue__key--j">J</span>
              <div className="dash-continue__ring">
                <ProgressRing
                  value={nextLessonInfo.course.percent}
                  size={154}
                  stroke={11}
                  tone="mint"
                  label={`${nextLessonInfo.course.percent}%`}
                  sublabel="da trilha"
                />
              </div>
              <span className="dash-continue__caption">
                lição {nextLessonInfo.course.completedCount + 1} de{' '}
                {nextLessonInfo.course.totalLessons}
              </span>
            </div>
          </section>
        )}

        <aside className="dash-goal" data-reveal>
          <div className="dash-goal__head">
            <span>
              <Target size={16} />
              Meta de hoje
            </span>
            <strong>{goal} min</strong>
          </div>
          <ProgressRing
            value={goalPercent}
            size={138}
            stroke={10}
            tone={goalPercent >= 100 ? 'mint' : 'amber'}
            label={`${goalPercent}%`}
            sublabel={`${todayMinutes} de ${goal} min`}
            ariaLabel={`Meta diária: ${goalPercent}% concluída, ${todayMinutes} de ${goal} minutos.`}
          />
          <p>
            {goalPercent >= 100
              ? 'Meta concluída! Sua sequência agradece.'
              : `Faltam ${Math.max(0, goal - todayMinutes)} minutos. Sessões curtas também contam.`}
          </p>
          <Link className="dash-goal__link" to={practiceHref}>
            {goalPercent >= 100 ? 'Praticar mais um pouco' : 'Fechar a meta agora'}
            <ChevronRight size={15} />
          </Link>
        </aside>
      </div>

      <div className="stat-grid">
        <StatCard
          icon="gauge"
          label="Velocidade média"
          value={formatNumber(stats.avgWpm)}
          suffix="WPM"
          hint="média dos últimos 10 exercícios"
          delta={stats.wpmDelta}
          tone="mint"
        />
        <StatCard
          icon="target"
          label="Precisão"
          value={formatNumber(stats.avgAccuracy, 1)}
          suffix="%"
          hint="média dos últimos 10 exercícios"
          delta={stats.accuracyDelta}
          tone="teal"
        />
        <StatCard
          icon="flame"
          label="Sequência atual"
          value={formatNumber(stats.streak)}
          suffix="dias"
          hint={stats.streak > 0 ? 'continue sem quebrar o ritmo' : 'comece uma nova sequência'}
          tone="amber"
        />
        <StatCard
          icon="clock"
          label="Tempo de prática"
          value={formatMinutesFromSeconds(stats.totalSeconds)}
          hint={`${stats.lessonsCompleted} lições concluídas`}
          tone="coral"
        />
      </div>

      <div className="dash-grid dash-grid--activity">
        <section className="app-panel app-panel--activity" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Ritmo da semana</span>
              <h2>{weeklyTotal} min de prática</h2>
              <p>Últimos sete dias · metas e pausas no mesmo lugar.</p>
            </div>
            <Link className="app-panel__link" to="/app/progresso">
              Ver detalhes
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {weeklyTotal === 0 ? (
            <EmptyState
              icon="chart"
              title="Sua semana está em branco"
              description="Faça a primeira sessão para começar a desenhar sua evolução."
              action={
                <Link className="btn btn--primary btn--sm" to={practiceHref}>
                  Praticar agora
                </Link>
              }
            />
          ) : (
            <BarChart data={weeklyActivity} goal={goal} />
          )}

          <div className="app-panel__foot">
            <span>
              <Flame size={15} />
              Sequência de {stats.streak} dias
            </span>
            <span>Meta diária: {goal} min</span>
          </div>
        </section>

        {dailyChallenge && (
          <section className="dash-challenge" data-reveal>
            <div className="dash-challenge__top">
              <span className="dash-challenge__icon">
                <AppIcon name={dailyChallenge.icon} size={22} />
              </span>
              <span className="dash-challenge__tag">Desafio de hoje</span>
              <span className="dash-challenge__xp">+{dailyChallenge.xp} XP</span>
            </div>
            <h2>{dailyChallenge.title}</h2>
            <p>{dailyChallenge.description}</p>
            <div className="dash-challenge__progress">
              <div>
                <span>
                  {formatNumber(dailyChallenge.value, 1)} de {dailyChallenge.target}{' '}
                  {dailyChallenge.unit}
                </span>
                <strong>{Math.round(dailyChallenge.progress * 100)}%</strong>
              </div>
              <div className="app-progress app-progress--dark" aria-hidden="true">
                <span style={{ width: `${dailyChallenge.progress * 100}%` }} />
              </div>
            </div>
            <Link className="dash-challenge__link" to={practiceHref}>
              {dailyChallenge.complete ? 'Desafio concluído' : 'Entrar no desafio'}
              {dailyChallenge.complete ? <CheckCircle size={16} /> : <ArrowUpRight size={16} />}
            </Link>
          </section>
        )}
      </div>

      <section className="dash-section" data-reveal>
        <div className="dash-section__head">
          <div>
            <span className="app-eyebrow">Trilhas</span>
            <h2>Seu próximo passo</h2>
          </div>
          <Link className="app-panel__link" to="/app/trilhas">
            Ver todas
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <div className="dash-grid dash-grid--bottom">
        <section className="app-panel" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Conquistas</span>
              <h2>
                {earned.length} de {achievements.length} desbloqueadas
              </h2>
            </div>
            <Link className="app-panel__link" to="/app/conquistas">
              Ver mural
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="achievement-preview">
            {previewAchievements.map((achievement) => (
              <Link
                className={`achievement-mini${achievement.unlocked ? ' is-unlocked' : ''}`}
                key={achievement.id}
                to="/app/conquistas"
              >
                <span
                  className={`achievement-mini__icon achievement-mini__icon--${achievement.tone}`}
                >
                  <AppIcon name={achievement.icon} size={19} />
                </span>
                <span>
                  <strong>{achievement.title}</strong>
                  <small>
                    {achievement.unlocked
                      ? 'Conquista desbloqueada'
                      : `${formatNumber(achievement.current, achievement.decimals ?? 0)} de ${
                          achievement.target
                        } ${achievement.unit}`}
                  </small>
                </span>
                {achievement.unlocked ? <CheckCircle size={16} /> : <Trophy size={15} />}
              </Link>
            ))}
          </div>
        </section>

        <section className="app-panel" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Histórico</span>
              <h2>Últimas práticas</h2>
            </div>
            <Link className="app-panel__link" to="/app/progresso">
              Ver tudo
              <ChevronRight size={15} />
            </Link>
          </div>

          {recentAttempts.length === 0 ? (
            <EmptyState
              icon="keyboard"
              title="Nenhuma prática ainda"
              description="Seu histórico aparece aqui depois da primeira lição."
              action={
                <Link className="btn btn--primary btn--sm" to={practiceHref}>
                  Começar primeira lição
                </Link>
              }
            />
          ) : (
            <div className="recent-list">
              {recentAttempts.map((attempt) => (
                <Link
                  className="recent-item"
                  key={attempt.id}
                  to={`/app/praticar/${attempt.lessonId}`}
                >
                  <span className="recent-item__icon">
                    <AppIcon name="keyboard" size={16} />
                  </span>
                  <span className="recent-item__body">
                    <strong>{attempt.lessonTitle}</strong>
                    <small>
                      {attempt.courseTitle} · {formatRelativeTime(attempt.createdAt)}
                    </small>
                  </span>
                  <span className="recent-item__metrics">
                    <strong>{attempt.wpm} WPM</strong>
                    <small>{formatNumber(attempt.accuracy, 1)}%</small>
                  </span>
                  <span className="recent-item__xp">+{attempt.xp} XP</span>
                </Link>
              ))}
            </div>
          )}

          <p className="app-panel__footnote">
            Última prática em {stats.lastAttemptAt ? formatDate(stats.lastAttemptAt) : '—'}.
          </p>
        </section>
      </div>
    </div>
  )
}
