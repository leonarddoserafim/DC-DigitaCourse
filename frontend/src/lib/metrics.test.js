import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { courses } from '../data/courses'
import {
  XP_PER_LEVEL,
  buildAchievements,
  buildChallenges,
  buildRanking,
  computeCourseProgress,
  computeStats,
  computeStreak,
  dayKey,
  getAttemptsInLastDays,
  getHeatmap,
  getLast7Days,
  getNextLesson,
  isLessonUnlocked,
  isToday,
  sortAttempts,
  startOfDay,
} from './metrics'

const NOW = new Date(2026, 10, 26, 12, 0, 0)

function daysAgo(days, hour = 9) {
  return new Date(2026, 10, 26 - days, hour, 0, 0)
}

function attempt(overrides = {}) {
  return {
    id: 'attempt-1',
    lessonId: 'fund-01',
    wpm: 60,
    accuracy: 98,
    durationSeconds: 120,
    xp: 50,
    createdAt: daysAgo(0),
    ...overrides,
  }
}

describe('métricas do aluno', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('normaliza datas e chaves de dia', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(startOfDay(new Date(2026, 10, 26, 18, 30))).toEqual(new Date(2026, 10, 26))
    expect(isToday(daysAgo(0))).toBe(true)
    expect(isToday(daysAgo(1))).toBe(false)
  })

  it('ordena tentativas sem alterar o array original', () => {
    const input = [
      attempt({ id: 'antiga', createdAt: daysAgo(2) }),
      attempt({ id: 'nova', createdAt: daysAgo(0) }),
    ]

    const sorted = sortAttempts(input)

    expect(sorted.map((item) => item.id)).toEqual(['nova', 'antiga'])
    expect(input.map((item) => item.id)).toEqual(['antiga', 'nova'])
  })

  it('filtra tentativas pela janela de dias', () => {
    const attempts = [
      attempt({ createdAt: daysAgo(0) }),
      attempt({ createdAt: daysAgo(6) }),
      attempt({ createdAt: daysAgo(7) }),
    ]

    expect(getAttemptsInLastDays(attempts, 7)).toHaveLength(2)
  })

  it('calcula sequência de dias consecutivos', () => {
    expect(computeStreak([])).toBe(0)
    expect(
      computeStreak([
        attempt({ createdAt: daysAgo(0) }),
        attempt({ createdAt: daysAgo(1) }),
        attempt({ createdAt: daysAgo(2) }),
      ]),
    ).toBe(3)
    expect(computeStreak([attempt({ createdAt: daysAgo(1) })])).toBe(1)
    expect(
      computeStreak([attempt({ createdAt: daysAgo(0) }), attempt({ createdAt: daysAgo(2) })]),
    ).toBe(1)
  })

  it('consolida estatísticas, XP e nível', () => {
    const attempts = [
      attempt({ wpm: 50, accuracy: 95, durationSeconds: 60, xp: 40, createdAt: daysAgo(0, 9) }),
      attempt({ wpm: 60, accuracy: 97, durationSeconds: 120, xp: 50, createdAt: daysAgo(0, 10) }),
      attempt({ wpm: 70, accuracy: 99, durationSeconds: 180, xp: 60, createdAt: daysAgo(0, 11) }),
    ]

    const stats = computeStats(attempts, ['fund-01', 'fund-02'])

    expect(stats.attempts).toBe(3)
    expect(stats.avgWpm).toBe(60)
    expect(stats.avgAccuracy).toBe(97)
    expect(stats.bestWpm).toBe(70)
    expect(stats.bestAccuracy).toBe(99)
    expect(stats.totalSeconds).toBe(360)
    expect(stats.todaySeconds).toBe(360)
    expect(stats.weeklySeconds).toBe(360)
    expect(stats.xp).toBe(150)
    expect(stats.weeklyXp).toBe(150)
    expect(stats.monthlyXp).toBe(150)
    expect(stats.streak).toBe(1)
    expect(stats.lessonsCompleted).toBe(2)
    expect(stats.level).toBe(1)
    expect(stats.levelXp).toBe(150)
    expect(stats.levelXpTarget).toBe(XP_PER_LEVEL)
    expect(stats.wpmDelta).toBeNull()
    expect(stats.accuracyDelta).toBeNull()
    expect(stats.lastAttemptAt).toEqual(daysAgo(0, 11))
  })

  it('calcula progresso, lição seguinte e conclusão da trilha', () => {
    const fundamentos = courses.find((course) => course.id === 'fundamentos')
    const partial = computeCourseProgress(fundamentos, ['fund-01', 'fund-02'], [])

    expect(partial.totalLessons).toBe(4)
    expect(partial.completedCount).toBe(2)
    expect(partial.percent).toBe(50)
    expect(partial.started).toBe(true)
    expect(partial.complete).toBe(false)
    expect(partial.nextLesson.id).toBe('fund-03')

    const complete = computeCourseProgress(
      fundamentos,
      ['fund-01', 'fund-02', 'fund-03', 'fund-04'],
      [],
    )
    expect(complete.percent).toBe(100)
    expect(complete.complete).toBe(true)

    const startedByAttempt = computeCourseProgress(fundamentos, [], [attempt()])
    expect(startedByAttempt.started).toBe(true)
    expect(startedByAttempt.completedCount).toBe(0)
  })

  it('escolhe a próxima trilha priorizando a que está em andamento', () => {
    const inProgress = {
      id: 'dia-a-dia',
      started: true,
      complete: false,
      nextLesson: { id: 'dia-03' },
    }
    const notStarted = {
      id: 'fluencia',
      started: false,
      complete: false,
      nextLesson: { id: 'flu-01' },
    }

    expect(getNextLesson([notStarted, inProgress])).toEqual({
      course: inProgress,
      lesson: inProgress.nextLesson,
    })
    expect(getNextLesson([])).toBeNull()
  })

  it('libera lições em sequência e sempre permite revisar concluídas', () => {
    expect(isLessonUnlocked('fund-01', [])).toBe(true)
    expect(isLessonUnlocked('fund-02', [])).toBe(false)
    expect(isLessonUnlocked('fund-02', ['fund-01'])).toBe(true)
    expect(isLessonUnlocked('fund-03', ['fund-01', 'fund-02'])).toBe(true)
    expect(isLessonUnlocked('fund-03', ['fund-03'])).toBe(true)
    expect(isLessonUnlocked('nao-existe', [])).toBe(false)
  })

  it('monta conquistas com progresso limitado a 100%', () => {
    const achievements = buildAchievements({
      attempts: [attempt(), attempt({ id: 'attempt-2' })],
      coursesWithProgress: [
        { percent: 100, started: true },
        { percent: 50, started: true },
      ],
      stats: {
        streak: 7,
        bestAccuracy: 98.6,
        bestWpm: 65,
        totalSeconds: 7200,
        xp: 1000,
      },
    })

    expect(achievements).toHaveLength(8)
    expect(achievements.every((achievement) => achievement.unlocked)).toBe(true)
    expect(achievements.every((achievement) => achievement.progress === 1)).toBe(true)
    expect(achievements.every((achievement) => achievement.remaining === 0)).toBe(true)
  })

  it('mantém conquistas bloqueadas quando os marcos não foram atingidos', () => {
    const achievements = buildAchievements({
      attempts: [],
      coursesWithProgress: [{ percent: 0, started: false }],
      stats: { streak: 0, bestAccuracy: 0, bestWpm: 0, totalSeconds: 0, xp: 0 },
    })

    expect(achievements.every((achievement) => !achievement.unlocked)).toBe(true)
    expect(achievements[0]).toMatchObject({ id: 'first-step', current: 0, target: 1 })
  })

  it('distribui minutos nos últimos sete dias', () => {
    const days = getLast7Days([
      attempt({ durationSeconds: 600, createdAt: daysAgo(0) }),
      attempt({ durationSeconds: 300, createdAt: daysAgo(1) }),
      attempt({ durationSeconds: 999, createdAt: daysAgo(8) }),
    ])

    expect(days).toHaveLength(7)
    expect(days[6]).toMatchObject({ minutes: 10, today: true })
    expect(days[5]).toMatchObject({ minutes: 5, today: false })
    expect(days.reduce((total, day) => total + day.minutes, 0)).toBe(15)
  })

  it('classifica a intensidade do heatmap', () => {
    const heatmap = getHeatmap([
      attempt({ durationSeconds: 30 * 60, createdAt: daysAgo(0) }),
      attempt({ durationSeconds: 20 * 60, createdAt: daysAgo(1) }),
      attempt({ durationSeconds: 10 * 60, createdAt: daysAgo(2) }),
      attempt({ durationSeconds: 60, createdAt: daysAgo(3) }),
    ])

    expect(heatmap).toHaveLength(56)
    const byKey = Object.fromEntries(heatmap.map((day) => [day.key, day]))
    expect(byKey[dayKey(daysAgo(0))].level).toBe(4)
    expect(byKey[dayKey(daysAgo(1))].level).toBe(3)
    expect(byKey[dayKey(daysAgo(2))].level).toBe(2)
    expect(byKey[dayKey(daysAgo(3))].level).toBe(1)
    expect(byKey[dayKey(daysAgo(4))].level).toBe(0)
  })

  it('gera desafios diários, semanais e mensais', () => {
    const challenges = buildChallenges({
      attempts: [
        attempt({ durationSeconds: 600, accuracy: 98, wpm: 65, createdAt: daysAgo(0) }),
        attempt({
          lessonId: 'fund-02',
          durationSeconds: 120,
          accuracy: 96,
          wpm: 75,
          createdAt: daysAgo(1),
        }),
        attempt({ wpm: 80, createdAt: daysAgo(10) }),
      ],
      stats: { monthlyXp: 500 },
      dailyGoalMinutes: 10,
      nextLesson: { lesson: { id: 'fund-03' } },
    })

    expect(challenges).toHaveLength(6)
    expect(challenges[0]).toMatchObject({
      id: 'daily-goal',
      value: 10,
      target: 10,
      complete: true,
      lessonId: 'fund-03',
    })
    expect(challenges[1]).toMatchObject({ id: 'daily-accuracy', value: 98, complete: true })
    expect(challenges[2]).toMatchObject({ id: 'weekly-days', value: 2, complete: false })
    expect(challenges[3]).toMatchObject({ id: 'weekly-lessons', value: 2, complete: false })
    expect(challenges[4]).toMatchObject({ id: 'monthly-speed', value: 80, complete: true })
    expect(challenges[5]).toMatchObject({
      id: 'monthly-xp',
      value: 500,
      target: 1000,
      progress: 0.5,
      complete: false,
    })
  })

  it('monta o ranking e respeita o perfil privado', () => {
    const users = [
      { id: 'u1', name: 'Ana Lima', weeklyXp: 120, monthlyXp: 300, totalXp: 900, wpm: 55 },
      { id: 'u2', name: 'Bia Souza', weeklyXp: 80, monthlyXp: 200, totalXp: 700, wpm: 65 },
    ]
    const context = {
      user: { name: 'Marina Costa' },
      stats: { weeklyXp: 100, monthlyXp: 250, xp: 800, avgWpm: 60, avgAccuracy: 98 },
      period: 'semanal',
    }

    const publicRanking = buildRanking(users, { ...context, publicProfile: true })
    expect(publicRanking).toHaveLength(3)
    expect(publicRanking[0]).toMatchObject({ name: 'Ana Lima', position: 1 })
    expect(publicRanking[1]).toMatchObject({ name: 'Marina Costa', isCurrent: true, position: 2 })
    expect(publicRanking[2]).toMatchObject({ name: 'Bia Souza', position: 3 })

    const privateRanking = buildRanking(users, { ...context, publicProfile: false })
    expect(privateRanking).toHaveLength(2)
    expect(privateRanking.every((entry) => !entry.isCurrent)).toBe(true)
  })
})
