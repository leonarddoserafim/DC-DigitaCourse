import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { courses, getCourse, getLesson } from '../data/courses'
import { DEMO_EMAIL, createDemoAccount, createEmptyAccount } from '../data/seed'
import {
  buildAchievements,
  buildChallenges,
  computeCourseProgress,
  computeStats,
  getHeatmap,
  getLast7Days,
  getNextLesson,
  sortAttempts,
} from '../lib/metrics'

const ACCOUNTS_KEY = 'digitacourse:accounts:v1'
const SESSION_KEY = 'digitacourse:session:v1'
const AppContext = createContext(null)

function readAccounts() {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length) return parsed
    }
  } catch {
    // Storage may be unavailable; the app still works in memory.
  }

  const demo = createDemoAccount()
  return { demo }
}

function readSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.userId ? parsed : null
  } catch {
    return null
  }
}

function persist(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures in the prototype.
  }
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`
  return `${prefix}-${Date.now()}`
}

export function AppProvider({ children }) {
  const [accounts, setAccounts] = useState(readAccounts)
  const [session, setSession] = useState(readSession)

  useEffect(() => {
    persist(ACCOUNTS_KEY, accounts)
  }, [accounts])

  useEffect(() => {
    persist(SESSION_KEY, session)
  }, [session])

  const account = session ? accounts[session.userId] ?? null : null
  const isAuthenticated = Boolean(account)

  useEffect(() => {
    if (session && !accounts[session.userId]) setSession(null)
  }, [accounts, session])

  const updateCurrentAccount = useCallback(
    (updater) => {
      if (!session?.userId) return
      setAccounts((current) => {
        const existing = current[session.userId]
        if (!existing) return current
        return { ...current, [session.userId]: updater(existing) }
      })
    },
    [session],
  )

  const login = useCallback(
    (email, password) => {
      const normalized = email.trim().toLowerCase()
      if (!normalized || !password) {
        return { ok: false, error: 'Preencha o e-mail e a senha.' }
      }
      if (password.length < 4) {
        return { ok: false, error: 'A senha precisa ter pelo menos 4 caracteres.' }
      }

      const found = Object.values(accounts).find(
        (item) => item.user.email.toLowerCase() === normalized,
      )
      if (!found) {
        return {
          ok: false,
          error: 'Não encontramos uma conta com este e-mail. Crie uma conta para continuar.',
        }
      }

      setSession({ userId: found.user.id, signedInAt: new Date().toISOString() })
      return { ok: true }
    },
    [accounts],
  )

  const loginDemo = useCallback(() => {
    let demo = Object.values(accounts).find(
      (item) => item.user.email.toLowerCase() === DEMO_EMAIL,
    )
    if (!demo) {
      demo = createDemoAccount()
      setAccounts((current) => ({ ...current, demo: demo }))
    }
    setSession({ userId: demo.user.id, signedInAt: new Date().toISOString() })
    return { ok: true }
  }, [accounts])

  const signup = useCallback(
    ({ name, email, password }) => {
      const cleanName = name.trim()
      const normalized = email.trim().toLowerCase()

      if (cleanName.length < 2) {
        return { ok: false, error: 'Informe seu nome completo.' }
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false, error: 'Informe um e-mail válido.' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'A senha precisa ter pelo menos 6 caracteres.' }
      }
      if (Object.values(accounts).some((item) => item.user.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'Já existe uma conta com este e-mail. Faça login.' }
      }

      const id = createId('user')
      const newAccount = createEmptyAccount({ id, name: cleanName, email: normalized })
      setAccounts((current) => ({ ...current, [id]: newAccount }))
      setSession({ userId: id, signedInAt: new Date().toISOString() })
      return { ok: true }
    },
    [accounts],
  )

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const updateProfile = useCallback(
    ({ name, prefs }) => {
      updateCurrentAccount((current) => ({
        ...current,
        user: name ? { ...current.user, name: name.trim() } : current.user,
        prefs: prefs ? { ...current.prefs, ...prefs } : current.prefs,
      }))
    },
    [updateCurrentAccount],
  )

  const recordAttempt = useCallback(
    (lesson, result) => {
      const attempt = {
        id: createId('attempt'),
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        courseId: lesson.courseId,
        courseTitle: lesson.courseTitle,
        wpm: Math.max(0, Math.round(result.wpm)),
        accuracy: Math.max(0, Math.min(100, Number(result.accuracy.toFixed(1)))),
        durationSeconds: Math.max(1, Math.round(result.durationSeconds)),
        characters: lesson.text.length,
        errors: result.errors,
        xp: result.xp,
        createdAt: new Date().toISOString(),
      }

      updateCurrentAccount((current) => {
        const newCompletion = !current.progress.completedLessons.includes(lesson.id)
        const notification = {
          id: createId('notice'),
          title: newCompletion ? 'Lição concluída' : 'Prática registrada',
          message: `${lesson.title}: ${attempt.wpm} WPM, ${attempt.accuracy
            .toString()
            .replace('.', ',')}% de precisão e +${attempt.xp} XP.`,
          kind: 'lesson',
          href: '/app/progresso',
          read: false,
          createdAt: new Date().toISOString(),
        }

        return {
          ...current,
          progress: {
            completedLessons: newCompletion
              ? [...current.progress.completedLessons, lesson.id]
              : current.progress.completedLessons,
            attempts: [attempt, ...current.progress.attempts],
          },
          notifications: [notification, ...current.notifications].slice(0, 30),
        }
      })

      return attempt
    },
    [updateCurrentAccount],
  )

  const resetProgress = useCallback(() => {
    updateCurrentAccount((current) => ({
      ...current,
      progress: { completedLessons: [], attempts: [] },
      notifications: [
        {
          id: createId('notice'),
          title: 'Progresso redefinido',
          message: 'Seu histórico de prática foi zerado. Você pode começar de novo.',
          kind: 'goal',
          href: '/app/trilhas',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...current.notifications,
      ].slice(0, 30),
    }))
  }, [updateCurrentAccount])

  const restoreDemo = useCallback(() => {
    const demo = createDemoAccount()
    setAccounts((current) => ({ ...current, demo }))
    setSession({ userId: demo.user.id, signedInAt: new Date().toISOString() })
  }, [])

  const markNotificationRead = useCallback(
    (id) => {
      updateCurrentAccount((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        ),
      }))
    },
    [updateCurrentAccount],
  )

  const markAllNotificationsRead = useCallback(() => {
    updateCurrentAccount((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }))
  }, [updateCurrentAccount])

  const attempts = useMemo(
    () => sortAttempts(account?.progress.attempts ?? []),
    [account],
  )
  const completedLessons = account?.progress.completedLessons ?? []
  const prefs = account?.prefs ?? {}

  const stats = useMemo(
    () => computeStats(attempts, completedLessons),
    [attempts, completedLessons],
  )

  const coursesWithProgress = useMemo(
    () =>
      courses.map((course) => computeCourseProgress(course, completedLessons, attempts)),
    [attempts, completedLessons],
  )

  const nextLessonInfo = useMemo(
    () => getNextLesson(coursesWithProgress),
    [coursesWithProgress],
  )

  const achievements = useMemo(
    () =>
      buildAchievements({
        attempts,
        completedLessons,
        coursesWithProgress,
        stats,
      }),
    [attempts, completedLessons, coursesWithProgress, stats],
  )

  const challenges = useMemo(
    () =>
      buildChallenges({
        attempts,
        stats,
        dailyGoalMinutes: prefs.dailyGoalMinutes ?? 10,
        nextLesson: nextLessonInfo,
      }),
    [attempts, stats, prefs.dailyGoalMinutes, nextLessonInfo],
  )

  const weeklyActivity = useMemo(() => getLast7Days(attempts), [attempts])
  const heatmap = useMemo(() => getHeatmap(attempts), [attempts])

  const notifications = useMemo(
    () =>
      [...(account?.notifications ?? [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [account],
  )

  const value = useMemo(
    () => ({
      user: account?.user ?? null,
      prefs,
      isAuthenticated,
      login,
      loginDemo,
      signup,
      logout,
      updateProfile,
      recordAttempt,
      resetProgress,
      restoreDemo,
      attempts,
      completedLessons,
      stats,
      courses: coursesWithProgress,
      nextLessonInfo,
      achievements,
      challenges,
      weeklyActivity,
      heatmap,
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
      markNotificationRead,
      markAllNotificationsRead,
      getCourseById: getCourse,
      getLessonById: getLesson,
      isLessonUnlocked: (lessonId) => {
        const lesson = getLesson(lessonId)
        if (!lesson) return false
        const course = coursesWithProgress.find((item) => item.id === lesson.courseId)
        if (!course) return false
        const index = course.lessons.findIndex((item) => item.id === lessonId)
        if (index <= 0) return true
        return course.lessons[index - 1].completed
      },
    }),
    [
      account,
      prefs,
      isAuthenticated,
      login,
      loginDemo,
      signup,
      logout,
      updateProfile,
      recordAttempt,
      resetProgress,
      restoreDemo,
      attempts,
      completedLessons,
      stats,
      coursesWithProgress,
      nextLessonInfo,
      achievements,
      challenges,
      weeklyActivity,
      heatmap,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider')
  return context
}
