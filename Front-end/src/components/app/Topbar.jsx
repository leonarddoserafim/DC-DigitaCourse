import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getInitials } from '../../lib/format'
import { Bell, Flame, Menu, Target } from '../Icons'
import NotificationItem from './NotificationItem'

const sectionNames = {
  '/app': 'Visão geral',
  '/app/trilhas': 'Trilhas',
  '/app/desafios': 'Desafios',
  '/app/progresso': 'Progresso',
  '/app/conquistas': 'Conquistas',
  '/app/ranking': 'Ranking',
  '/app/perfil': 'Perfil e ajustes',
  '/app/notificacoes': 'Notificações',
}

function getSectionName(pathname) {
  if (sectionNames[pathname]) return sectionNames[pathname]
  if (pathname.startsWith('/app/trilhas/')) return 'Detalhes da trilha'
  return 'Área do aluno'
}

export default function Topbar({ onOpenMenu, notificationsOpen, setNotificationsOpen }) {
  const {
    user,
    stats,
    prefs,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp()
  const location = useLocation()
  const section = getSectionName(location.pathname)
  const todayGoal = prefs.dailyGoalMinutes ?? 10
  const todayMinutes = Math.round(stats.todaySeconds / 60)
  const goalPercent = Math.min(100, Math.round((todayMinutes / todayGoal) * 100))

  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <button
          className="app-topbar__menu"
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
        >
          <Menu size={21} />
        </button>
        <div className="app-breadcrumb">
          <span>Área do aluno</span>
          <strong>{section}</strong>
        </div>
      </div>

      <div className="app-topbar__actions">
        <span className="app-goal-pill" title={`${todayMinutes} de ${todayGoal} minutos hoje`}>
          <Target size={15} />
          <span>
            {goalPercent}% <small>da meta</small>
          </span>
        </span>
        <span className="app-streak-pill" title="Dias consecutivos de prática">
          <Flame size={15} />
          {stats.streak}
        </span>

        <div className="app-notifications">
          <button
            className={`app-icon-btn${notificationsOpen ? ' is-active' : ''}`}
            type="button"
            aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
            aria-expanded={notificationsOpen}
            aria-controls="notification-panel"
            onClick={() => setNotificationsOpen((value) => !value)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="app-icon-btn__badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <>
              <button
                className="notif-scrim"
                type="button"
                aria-label="Fechar notificações"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="notif-panel" id="notification-panel">
                <div className="notif-panel__head">
                  <div>
                    <strong>Notificações</strong>
                    <span>{unreadCount ? `${unreadCount} não lidas` : 'Tudo em dia'}</span>
                  </div>
                  <button
                    type="button"
                    className="notif-panel__mark"
                    onClick={markAllNotificationsRead}
                    disabled={!unreadCount}
                  >
                    Marcar como lidas
                  </button>
                </div>

                <div className="notif-panel__list">
                  {notifications.length === 0 ? (
                    <p className="notif-panel__empty">Nenhuma notificação por aqui.</p>
                  ) : (
                    notifications.slice(0, 4).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        compact
                        onRead={(id) => {
                          markNotificationRead(id)
                          setNotificationsOpen(false)
                        }}
                      />
                    ))
                  )}
                </div>

                <Link
                  className="notif-panel__footer"
                  to="/app/notificacoes"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Ver todas as notificações
                </Link>
              </div>
            </>
          )}
        </div>

        <Link className="app-topbar__user" to="/app/perfil" aria-label="Abrir perfil">
          <span className="app-avatar app-avatar--sm">{getInitials(user?.name)}</span>
          <span className="app-topbar__user-name">{user?.name?.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  )
}
