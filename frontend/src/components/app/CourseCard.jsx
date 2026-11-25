import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Compass, Keyboard, Play } from '../Icons'

const courseIcons = {
  fundamentos: Keyboard,
  'dia-a-dia': BookOpen,
  fluencia: Compass,
}

export default function CourseCard({ course, featured = false }) {
  const Icon = courseIcons[course.id] ?? BookOpen
  const status = course.complete ? 'Concluída' : course.started ? 'Em andamento' : 'Não iniciada'
  const cta = course.complete
    ? 'Revisar trilha'
    : course.started
      ? 'Continuar trilha'
      : 'Começar trilha'

  return (
    <article
      className={`course-card course-card--${course.tone}${
        featured ? ' course-card--featured' : ''
      }`}
      data-reveal
    >
      <div className="course-card__top">
        <span className="course-card__icon">
          <Icon size={22} />
        </span>
        <span className="course-card__status">{status}</span>
        <span className="course-card__level">{course.level}</span>
      </div>

      <div className="course-card__body">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </div>

      <div className="course-card__meta">
        <span>{course.totalLessons} lições</span>
        <i aria-hidden="true" />
        <span>{course.duration} min</span>
        <i aria-hidden="true" />
        <span>{course.focus}</span>
      </div>

      <div className="course-card__progress">
        <div className="course-card__progress-head">
          <span>
            {course.completedCount} de {course.totalLessons} lições
          </span>
          <strong>{course.percent}%</strong>
        </div>
        <div className="app-progress" aria-hidden="true">
          <span style={{ width: `${course.percent}%` }} />
        </div>
      </div>

      <Link className="course-card__cta" to={`/app/trilhas/${course.id}`}>
        {course.complete ? <BookOpen size={16} /> : <Play size={16} />}
        {cta}
        <ChevronRight size={16} className="course-card__arrow" />
      </Link>
    </article>
  )
}
