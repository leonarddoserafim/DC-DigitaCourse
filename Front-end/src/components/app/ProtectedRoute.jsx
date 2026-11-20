import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp()
  const location = useLocation()

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
  const { isAuthenticated } = useApp()
  if (isAuthenticated) return <Navigate to="/app" replace />
  return children ?? <Outlet />
}
