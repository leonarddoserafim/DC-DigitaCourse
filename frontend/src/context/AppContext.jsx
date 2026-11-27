import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { courses as fallbackCourses } from '../data/courses'
import { api, ApiError, clearToken, getToken, storeToken } from '../lib/api'
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

const AppContext = createContext(null)

function errorMessage(error) {
  if (error instanceof ApiError) return error.message
  return 'Não foi possível concluir a operação. Tente novamente.'
}

export function AppProvider({ children }) {
  const [catalog, setCatalog] = useState(fallbackCourses)
  const [account, setAccount] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let active = true

    api
      .getCatalog()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) setCatalog(data)
      })
      .catch(() => {
        // The public site can still render with the bundled catalog while the API is offline.
      })

    if (!getToken()) {
      setAuthReady(true)
      return () => {
        active = false
      }
    }

    api
      .me()
      .then((data) => {
        if (active) setAccount(data)
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          clearToken()
        }
      })
      .finally(() => {
        if (active) setAuthReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  const applySession = useCallback((session) => {
    storeToken(session.token)
    setAccount(session.account)
    setAuthReady(true)
  }, [])

  const login = useCallback(
    async (email, password) => {
      const normalized = email.trim().toLowerCase()
      if (!normalized || !password) {
        return { ok: false, error: 'Preencha o e-mail e a senha.' }
      }

      try {
        applySession(await api.login({ email: normalized, password }))
        return { ok: true }
      } catch (error) {
        return { ok: false, error: errorMessage(error) }
      }
    },
    [applySession],
  )

  const loginDemo = useCallback(async () => {
    try {
      applySession(await api.demoLogin())
      return { ok: true }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }, [applySession])

  const signup = useCallback(
    async ({ name, email, password }) => {
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

      try {
        applySession(await api.signup({ name: cleanName, email: normalized, password }))
        return { ok: true }
      } catch (error) {
        return { ok: false, error: errorMessage(error) }
      }
    },
    [applySession],
  )

  const logout = useCallback(() => {
    clearToken()
    setAccount(null)
    setAuthReady(true)
  }, [])

  const updateProfile = useCallback(async ({ name, prefs }) => {
    try {
      setAccount(
        await api.updateProfile({
          name,
          dailyGoalMinutes: prefs?.dailyGoalMinutes,
          publicProfile: prefs?.publicProfile,
          emailReminders: prefs?.emailReminders,
          weeklySummary: prefs?.weeklySummary,
        }),
      )
      return { ok: true }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }, [])

  const recordAttempt = useCallback(async (lesson, result) => {
    const payload = {
      wpm: Math.max(0, Math.round(result.wpm)),
      accuracy: Math.max(0, Math.min(100, Number(result.accuracy.toFixed(1)))),
      durationSeconds: Math.max(1, Math.round(result.durationSeconds)),
      errors: Math.max(0, Math.round(result.errors)),
    }

    try {
      setAccount(await api.recordAttempt(lesson.id, payload))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }, [])

  const resetProgress = useCallback(async () => {
    try {
      setAccount(await api.resetProgress())
      return { ok: true }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }, [])

  const restoreDemo = useCallback(async () => {
    try {
      applySession(await api.restoreDemo())
      return { ok: true }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }, [applySession])

  const markNotificationRead = useCallback((id) => {
    setAccount((current) =>
      current
        ? {
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.id === id ? { ...notification, read: true } : notification,
            ),
          }
        : current,
    )

    api
      .markNotificationRead(id)
      .then(setAccount)
      .catch(() => {
        api
          .me()
          .then(setAccount)
          .catch(() => {})
      })
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setAccount((current) =>
      current
        ? {
            ...current,
            notifications: current.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
          }
        : current,
    )

    api
      .markAllNotificationsRead()
      .then(setAccount)
      .catch(() => {
        api
          .me()
          .then(setAccount)
          .catch(() => {})
      })
  }, [])

  const allLessons = useMemo(
    () =>
      catalog.flatMap((course) =>
        course.modules.flatMap((module) =>
          module.lessons.map((lesson) => ({
            ...lesson,
            courseId: course.id,
            courseTitle: course.title,
            moduleId: module.id,
            moduleTitle: module.title,
          })),
        ),
      ),
    [catalog],
  )

  const attempts = useMemo(() => sortAttempts(account?.attempts ?? []), [account])
  const completedLessons = useMemo(() => account?.completedLessons ?? [], [account])
  const prefs = useMemo(() => account?.prefs ?? {}, [account])

  const stats = useMemo(
    () => computeStats(attempts, completedLessons),
    [attempts, completedLessons],
  )

  const coursesWithProgress = useMemo(
    () => catalog.map((course) => computeCourseProgress(course, completedLessons, attempts)),
    [catalog, attempts, completedLessons],
  )

  const nextLessonInfo = useMemo(() => getNextLesson(coursesWithProgress), [coursesWithProgress])

  const achievements = useMemo(
    () =>
      buildAchievements({
        attempts,
        coursesWithProgress,
        stats,
      }),
    [attempts, coursesWithProgress, stats],
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

  const isLessonUnlocked = useCallback(
    (lessonId) => {
      const lesson = allLessons.find((item) => item.id === lessonId)
      if (!lesson) return false
      if (completedLessons.includes(lessonId)) return true

      const entries = allLessons.filter((item) => item.courseId === lesson.courseId)
      const index = entries.findIndex((item) => item.id === lessonId)
      if (index <= 0) return true
      return completedLessons.includes(entries[index - 1].id)
    },
    [allLessons, completedLessons],
  )

  const value = useMemo(
    () => ({
      user: account?.user ?? null,
      prefs,
      isAuthenticated: Boolean(account),
      authReady,
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
      getCourseById: (courseId) => catalog.find((course) => course.id === courseId) ?? null,
      getLessonById: (lessonId) => allLessons.find((lesson) => lesson.id === lessonId) ?? null,
      isLessonUnlocked,
    }),
    [
      account,
      prefs,
      authReady,
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
      catalog,
      allLessons,
      isLessonUnlocked,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider')
  return context
}
