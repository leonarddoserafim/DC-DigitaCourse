import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import ProgressRing from '../../components/app/ProgressRing'
import CourseCard from '../../components/app/CourseCard'
import EmptyState from '../../components/app/EmptyState'
import { ArrowUpRight, CheckCircle, Clock, Play, Route } from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import { formatMinutesFromSeconds } from '../../lib/format'

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'concluidas', label: 'Concluídas' },
  { id: 'iniciar', label: 'Não iniciadas' },
]

export default function CoursesPage() {
  const { courses, stats, nextLessonInfo } = useApp()
  const [filter, setFilter] = useState('todas')

  usePageMeta('Trilhas — DigitaCourse', 'Explore as trilhas e lições do DigitaCourse.')

  const totalLessons = courses.reduce((total, course) => total + course.totalLessons, 0)
  const overallPercent = totalLessons
    ? Math.round((stats.lessonsCompleted / totalLessons) * 100)
    : 0
  const practiceHref = nextLessonInfo ? `/app/praticar/${nextLessonInfo.lesson.id}` : '/app/trilhas'

  const filtered = useMemo(() => {
    if (filter === 'andamento')
      return courses.filter((course) => course.started && !course.complete)
    if (filter === 'concluidas') return courses.filter((course) => course.complete)
    if (filter === 'iniciar') return courses.filter((course) => !course.started)
    return courses
  }, [courses, filter])

  return (
    <div className="app-page courses-page">
      <PageHeader
        eyebrow="Trilhas"
        title="Uma jornada, três níveis."
        description="Comece pela base, ganhe vocabulário e termine digitando textos completos com confiança."
        actions={
          <Link className="btn btn--primary" to={practiceHref}>
            Continuar praticando
            <span className="btn__icon">
              <Play size={16} />
            </span>
          </Link>
        }
      />

      <section className="course-overview" data-reveal>
        <div className="course-overview__ring">
          <ProgressRing
            value={overallPercent}
            size={124}
            stroke={9}
            tone="teal"
            label={`${overallPercent}%`}
            sublabel="da jornada"
          />
        </div>
        <div className="course-overview__copy">
          <span className="app-eyebrow">Seu avanço geral</span>
          <h2>
            {stats.lessonsCompleted} de {totalLessons} lições concluídas
          </h2>
          <p>
            {nextLessonInfo
              ? `A próxima parada é “${nextLessonInfo.lesson.title}”, em ${nextLessonInfo.course.title}.`
              : 'Você concluiu todas as lições disponíveis. Hora de revisar e bater recordes.'}
          </p>
        </div>
        <div className="course-overview__stats">
          <span>
            <CheckCircle size={17} />
            <strong>{stats.lessonsCompleted}</strong>
            lições
          </span>
          <span>
            <Clock size={17} />
            <strong>{formatMinutesFromSeconds(stats.totalSeconds)}</strong>
            praticadas
          </span>
          <span>
            <Route size={17} />
            <strong>{courses.filter((course) => course.started).length}</strong>
            trilhas iniciadas
          </span>
        </div>
      </section>

      <div className="app-filterbar" role="group" aria-label="Filtrar trilhas">
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
        <span className="app-filterbar__count">{filtered.length} trilhas</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="route"
          title="Nenhuma trilha neste filtro"
          description="Troque o filtro ou comece uma nova trilha para ver seu progresso aqui."
          action={
            <Link className="btn btn--primary btn--sm" to={practiceHref}>
              Continuar praticando
              <ArrowUpRight size={15} />
            </Link>
          }
        />
      ) : (
        <div className="courses-grid courses-grid--page">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} featured />
          ))}
        </div>
      )}
    </div>
  )
}
