import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import AppLoading from './AppLoading'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authReady } = useApp()
  const location = useLocation()

  if (!authReady) return <AppLoading />

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/entrar"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  return children ?? <Outlet />
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, authReady } = useApp()
  if (!authReady) return <AppLoading />
  if (isAuthenticated) return <Navigate to="/app" replace />
  return children ?? <Outlet />
}
