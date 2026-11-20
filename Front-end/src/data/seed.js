import { getLesson } from './courses'

export const DEMO_EMAIL = 'marina@digitacourse.com'

const DEMO_COMPLETED_LESSONS = ['fund-01', 'fund-02', 'fund-03', 'fund-04', 'dia-01', 'dia-02']

const attemptSeeds = [
  { lessonId: 'dia-02', daysAgo: 0, wpm: 68, accuracy: 98.6, duration: 340, hoursAgo: 3 },
  { lessonId: 'fund-04', daysAgo: 0, wpm: 65, accuracy: 97.9, duration: 190, hoursAgo: 2 },
  { lessonId: 'dia-01', daysAgo: 0, wpm: 66, accuracy: 98.1, duration: 260, hoursAgo: 1 },
  { lessonId: 'dia-02', daysAgo: 1, wpm: 66, accuracy: 98.2, duration: 320 },
  { lessonId: 'fund-03', daysAgo: 1, wpm: 61, accuracy: 97.4, duration: 240 },
  { lessonId: 'dia-01', daysAgo: 2, wpm: 63, accuracy: 97.8, duration: 280 },
  { lessonId: 'fund-04', daysAgo: 3, wpm: 62, accuracy: 98.0, duration: 200 },
  { lessonId: 'fund-03', daysAgo: 4, wpm: 60, accuracy: 96.9, duration: 230 },
  { lessonId: 'dia-02', daysAgo: 5, wpm: 59, accuracy: 97.1, duration: 300 },
  { lessonId: 'fund-02', daysAgo: 6, wpm: 57, accuracy: 96.5, duration: 160 },
  { lessonId: 'fund-01', daysAgo: 7, wpm: 54, accuracy: 95.8, duration: 140 },
  { lessonId: 'fund-03', daysAgo: 8, wpm: 56, accuracy: 96.2, duration: 220 },
  { lessonId: 'fund-02', daysAgo: 9, wpm: 53, accuracy: 95.4, duration: 150 },
  { lessonId: 'fund-01', daysAgo: 10, wpm: 51, accuracy: 94.9, duration: 130 },
  { lessonId: 'dia-01', daysAgo: 11, wpm: 58, accuracy: 96.8, duration: 260 },
  { lessonId: 'fund-04', daysAgo: 12, wpm: 55, accuracy: 96.1, duration: 190 },
  { lessonId: 'fund-01', daysAgo: 14, wpm: 48, accuracy: 94.2, duration: 120 },
  { lessonId: 'fund-02', daysAgo: 17, wpm: 50, accuracy: 94.8, duration: 140 },
  { lessonId: 'fund-03', daysAgo: 20, wpm: 52, accuracy: 95.3, duration: 210 },
  { lessonId: 'fund-01', daysAgo: 24, wpm: 47, accuracy: 93.8, duration: 130 },
  { lessonId: 'fund-02', daysAgo: 28, wpm: 49, accuracy: 94.1, duration: 145 },
]

function createSeedAttempt(seed, index) {
  const lesson = getLesson(seed.lessonId)
  const now = new Date()
  const date = new Date(now)

  if (seed.daysAgo === 0) {
    date.setHours(now.getHours() - (seed.hoursAgo ?? 1))
  } else {
    date.setDate(now.getDate() - seed.daysAgo)
    date.setHours(18, 10 + (index % 40), 0, 0)
  }

  const bonus = seed.accuracy >= 98 ? 10 : 0
  const characters = lesson?.text.length ?? 0
  const errors = Math.max(0, Math.round(characters * (1 - seed.accuracy / 100)))

  return {
    id: `demo-attempt-${index + 1}`,
    lessonId: seed.lessonId,
    lessonTitle: lesson?.title ?? 'Lição',
    courseId: lesson?.courseId ?? 'fundamentos',
    courseTitle: lesson?.courseTitle ?? 'Fundamentos do teclado',
    wpm: seed.wpm,
    accuracy: seed.accuracy,
    durationSeconds: seed.duration,
    characters,
    errors,
    xp: (lesson?.xp ?? 40) + bonus,
    createdAt: date.toISOString(),
  }
}

export function createDemoAccount() {
  const now = new Date()
  const joined = new Date(now)
  joined.setDate(joined.getDate() - 64)

  return {
    user: {
      id: 'demo',
      name: 'Marina Costa',
      email: DEMO_EMAIL,
      role: 'Aluno',
      joinedAt: joined.toISOString(),
    },
    progress: {
      completedLessons: [...DEMO_COMPLETED_LESSONS],
      attempts: attemptSeeds
        .map(createSeedAttempt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    },
    prefs: {
      dailyGoalMinutes: 10,
      publicProfile: true,
      emailReminders: true,
      weeklySummary: true,
    },
    notifications: [
      {
        id: 'notice-daily-goal',
        title: 'Meta diária concluída',
        message: 'Você já praticou 13 minutos hoje. Continue assim!',
        kind: 'goal',
        href: '/app/progresso',
        read: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notice-achievement',
        title: 'Nova conquista: Precisão de ouro',
        message: 'Você alcançou 98,6% de precisão em um exercício.',
        kind: 'achievement',
        href: '/app/conquistas',
        read: false,
        createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notice-streak',
        title: 'Sua sequência chegou a 13 dias',
        message: 'A constância está virando hábito. Que tal praticar mais um pouco?',
        kind: 'streak',
        href: '/app/progresso',
        read: true,
        createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notice-course',
        title: 'Trilha liberada: Textos com fluência',
        message: 'Você já tem acesso à primeira lição da trilha avançada.',
        kind: 'course',
        href: '/app/trilhas/fluencia',
        read: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }
}

export function createEmptyAccount({ id, name, email }) {
  return {
    user: {
      id,
      name,
      email,
      role: 'Aluno',
      joinedAt: new Date().toISOString(),
    },
    progress: {
      completedLessons: [],
      attempts: [],
    },
    prefs: {
      dailyGoalMinutes: 10,
      publicProfile: true,
      emailReminders: true,
      weeklySummary: true,
    },
    notifications: [
      {
        id: `welcome-${id}`,
        title: 'Bem-vindo ao DigitaCourse',
        message: 'Sua conta está pronta. Comece pela primeira lição da trilha Fundamentos.',
        kind: 'course',
        href: '/app/trilhas/fundamentos',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
  }
}
