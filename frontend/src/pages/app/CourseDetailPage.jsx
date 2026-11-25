import { Link, useParams } from 'react-router-dom'
import ProgressRing from '../../components/app/ProgressRing'
import EmptyState from '../../components/app/EmptyState'
import { BookOpen, CheckCircle, Clock, Lock, Play, Zap } from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'
import { formatMinutesFromSeconds } from '../../lib/format'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { courses, stats, isLessonUnlocked } = useApp()
  const course = courses.find((item) => item.id === courseId)

  usePageMeta(
    course ? `${course.title} — DigitaCourse` : 'Trilha não encontrada — DigitaCourse',
    course?.description,
  )

  if (!course) {
    return (
      <div className="app-page">
        <EmptyState
          icon="route"
          title="Trilha não encontrada"
          description="O endereço pode estar incorreto ou a trilha não está mais disponível."
          action={
            <Link className="btn btn--primary" to="/app/trilhas">
              Voltar para as trilhas
            </Link>
          }
        />
      </div>
    )
  }

  const nextLesson = course.nextLesson
  const practiceHref = nextLesson ? `/app/praticar/${nextLesson.id}` : '/app/trilhas'
  const ctaLabel = course.complete
    ? 'Revisar última lição'
    : course.started
      ? 'Continuar trilha'
      : 'Começar trilha'

  return (
    <div className="app-page course-detail-page">
      <div className="app-back-row" data-reveal>
        <Link className="app-back-link" to="/app/trilhas">
          <ArrowBack />
          Todas as trilhas
        </Link>
        <span className="app-back-row__crumb">{course.level}</span>
      </div>

      <section className={`course-hero course-hero--${course.tone}`} data-reveal>
        <div className="course-hero__copy">
          <span className="app-eyebrow">Trilha · {course.level}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-hero__meta">
            <span>
              <BookOpen size={15} />
              {course.totalLessons} lições
            </span>
            <span>
              <Clock size={15} />
              {course.duration} min
            </span>
            <span>
              <Zap size={15} />
              {course.lessons.reduce((total, lesson) => total + lesson.xp, 0)} XP
            </span>
            <span>{course.focus}</span>
          </div>
          <Link className="btn btn--primary" to={practiceHref}>
            <Play size={16} />
            {ctaLabel}
          </Link>
        </div>

        <div className="course-hero__progress">
          <ProgressRing
            value={course.percent}
            size={154}
            stroke={11}
            tone={course.tone}
            label={`${course.percent}%`}
            sublabel={`${course.completedCount} de ${course.totalLessons}`}
            ariaLabel={`Progresso da trilha: ${course.percent}%`}
          />
          <span>{course.complete ? 'Trilha concluída' : 'Seu avanço nesta trilha'}</span>
        </div>

        <span className="course-hero__key" aria-hidden="true">
          {course.id === 'fundamentos' ? 'F' : course.id === 'dia-a-dia' ? 'J' : '↵'}
        </span>
      </section>

      <div className="course-detail-grid">
        <div className="course-modules">
          {course.modules.map((module, moduleIndex) => (
            <section className="module-block" key={module.id} data-reveal>
              <div className="module-block__head">
                <span className="module-block__index">0{moduleIndex + 1}</span>
                <div>
                  <h2>{module.title}</h2>
                  <span>{module.lessons.length} lições</span>
                </div>
              </div>

              <div className="lesson-list">
                {module.lessons.map((lesson) => {
                  const entry = course.lessons.find((item) => item.id === lesson.id)
                  const completed = entry?.completed ?? false
                  const unlocked = isLessonUnlocked(lesson.id)
                  const recommended = course.nextLesson?.id === lesson.id
                  return (
                    <article
                      className={`lesson-row${completed ? ' is-completed' : ''}${
                        recommended ? ' is-recommended' : ''
                      }${!unlocked && !completed ? ' is-locked' : ''}`}
                      key={lesson.id}
                    >
                      <span className="lesson-row__status">
                        {completed ? (
                          <CheckCircle size={20} />
                        ) : unlocked ? (
                          <Play size={17} />
                        ) : (
                          <Lock size={17} />
                        )}
                      </span>

                      <div className="lesson-row__body">
                        <div className="lesson-row__titleline">
                          <h3>{lesson.title}</h3>
                          {recommended && <span className="lesson-row__tag">Recomendada</span>}
                          {completed && <span className="lesson-row__tag is-done">Concluída</span>}
                          {!unlocked && !completed && (
                            <span className="lesson-row__tag is-locked">Bloqueada</span>
                          )}
                        </div>
                        <p>{lesson.description}</p>
                        <div className="lesson-row__meta">
                          <span>
                            <Clock size={13} />
                            {lesson.duration} min
                          </span>
                          <span>
                            <Zap size={13} />
                            {lesson.xp} XP
                          </span>
                          <span>{lesson.focus}</span>
                        </div>
                      </div>

                      <div className="lesson-row__action">
                        {completed && (
                          <Link
                            className="btn btn--outline btn--sm"
                            to={`/app/praticar/${lesson.id}`}
                          >
                            Revisar
                          </Link>
                        )}
                        {!completed && unlocked && (
                          <Link
                            className={`btn btn--sm ${
                              recommended ? 'btn--primary' : 'btn--outline'
                            }`}
                            to={`/app/praticar/${lesson.id}`}
                          >
                            Praticar
                          </Link>
                        )}
                        {!completed && !unlocked && (
                          <span className="lesson-row__locked-label">Conclua a anterior</span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="course-aside">
          <div className="app-panel course-aside__panel" data-reveal>
            <span className="app-eyebrow">Resumo</span>
            <h2>Seu progresso</h2>
            <div className="course-aside__numbers">
              <div>
                <strong>{course.completedCount}</strong>
                <span>lições concluídas</span>
              </div>
              <div>
                <strong>{course.totalLessons - course.completedCount}</strong>
                <span>lições restantes</span>
              </div>
            </div>
            <div className="app-progress" aria-hidden="true">
              <span style={{ width: `${course.percent}%` }} />
            </div>

            {nextLesson && (
              <div className="course-aside__next">
                <span>Próxima lição</span>
                <strong>{nextLesson.title}</strong>
                <small>
                  {nextLesson.duration} min · {nextLesson.xp} XP
                </small>
                <Link className="btn btn--primary btn--sm" to={`/app/praticar/${nextLesson.id}`}>
                  {course.complete ? 'Praticar novamente' : 'Começar agora'}
                </Link>
              </div>
            )}

            <p className="course-aside__note">
              <Lock size={14} />
              As lições são liberadas em sequência. Você pode revisar qualquer lição já concluída.
            </p>
          </div>

          <div className="app-panel course-aside__panel" data-reveal>
            <span className="app-eyebrow">Nesta trilha</span>
            <ul className="course-aside__facts">
              <li>
                <strong>{course.level}</strong>
                <span>nível sugerido</span>
              </li>
              <li>
                <strong>{formatMinutesFromSeconds(stats.totalSeconds)}</strong>
                <span>prática acumulada</span>
              </li>
              <li>
                <strong>{stats.streak} dias</strong>
                <span>sequência atual</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ArrowBack() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}
