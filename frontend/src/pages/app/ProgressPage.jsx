import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import StatCard from '../../components/app/StatCard'
import LineChart from '../../components/app/LineChart'
import BarChart from '../../components/app/BarChart'
import EmptyState from '../../components/app/EmptyState'
import AppIcon from '../../components/AppIcon'
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Flame,
  Gauge,
  Play,
  Target,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import {
  formatDate,
  formatFullDate,
  formatMinutesFromSeconds,
  formatNumber,
  formatRelativeTime,
} from '../../lib/format'

const metrics = [
  { id: 'wpm', label: 'Velocidade', suffix: ' WPM' },
  { id: 'accuracy', label: 'Precisão', suffix: '%' },
]

export default function ProgressPage() {
  const { stats, attempts, weeklyActivity, heatmap, courses, nextLessonInfo, prefs } = useApp()
  const [metric, setMetric] = useState('wpm')

  usePageMeta(
    'Progresso — DigitaCourse',
    'Acompanhe velocidade, precisão, tempo de prática e histórico de exercícios.',
  )

  const practiceHref = nextLessonInfo ? `/app/praticar/${nextLessonInfo.lesson.id}` : '/app/trilhas'
  const goal = prefs.dailyGoalMinutes ?? 10
  const weeklyTotal = Math.round(weeklyActivity.reduce((total, day) => total + day.minutes, 0))
  const activeDays = weeklyActivity.filter((day) => day.minutes > 0).length

  const chartData = useMemo(
    () =>
      [...attempts]
        .slice(0, 14)
        .reverse()
        .map((attempt) => ({
          label: formatDate(attempt.createdAt, { day: '2-digit', month: '2-digit' }),
          value:
            metric === 'accuracy'
              ? Number(Number(attempt.accuracy).toFixed(1))
              : Math.round(attempt.wpm),
        })),
    [attempts, metric],
  )

  const activeMetric = metrics.find((item) => item.id === metric) ?? metrics[0]
  const latest = attempts[0]
  const lessonsInProgress = courses.filter((course) => course.started && !course.complete)

  return (
    <div className="app-page progress-page">
      <PageHeader
        eyebrow="Progresso"
        title="Sua evolução, sem achismo."
        description="Cada tentativa vira dado. Veja onde você ganhou velocidade, onde a precisão oscilou e qual é o próximo passo."
        actions={
          <Link className="btn btn--primary" to={practiceHref}>
            Nova prática
            <span className="btn__icon">
              <Play size={16} />
            </span>
          </Link>
        }
      />

      <div className="stat-grid">
        <StatCard
          icon="gauge"
          label="Velocidade média"
          value={formatNumber(stats.avgWpm)}
          suffix="WPM"
          hint="últimos 10 exercícios"
          delta={stats.wpmDelta}
          tone="mint"
        />
        <StatCard
          icon="target"
          label="Precisão média"
          value={formatNumber(stats.avgAccuracy, 1)}
          suffix="%"
          hint="últimos 10 exercícios"
          delta={stats.accuracyDelta}
          tone="teal"
        />
        <StatCard
          icon="flame"
          label="Sequência"
          value={formatNumber(stats.streak)}
          suffix="dias"
          hint={activeDays ? `${activeDays} dias ativos nesta semana` : 'pratique para iniciar'}
          tone="amber"
        />
        <StatCard
          icon="clock"
          label="Tempo total"
          value={formatMinutesFromSeconds(stats.totalSeconds)}
          hint={`${stats.attempts} tentativas registradas`}
          tone="coral"
        />
      </div>

      <div className="progress-main-grid">
        <section className="app-panel progress-chart-panel" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Curva de evolução</span>
              <h2>{activeMetric.label} por exercício</h2>
              <p>Últimas {chartData.length} tentativas registradas nesta conta.</p>
            </div>
            <div className="app-segmented" role="group" aria-label="Métrica do gráfico">
              {metrics.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={metric === item.id ? 'is-active' : ''}
                  onClick={() => setMetric(item.id)}
                  aria-pressed={metric === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <LineChart
            data={chartData}
            tone={metric === 'wpm' ? 'teal' : 'mint'}
            suffix={activeMetric.suffix}
            height={280}
            emptyLabel="Pratique pelo menos uma lição para começar a desenhar sua curva."
          />

          {chartData.length > 0 && (
            <div className="app-panel__foot">
              <span>
                <Gauge size={15} />
                Melhor marca:{' '}
                {metric === 'wpm'
                  ? `${stats.bestWpm} WPM`
                  : `${formatNumber(stats.bestAccuracy, 1)}%`}
              </span>
              <span>Última prática {latest ? formatRelativeTime(latest.createdAt) : '—'}</span>
            </div>
          )}
        </section>

        <aside className="progress-side" data-reveal>
          <section className="app-panel progress-records">
            <span className="app-eyebrow">Recordes pessoais</span>
            <h2>Suas melhores marcas</h2>
            <ul>
              <li>
                <span className="progress-records__icon progress-records__icon--mint">
                  <Gauge size={18} />
                </span>
                <span>
                  <strong>{stats.bestWpm} WPM</strong>
                  melhor velocidade
                </span>
              </li>
              <li>
                <span className="progress-records__icon progress-records__icon--teal">
                  <Target size={18} />
                </span>
                <span>
                  <strong>{formatNumber(stats.bestAccuracy, 1)}%</strong>
                  melhor precisão
                </span>
              </li>
              <li>
                <span className="progress-records__icon progress-records__icon--amber">
                  <Flame size={18} />
                </span>
                <span>
                  <strong>{stats.streak} dias</strong>
                  sequência atual
                </span>
              </li>
              <li>
                <span className="progress-records__icon progress-records__icon--coral">
                  <Zap size={18} />
                </span>
                <span>
                  <strong>{formatNumber(stats.xp)} XP</strong>
                  experiência acumulada
                </span>
              </li>
            </ul>
            <div className="progress-records__level">
              <div>
                <span>Nível {stats.level}</span>
                <strong>
                  {stats.levelXp}/{stats.levelXpTarget} XP
                </strong>
              </div>
              <div className="app-progress" aria-hidden="true">
                <span style={{ width: `${(stats.levelXp / stats.levelXpTarget) * 100}%` }} />
              </div>
            </div>
          </section>

          <section className="progress-insight">
            <span className="progress-insight__icon">
              <Target size={19} />
            </span>
            <div>
              <strong>
                {stats.avgAccuracy >= 98
                  ? 'Precisão excelente'
                  : stats.avgAccuracy >= 96
                    ? 'Precisão consistente'
                    : 'Precisão pede atenção'}
              </strong>
              <p>
                {stats.avgAccuracy >= 98
                  ? 'Você está na faixa em que a velocidade pode crescer sem perder qualidade.'
                  : 'Reduza um pouco o ritmo nas próximas lições. Acertar mais também acelera.'}
              </p>
            </div>
          </section>
        </aside>
      </div>

      <div className="progress-lower-grid">
        <section className="app-panel progress-week" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Ritmo da semana</span>
              <h2>{weeklyTotal} min de prática</h2>
              <p>
                Meta diária de {goal} minutos · {activeDays} de 7 dias ativos.
              </p>
            </div>
            <span className="progress-week__badge">
              <Calendar size={14} />7 dias
            </span>
          </div>
          <BarChart data={weeklyActivity} goal={goal} />
        </section>

        <section className="app-panel progress-heatmap" data-reveal>
          <div className="app-panel__head">
            <div>
              <span className="app-eyebrow">Constância</span>
              <h2>Últimas 8 semanas</h2>
              <p>Cada quadrado representa um dia de prática.</p>
            </div>
          </div>
          <div className="heatmap" aria-label="Mapa de calor de prática das últimas oito semanas">
            {heatmap.map((day) => (
              <span
                key={day.key}
                className={`heatmap__cell heatmap__cell--${day.level}`}
                title={day.label}
              />
            ))}
          </div>
          <div className="heatmap__legend">
            <span>Menos</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} className={`heatmap__cell heatmap__cell--${level}`} />
            ))}
            <span>Mais</span>
          </div>
        </section>
      </div>

      <section className="app-panel progress-courses" data-reveal>
        <div className="app-panel__head">
          <div>
            <span className="app-eyebrow">Jornada</span>
            <h2>Progresso por trilha</h2>
            <p>
              {lessonsInProgress.length} trilha em andamento · {stats.lessonsCompleted} lições
              concluídas.
            </p>
          </div>
          <Link className="app-panel__link" to="/app/trilhas">
            Ver trilhas
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="progress-course-list">
          {courses.map((course) => (
            <Link className="progress-course" to={`/app/trilhas/${course.id}`} key={course.id}>
              <span className={`progress-course__icon progress-course__icon--${course.tone}`}>
                <AppIcon name="route" size={18} />
              </span>
              <span className="progress-course__body">
                <span className="progress-course__top">
                  <strong>{course.title}</strong>
                  <small>
                    {course.completedCount}/{course.totalLessons} lições
                  </small>
                </span>
                <span className="app-progress" aria-hidden="true">
                  <span style={{ width: `${course.percent}%` }} />
                </span>
              </span>
              <span className="progress-course__percent">{course.percent}%</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-panel progress-history" data-reveal>
        <div className="app-panel__head">
          <div>
            <span className="app-eyebrow">Histórico</span>
            <h2>Tentativas recentes</h2>
            <p>As {Math.min(12, attempts.length)} práticas mais recentes da conta.</p>
          </div>
          <span className="progress-history__count">{stats.attempts} no total</span>
        </div>

        {attempts.length === 0 ? (
          <EmptyState
            icon="keyboard"
            title="Seu histórico começa na primeira lição"
            description="As tentativas aparecem aqui com velocidade, precisão, tempo e XP."
            action={
              <Link className="btn btn--primary btn--sm" to={practiceHref}>
                Fazer primeira prática
              </Link>
            }
          />
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Lição</th>
                  <th scope="col">Quando</th>
                  <th scope="col">Velocidade</th>
                  <th scope="col">Precisão</th>
                  <th scope="col">Tempo</th>
                  <th scope="col">XP</th>
                  <th scope="col">
                    <span className="sr-only">Ação</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 12).map((attempt) => (
                  <tr key={attempt.id}>
                    <td>
                      <span className="history-table__lesson">
                        <AppIcon name="keyboard" size={15} />
                        <span>
                          <strong>{attempt.lessonTitle}</strong>
                          <small>{attempt.courseTitle}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span title={formatFullDate(attempt.createdAt)}>
                        {formatRelativeTime(attempt.createdAt)}
                      </span>
                    </td>
                    <td>
                      <strong>{attempt.wpm}</strong> WPM
                    </td>
                    <td>
                      <span
                        className={`history-table__accuracy${
                          attempt.accuracy >= 98 ? ' is-gold' : ''
                        }`}
                      >
                        {formatNumber(attempt.accuracy, 1)}%
                      </span>
                    </td>
                    <td>{formatMinutesFromSeconds(attempt.durationSeconds)}</td>
                    <td>
                      <span className="history-table__xp">+{attempt.xp}</span>
                    </td>
                    <td>
                      <Link
                        className="history-table__action"
                        to={`/app/praticar/${attempt.lessonId}`}
                        aria-label={`Repetir ${attempt.lessonTitle}`}
                      >
                        <Play size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="progress-footnote" data-reveal>
        <CheckCircle size={16} />
        <span>
          Os dados desta página são calculados a partir das tentativas salvas no PostgreSQL e
          carregadas pela API do DigitaCourse.
        </span>
      </div>
    </div>
  )
}
