import { Route, Routes, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import useReveal from './hooks/useReveal'
import AppLayout from './components/app/AppLayout'
import ProtectedRoute, { PublicOnlyRoute } from './components/app/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import PracticePage from './pages/PracticePage'
import AchievementsPage from './pages/app/AchievementsPage'
import ChallengesPage from './pages/app/ChallengesPage'
import CourseDetailPage from './pages/app/CourseDetailPage'
import CoursesPage from './pages/app/CoursesPage'
import DashboardPage from './pages/app/DashboardPage'
import NotificationsPage from './pages/app/NotificationsPage'
import ProfilePage from './pages/app/ProfilePage'
import ProgressPage from './pages/app/ProgressPage'
import RankingPage from './pages/app/RankingPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

export default function App() {
  const location = useLocation()
  useReveal([location.pathname])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app/praticar/:lessonId" element={<PracticePage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="trilhas" element={<CoursesPage />} />
            <Route path="trilhas/:courseId" element={<CourseDetailPage />} />
            <Route path="desafios" element={<ChallengesPage />} />
            <Route path="progresso" element={<ProgressPage />} />
            <Route path="conquistas" element={<AchievementsPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="notificacoes" element={<NotificationsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
