import { allLessons } from '../data/courses'

const DAY_MS = 24 * 60 * 60 * 1000
export const XP_PER_LEVEL = 500

export function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

export function dayKey(value) {
  const date = toDate(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function startOfDay(value = new Date()) {
  const date = toDate(value)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isToday(value) {
  return dayKey(value) === dayKey(new Date())
}

export function sortAttempts(attempts = []) {
  return [...attempts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getAttemptsInLastDays(attempts = [], days = 7) {
  const start = startOfDay(new Date())
  start.setDate(start.getDate() - (days - 1))
  return attempts.filter((attempt) => {
    const date = toDate(attempt.createdAt)
    return date >= start
  })
}

export function computeStreak(attempts = []) {
  const activeDays = new Set(attempts.map((attempt) => dayKey(attempt.createdAt)))
  if (!activeDays.size) return 0

  let cursor = startOfDay(new Date())
  if (!activeDays.has(dayKey(cursor))) {
    cursor = new Date(cursor.getTime() - DAY_MS)
  }

  let streak = 0
  while (activeDays.has(dayKey(cursor))) {
    streak += 1
    cursor = new Date(cursor.getTime() - DAY_MS)
  }
  return streak
}

function average(values) {
  if (!values.length) return 0
  return values.reduce((total, value) => total + value, 0) / values.length
}

function round(value, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function computeStats(attempts = [], completedLessons = []) {
  const ordered = [...attempts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const lastTen = ordered.slice(-10)
  const previousTen = ordered.slice(-20, -10)
  const today = ordered.filter((attempt) => isToday(attempt.createdAt))
  const lastSeven = getAttemptsInLastDays(ordered, 7)
  const lastThirty = getAttemptsInLastDays(ordered, 30)

  const totalSeconds = ordered.reduce((total, attempt) => total + (attempt.durationSeconds || 0), 0)
  const xp = ordered.reduce((total, attempt) => total + (attempt.xp || 0), 0)
  const avgWpm = round(average(lastTen.map((attempt) => attempt.wpm)))
  const avgAccuracy = round(average(lastTen.map((attempt) => attempt.accuracy)), 1)
  const previousWpm = average(previousTen.map((attempt) => attempt.wpm))
  const previousAccuracy = average(previousTen.map((attempt) => attempt.accuracy))
  const todaySeconds = today.reduce((total, attempt) => total + (attempt.durationSeconds || 0), 0)
  const weeklySeconds = lastSeven.reduce(
    (total, attempt) => total + (attempt.durationSeconds || 0),
    0,
  )
  const monthlyXp = lastThirty.reduce((total, attempt) => total + (attempt.xp || 0), 0)
  const weeklyXp = lastSeven.reduce((total, attempt) => total + (attempt.xp || 0), 0)
  const bestWpm = ordered.length ? Math.max(...ordered.map((attempt) => attempt.wpm)) : 0
  const bestAccuracy = ordered.length ? Math.max(...ordered.map((attempt) => attempt.accuracy)) : 0

  return {
    attempts: ordered.length,
    avgWpm,
    avgAccuracy,
    previousWpm: round(previousWpm),
    previousAccuracy: round(previousAccuracy, 1),
    wpmDelta: previousTen.length ? round(avgWpm - previousWpm, 1) : null,
    accuracyDelta: previousTen.length ? round(avgAccuracy - previousAccuracy, 1) : null,
    totalSeconds,
    todaySeconds,
    weeklySeconds,
    xp,
    weeklyXp,
    monthlyXp,
    bestWpm,
    bestAccuracy,
    streak: computeStreak(ordered),
    lessonsCompleted: completedLessons.length,
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    levelXp: xp % XP_PER_LEVEL,
    levelXpTarget: XP_PER_LEVEL,
    lastAttemptAt: ordered.length ? ordered[ordered.length - 1].createdAt : null,
  }
}

export function getCourseLessons(course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      courseId: course.id,
      courseTitle: course.title,
      moduleId: module.id,
      moduleTitle: module.title,
    })),
  )
}

export function computeCourseProgress(course, completedLessons = [], attempts = []) {
  const completedSet = new Set(completedLessons)
  const lessons = getCourseLessons(course).map((lesson) => ({
    ...lesson,
    completed: completedSet.has(lesson.id),
  }))
  const completedCount = lessons.filter((lesson) => lesson.completed).length
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
  const started =
    completedCount > 0 ||
    attempts.some((attempt) => lessons.some((lesson) => lesson.id === attempt.lessonId))

  return {
    ...course,
    lessons,
    totalLessons: lessons.length,
    completedCount,
    percent,
    started,
    complete: completedCount === lessons.length && lessons.length > 0,
    nextLesson: lessons.find((lesson) => !lesson.completed) ?? lessons[lessons.length - 1] ?? null,
  }
}

export function getNextLesson(coursesWithProgress = []) {
  if (!coursesWithProgress.length) return null

  const inProgress = coursesWithProgress.find((course) => course.started && !course.complete)
  const notStarted = coursesWithProgress.find((course) => !course.started)
  const remaining = coursesWithProgress.find((course) => !course.complete)
  const selected =
    inProgress ?? notStarted ?? remaining ?? coursesWithProgress[coursesWithProgress.length - 1]

  return {
    course: selected,
    lesson: selected.nextLesson,
  }
}

export function isLessonUnlocked(lessonId, completedLessons = []) {
  const lesson = allLessons.find((item) => item.id === lessonId)
  if (!lesson) return false
  if (completedLessons.includes(lessonId)) return true

  const entries = allLessons.filter((item) => item.courseId === lesson.courseId)
  const index = entries.findIndex((item) => item.id === lessonId)
  if (index <= 0) return true
  return completedLessons.includes(entries[index - 1].id)
}

export function buildAchievements({ attempts, coursesWithProgress, stats }) {
  const maxCoursePercent = Math.max(0, ...coursesWithProgress.map((course) => course.percent))
  const startedCourses = coursesWithProgress.filter((course) => course.started).length

  const definitions = [
    {
      id: 'first-step',
      title: 'Primeira tecla',
      description: 'Conclua seu primeiro exercício de digitação.',
      icon: 'keyboard',
      tone: 'mint',
      current: attempts.length,
      target: 1,
      unit: 'exercício',
    },
    {
      id: 'streak-seven',
      title: 'Ritmo constante',
      description: 'Pratique por sete dias consecutivos.',
      icon: 'flame',
      tone: 'amber',
      current: stats.streak,
      target: 7,
      unit: 'dias',
    },
    {
      id: 'accuracy-gold',
      title: 'Precisão de ouro',
      description: 'Alcance 98% de precisão em um exercício.',
      icon: 'target',
      tone: 'teal',
      current: stats.bestAccuracy,
      target: 98,
      unit: '%',
      decimals: 1,
    },
    {
      id: 'speed-sixty',
      title: 'Velocidade 60+',
      description: 'Ultrapasse 60 palavras por minuto em um exercício.',
      icon: 'gauge',
      tone: 'coral',
      current: stats.bestWpm,
      target: 60,
      unit: 'WPM',
    },
    {
      id: 'course-complete',
      title: 'Trilha completa',
      description: 'Conclua todas as lições de uma trilha.',
      icon: 'route',
      tone: 'mint',
      current: maxCoursePercent,
      target: 100,
      unit: '%',
    },
    {
      id: 'explorer',
      title: 'Explorador',
      description: 'Comece a praticar em duas trilhas diferentes.',
      icon: 'compass',
      tone: 'amber',
      current: startedCourses,
      target: 2,
      unit: 'trilhas',
    },
    {
      id: 'focus-two-hours',
      title: 'Duas horas de foco',
      description: 'Acumule 120 minutos de prática.',
      icon: 'clock',
      tone: 'teal',
      current: Math.round(stats.totalSeconds / 60),
      target: 120,
      unit: 'min',
    },
    {
      id: 'xp-thousand',
      title: 'Mil de XP',
      description: 'Acumule 1.000 pontos de experiência.',
      icon: 'spark',
      tone: 'coral',
      current: stats.xp,
      target: 1000,
      unit: 'XP',
    },
  ]

  return definitions.map((achievement) => ({
    ...achievement,
    progress: Math.min(1, achievement.current / achievement.target),
    unlocked: achievement.current >= achievement.target,
    remaining: Math.max(0, achievement.target - achievement.current),
  }))
}

export function getLast7Days(attempts = []) {
  const today = startOfDay(new Date())
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const key = dayKey(date)
    const minutes =
      attempts
        .filter((attempt) => dayKey(attempt.createdAt) === key)
        .reduce((total, attempt) => total + (attempt.durationSeconds || 0), 0) / 60

    return {
      key,
      date,
      label: weekday.format(date).replace('.', '').slice(0, 3),
      minutes: round(minutes),
      today: index === 6,
    }
  })
}

export function getHeatmap(attempts = [], weeks = 8) {
  const end = startOfDay(new Date())
  const start = new Date(end)
  start.setDate(start.getDate() - (weeks * 7 - 1))

  return Array.from({ length: weeks * 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = dayKey(date)
    const minutes =
      attempts
        .filter((attempt) => dayKey(attempt.createdAt) === key)
        .reduce((total, attempt) => total + (attempt.durationSeconds || 0), 0) / 60

    let level = 0
    if (minutes > 0) level = 1
    if (minutes >= 10) level = 2
    if (minutes >= 20) level = 3
    if (minutes >= 30) level = 4

    return {
      key,
      date,
      minutes: round(minutes),
      level,
      label: `${date.toLocaleDateString('pt-BR')}: ${Math.round(minutes)} min`,
    }
  })
}

export function buildChallenges({ attempts, stats, dailyGoalMinutes = 10, nextLesson = null }) {
  const today = attempts.filter((attempt) => isToday(attempt.createdAt))
  const todayMinutes =
    today.reduce((total, attempt) => total + (attempt.durationSeconds || 0), 0) / 60
  const todayBestAccuracy = today.length ? Math.max(...today.map((attempt) => attempt.accuracy)) : 0
  const weekAttempts = getAttemptsInLastDays(attempts, 7)
  const weekActiveDays = new Set(weekAttempts.map((attempt) => dayKey(attempt.createdAt))).size
  const weekLessons = new Set(weekAttempts.map((attempt) => attempt.lessonId)).size
  const monthAttempts = getAttemptsInLastDays(attempts, 30)
  const monthBestWpm = monthAttempts.length
    ? Math.max(...monthAttempts.map((attempt) => attempt.wpm))
    : 0

  const lessonId = nextLesson?.lesson?.id ?? null

  return [
    {
      id: 'daily-goal',
      period: 'Diário',
      title: 'Meta diária',
      description: `Pratique ${dailyGoalMinutes} minutos hoje, no seu ritmo.`,
      icon: 'clock',
      tone: 'mint',
      value: round(todayMinutes, 1),
      target: dailyGoalMinutes,
      unit: 'min',
      xp: 40,
      lessonId,
    },
    {
      id: 'daily-accuracy',
      period: 'Diário',
      title: 'Precisão cirúrgica',
      description: 'Alcance 97% de precisão em um exercício hoje.',
      icon: 'target',
      tone: 'teal',
      value: round(todayBestAccuracy, 1),
      target: 97,
      unit: '%',
      xp: 50,
      lessonId,
    },
    {
      id: 'weekly-days',
      period: 'Semanal',
      title: 'Cinco dias de ritmo',
      description: 'Pratique em cinco dias diferentes nesta semana.',
      icon: 'flame',
      tone: 'amber',
      value: weekActiveDays,
      target: 5,
      unit: 'dias',
      xp: 120,
      lessonId,
    },
    {
      id: 'weekly-lessons',
      period: 'Semanal',
      title: 'Três lições na semana',
      description: 'Pratique pelo menos três lições diferentes.',
      icon: 'route',
      tone: 'coral',
      value: weekLessons,
      target: 3,
      unit: 'lições',
      xp: 100,
      lessonId,
    },
    {
      id: 'monthly-speed',
      period: 'Mensal',
      title: 'Rumo aos 70 WPM',
      description: 'Alcance 70 palavras por minuto em qualquer lição.',
      icon: 'gauge',
      tone: 'teal',
      value: monthBestWpm,
      target: 70,
      unit: 'WPM',
      xp: 180,
      lessonId,
    },
    {
      id: 'monthly-xp',
      period: 'Mensal',
      title: 'Colecionador de XP',
      description: 'Acumule 1.000 XP em 30 dias.',
      icon: 'spark',
      tone: 'mint',
      value: stats.monthlyXp,
      target: 1000,
      unit: 'XP',
      xp: 200,
      lessonId,
    },
  ].map((challenge) => ({
    ...challenge,
    progress: Math.min(1, challenge.value / challenge.target),
    complete: challenge.value >= challenge.target,
  }))
}

export function buildRanking(users, { user, stats, period = 'semanal', publicProfile = true }) {
  const field = { semanal: 'weeklyXp', mensal: 'monthlyXp', geral: 'totalXp' }[period] ?? 'weeklyXp'
  const currentUser = {
    id: 'me',
    name: user.name,
    initials: user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
    course: 'Sua jornada',
    tone: 'coral',
    weeklyXp: stats.weeklyXp,
    monthlyXp: stats.monthlyXp,
    totalXp: stats.xp,
    wpm: stats.avgWpm,
    accuracy: stats.avgAccuracy,
    isCurrent: true,
  }

  const pool = publicProfile ? [...users, currentUser] : [...users]
  return pool
    .sort((a, b) => b[field] - a[field] || b.wpm - a.wpm)
    .map((entry, index) => ({
      ...entry,
      position: index + 1,
      score: entry[field],
    }))
}
