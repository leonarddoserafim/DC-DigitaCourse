import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/app/EmptyState'
import ProgressRing from '../components/app/ProgressRing'
import AppIcon from '../components/AppIcon'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Flame,
  Keyboard,
  Play,
  RotateCcw,
  Spark,
  Target,
  Trophy,
  Zap,
} from '../components/Icons'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import usePageMeta from '../hooks/usePageMeta'
import { formatClock, formatNumber } from '../lib/format'

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

function getNextLesson(courses, lesson) {
  const course = courses.find((item) => item.id === lesson.courseId)
  if (!course) return null
  const index = course.lessons.findIndex((item) => item.id === lesson.id)
  return course.lessons[index + 1] ?? null
}

export default function PracticePage() {
  const { lessonId } = useParams()
  const { getLessonById, courses, isLessonUnlocked, recordAttempt, stats, user } = useApp()
  const { showToast } = useToast()
  const lesson = getLessonById(lessonId)
  const course = lesson ? courses.find((item) => item.id === lesson.courseId) : null

  const surfaceRef = useRef(null)
  const startRef = useRef(null)
  const indexRef = useRef(0)
  const errorsRef = useRef(0)
  const finishingRef = useRef(false)
  const wrongTimerRef = useRef(null)
  const previousBestRef = useRef(stats.bestWpm)

  const [index, setIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  usePageMeta(
    lesson ? `${lesson.title} — DigitaCourse` : 'Lição não encontrada — DigitaCourse',
    lesson?.description,
  )

  useEffect(() => {
    if (!lesson) return
    setIndex(0)
    setErrors(0)
    setElapsedMs(0)
    setStatus('idle')
    setResult(null)
    setWrongFlash(false)
    finishingRef.current = false
    startRef.current = null
    indexRef.current = 0
    errorsRef.current = 0
    previousBestRef.current = stats.bestWpm
    const focusTimer = window.setTimeout(() => surfaceRef.current?.focus(), 120)
    return () => window.clearTimeout(focusTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  useEffect(() => {
    if (status !== 'running') return undefined
    const timer = window.setInterval(() => {
      if (startRef.current) setElapsedMs(performance.now() - startRef.current)
    }, 200)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(
    () => () => {
      if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    },
    [],
  )

  if (!lesson) {
    return (
      <div className="typing-page">
        <div className="typing-simple-state">
          <EmptyState
            icon="keyboard"
            title="Lição não encontrada"
            description="Volte para as trilhas e escolha uma lição disponível."
            action={
              <Link className="btn btn--primary" to="/app/trilhas">
                Ver trilhas
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  if (!isLessonUnlocked(lesson.id)) {
    return (
      <div className="typing-page">
        <div className="typing-simple-state">
          <EmptyState
            icon="lock"
            title="Esta lição ainda está bloqueada"
            description="Conclua a lição anterior da trilha para liberar este exercício."
            action={
              <Link className="btn btn--primary" to={`/app/trilhas/${lesson.courseId}`}>
                Voltar para a trilha
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const text = lesson.text
  const expected = text[index] ?? ''
  const totalHits = index + errors
  const liveAccuracy = totalHits ? (index / totalHits) * 100 : 100
  const liveWpm =
    status === 'running' && elapsedMs > 250
      ? Math.round((index / 5) / (elapsedMs / 60000))
      : 0
  const progress = Math.round((index / text.length) * 100)
  const normalizedExpected =
    expected === ' '
      ? 'space'
      : expected
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
  const nextLesson = getNextLesson(courses, lesson)
  const firstName = user?.name?.split(' ')[0] ?? 'aluno'
  const isNewRecord = result ? result.wpm > previousBestRef.current : false

  const finishExercise = (correctChars, errorCount) => {
    if (finishingRef.current) return
    finishingRef.current = true

    const end = performance.now()
    const startedAt = startRef.current ?? end
    const elapsed = Math.max(800, end - startedAt)
    const minutes = elapsed / 60000
    const wpm = Math.round((correctChars / 5) / minutes)
    const total = correctChars + errorCount
    const accuracy = total ? (correctChars / total) * 100 : 100
    const durationSeconds = Math.max(1, Math.round(elapsed / 1000))
    const bonus = accuracy >= 98 ? 10 : 0
    const xp = lesson.xp + bonus

    const finalResult = {
      wpm,
      accuracy,
      durationSeconds,
      errors: errorCount,
      xp,
      bonus,
    }

    setElapsedMs(elapsed)
    setStatus('finished')
    setResult(finalResult)
    recordAttempt(lesson, finalResult)
    showToast(
      'Lição concluída',
      `${wpm} WPM, ${formatNumber(accuracy, 1)}% de precisão e +${xp} XP.`,
    )
  }

  const handleKeyDown = (event) => {
    if (status === 'finished') return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === 'Backspace') {
      event.preventDefault()
      return
    }
    if (event.key === 'Dead' || event.repeat || event.key.length !== 1) return
    if (event.key === ' ') event.preventDefault()

    if (!startRef.current) {
      startRef.current = performance.now()
      setStatus('running')
    }

    const currentExpected = text[indexRef.current] ?? ''
    if (event.key === currentExpected) {
      const nextIndex = indexRef.current + 1
      indexRef.current = nextIndex
      setIndex(nextIndex)
      if (nextIndex === text.length) {
        finishExercise(nextIndex, errorsRef.current)
      }
      return
    }

    const nextErrors = errorsRef.current + 1
    errorsRef.current = nextErrors
    setErrors(nextErrors)
    setWrongFlash(true)
    if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    wrongTimerRef.current = window.setTimeout(() => setWrongFlash(false), 220)
  }

  const handleRetry = () => {
    previousBestRef.current = Math.max(previousBestRef.current, stats.bestWpm)
    setIndex(0)
    setErrors(0)
    setElapsedMs(0)
    setStatus('idle')
    setResult(null)
    setWrongFlash(false)
    finishingRef.current = false
    startRef.current = null
    indexRef.current = 0
    errorsRef.current = 0
    surfaceRef.current?.focus()
  }

  const topbar = (
    <header className="typing-topbar">
      <Link className="typing-topbar__back" to={`/app/trilhas/${lesson.courseId}`}>
        <ArrowLeft size={17} />
        Sair da lição
      </Link>
      <div className="typing-topbar__center">
        <span>{course?.title}</span>
        <strong>{lesson.moduleTitle}</strong>
      </div>
      <span className="typing-topbar__xp">
        <Zap size={15} />
        {lesson.xp} XP
      </span>
    </header>
  )

  if (result) {
    return (
      <div className="typing-page">
        {topbar}
        <main className="typing-result-wrap">
          <section className="typing-result" data-reveal>
            <div className="typing-result__burst" aria-hidden="true">
              <span>F</span>
              <span>J</span>
              <span>✓</span>
            </div>
            <span className="typing-result__badge">
              <Trophy size={16} />
              Lição concluída
            </span>
            <h1>Boa, {firstName}.</h1>
            <p>
              Você concluiu <strong>{lesson.title}</strong> em {course?.title}.
              {isNewRecord ? ' E esse é o seu novo recorde de velocidade!' : ' Mais um passo na sua fluência.'}
            </p>

            <div className="typing-result__stats">
              <div>
                <span>Velocidade</span>
                <strong>
                  {result.wpm}
                  <small>WPM</small>
                </strong>
              </div>
              <div>
                <span>Precisão</span>
                <strong>
                  {formatNumber(result.accuracy, 1)}
                  <small>%</small>
                </strong>
              </div>
              <div>
                <span>Tempo</span>
                <strong>{formatClock(result.durationSeconds)}</strong>
              </div>
              <div>
                <span>Experiência</span>
                <strong>
                  +{result.xp}
                  <small>XP</small>
                </strong>
              </div>
            </div>

            <div className="typing-result__progress">
              <ProgressRing
                value={course?.percent ?? 0}
                size={100}
                stroke={8}
                tone="teal"
                label={`${course?.percent ?? 0}%`}
                sublabel="da trilha"
              />
              <div>
                <strong>{isNewRecord ? 'Novo recorde pessoal' : 'Progresso registrado'}</strong>
                <p>
                  {result.bonus > 0
                    ? `Inclui +${result.bonus} XP de bônus por precisão acima de 98%.`
                    : 'Sua tentativa foi salva no histórico desta conta local.'}
                </p>
                <span>
                  <Flame size={14} />
                  Sequência de {stats.streak} dias
                </span>
              </div>
            </div>

            <div className="typing-result__actions">
              {nextLesson ? (
                <Link className="btn btn--primary btn--lg" to={`/app/praticar/${nextLesson.id}`}>
                  Próxima lição
                  <span className="btn__icon">
                    <Play size={16} />
                  </span>
                </Link>
              ) : (
                <Link className="btn btn--primary btn--lg" to={`/app/trilhas/${lesson.courseId}`}>
                  Voltar para a trilha
                  <span className="btn__icon">
                    <CheckCircle size={16} />
                  </span>
                </Link>
              )}
              <Link className="btn btn--outline btn--lg" to={`/app/trilhas/${lesson.courseId}`}>
                Ver trilha
              </Link>
              <button className="typing-result__retry" type="button" onClick={handleRetry}>
                <RotateCcw size={15} />
                Repetir lição
              </button>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="typing-page">
      {topbar}

      <main className="typing-main">
        <div className="typing-head" data-reveal>
          <div>
            <span className="app-eyebrow">
              {lesson.moduleTitle} · {lesson.focus}
            </span>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
          </div>
          <div className="typing-head__meta">
            <span>
              <Clock size={15} />
              {lesson.duration} min
            </span>
            <span>
              <Zap size={15} />
              {lesson.xp} XP
            </span>
            <span>
              <Keyboard size={15} />
              {text.length} caracteres
            </span>
          </div>
        </div>

        <div className="typing-layout">
          <section
            className={`typing-card${isFocused ? ' is-focused' : ''}${
              wrongFlash ? ' is-wrong' : ''
            }`}
            ref={surfaceRef}
            tabIndex={0}
            role="application"
            aria-label={`Exercício de digitação: ${text}. Digite o texto exibido.`}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => surfaceRef.current?.focus()}
          >
            <div className="typing-card__head">
              <span>Digite o trecho abaixo</span>
              <span className={`typing-live typing-live--${status}`}>
                <i />
                {status === 'idle' ? 'pronto para começar' : status === 'running' ? 'ao vivo' : 'finalizado'}
              </span>
            </div>

            <div className="typing-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>

            <p className="typing-text">
              <span className="typing-text__done">{text.slice(0, index)}</span>
              <span className="typing-text__current">
                {expected === ' ' ? '\u00a0' : expected}
                <i aria-hidden="true" />
              </span>
              <span className="typing-text__rest">{text.slice(index + 1)}</span>
            </p>

            {!isFocused && (
              <button
                className="typing-focus-hint"
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  surfaceRef.current?.focus()
                }}
              >
                <Keyboard size={16} />
                Clique aqui para ativar o teclado
              </button>
            )}

            <div className="typing-progress-label">
              <span>
                {index} de {text.length} caracteres
              </span>
              <span>{progress}%</span>
            </div>

            <div className="typing-live-stats">
              <div>
                <span>Tempo</span>
                <strong>{formatClock(elapsedMs / 1000)}</strong>
              </div>
              <div>
                <span>Velocidade</span>
                <strong>
                  {liveWpm}
                  <small>WPM</small>
                </strong>
              </div>
              <div>
                <span>Precisão</span>
                <strong>
                  {formatNumber(liveAccuracy, 1)}
                  <small>%</small>
                </strong>
              </div>
              <div>
                <span>Erros</span>
                <strong>{errors}</strong>
              </div>
            </div>

            <div className="typing-card__note">
              <Target size={15} />
              O texto só avança quando você acerta. Não é preciso usar Backspace.
            </div>
          </section>

          <aside className="typing-aside">
            <div className="typing-side-card" data-reveal>
              <div className="typing-side-card__head">
                <span>Teclado</span>
                <small>próxima tecla em destaque</small>
              </div>
              <div className="typing-keyboard" aria-hidden="true">
                {keyboardRows.map((row, rowIndex) => (
                  <div className={`typing-keyboard__row typing-keyboard__row--${rowIndex + 1}`} key={rowIndex}>
                    {row.map((key) => (
                      <span
                        className={`typing-key${normalizedExpected === key ? ' is-next' : ''}${
                          key === 'f' || key === 'j' ? ' is-home' : ''
                        }`}
                        key={key}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                ))}
                <div className="typing-keyboard__row typing-keyboard__row--space">
                  <span className={`typing-key typing-key--space${normalizedExpected === 'space' ? ' is-next' : ''}`}>
                    espaço
                  </span>
                </div>
              </div>
              <p className="typing-side-card__hint">
                As teclas <strong>F</strong> e <strong>J</strong> ajudam você a encontrar a home row
                sem olhar.
              </p>
            </div>

            <div className="typing-side-card typing-side-card--facts" data-reveal>
              <span className="app-eyebrow">Nesta lição</span>
              <ul>
                <li>
                  <Spark size={16} />
                  <span>
                    <strong>{lesson.focus}</strong>
                    foco principal
                  </span>
                </li>
                <li>
                  <Zap size={16} />
                  <span>
                    <strong>{lesson.xp} XP + bônus</strong>
                    até +10 por precisão
                  </span>
                </li>
                <li>
                  <Trophy size={16} />
                  <span>
                    <strong>Recorde atual: {stats.bestWpm} WPM</strong>
                    seu melhor resultado
                  </span>
                </li>
              </ul>
            </div>

            <div className="typing-tip" data-reveal>
              <Keyboard size={19} />
              <p>
                <strong>Postura antes de pressa.</strong> Mantenha os pulsos leves, os dedos na home
                row e os olhos no texto.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
