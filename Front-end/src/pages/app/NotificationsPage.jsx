import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import NotificationItem from '../../components/app/NotificationItem'
import EmptyState from '../../components/app/EmptyState'
import { Bell, CheckCircle, Mail, Settings, Shield } from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import usePageMeta from '../../hooks/usePageMeta'

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'nao-lidas', label: 'Não lidas' },
]

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, prefs } = useApp()
  const [filter, setFilter] = useState('todas')

  usePageMeta(
    'Notificações — DigitaCourse',
    'Avisos de prática, conquistas, sequências e novidades das trilhas.',
  )

  const filtered = useMemo(() => {
    if (filter === 'nao-lidas') {
      return notifications.filter((notification) => !notification.read)
    }
    return notifications
  }, [notifications, filter])

  return (
    <div className="app-page notifications-page">
      <PageHeader
        eyebrow="Notificações"
        title="O que aconteceu enquanto você praticava."
        description="Avisos de metas, conquistas, sequências e trilhas ficam reunidos aqui. Você decide o que marcar como lido."
        actions={
          <button
            className="btn btn--outline"
            type="button"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle size={16} />
            Marcar todas como lidas
          </button>
        }
      />

      <div className="notifications-layout">
        <section className="app-panel notifications-panel" data-reveal>
          <div className="notifications-panel__head">
            <div className="app-filterbar app-filterbar--inline" role="group" aria-label="Filtrar notificações">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`app-filter${filter === item.id ? ' is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                >
                  {item.label}
                  {item.id === 'nao-lidas' && unreadCount > 0 && (
                    <span className="app-filter__badge">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
            <span className="notifications-panel__count">
              {filtered.length} {filtered.length === 1 ? 'aviso' : 'avisos'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="spark"
              title={filter === 'nao-lidas' ? 'Nenhuma notificação não lida' : 'Tudo tranquilo por aqui'}
              description={
                filter === 'nao-lidas'
                  ? 'Você já leu tudo. Novas práticas geram novos avisos.'
                  : 'Pratique uma lição para começar a receber avisos desta conta.'
              }
              action={
                <Link className="btn btn--primary btn--sm" to="/app/trilhas">
                  Ver trilhas
                </Link>
              }
            />
          ) : (
            <div className="notification-list">
              {filtered.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markNotificationRead}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="notifications-aside">
          <section className="notifications-summary" data-reveal>
            <span className="notifications-summary__icon">
              <Bell size={23} />
            </span>
            <span className="app-eyebrow app-eyebrow--light">Resumo</span>
            <h2>{unreadCount ? `${unreadCount} não lidas` : 'Tudo em dia'}</h2>
            <p>
              {unreadCount
                ? 'Abra uma notificação para marcá-la como lida ou use o botão de marcar todas.'
                : 'Você leu todos os avisos disponíveis. O próximo chega depois da sua prática.'}
            </p>
            <div className="notifications-summary__bar" aria-hidden="true">
              <span
                style={{
                  width: notifications.length
                    ? `${Math.round(((notifications.length - unreadCount) / notifications.length) * 100)}%`
                    : '100%',
                }}
              />
            </div>
            <small>
              {notifications.length - unreadCount} de {notifications.length} lidas
            </small>
          </section>

          <section className="app-panel notifications-prefs" data-reveal>
            <span className="app-eyebrow">Preferências</span>
            <h2>Como você quer ser avisado?</h2>
            <ul>
              <li>
                <span>
                  <Mail size={17} />
                </span>
                <p>
                  <strong>Lembretes por e-mail</strong>
                  {prefs.emailReminders ? 'Ativados' : 'Desativados'} nesta conta local.
                </p>
              </li>
              <li>
                <span>
                  <CheckCircle size={17} />
                </span>
                <p>
                  <strong>Resumo semanal</strong>
                  {prefs.weeklySummary ? 'Ativado' : 'Desativado'} para acompanhar sua evolução.
                </p>
              </li>
              <li>
                <span>
                  <Shield size={17} />
                </span>
                <p>
                  <strong>Privacidade</strong>
                  Perfil público {prefs.publicProfile ? 'ativo' : 'oculto'} no ranking.
                </p>
              </li>
            </ul>
            <Link className="app-panel__link" to="/app/perfil">
              <Settings size={15} />
              Ajustar preferências
            </Link>
          </section>

          <p className="notifications-note" data-reveal>
            Nesta etapa, as notificações são geradas localmente. Nenhum e-mail é enviado de verdade.
          </p>
        </aside>
      </div>
    </div>
  )
}
