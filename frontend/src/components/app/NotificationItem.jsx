import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../lib/format'
import AppIcon from '../AppIcon'

export const notificationIcons = {
  goal: { name: 'target', tone: 'mint' },
  achievement: { name: 'trophy', tone: 'amber' },
  streak: { name: 'flame', tone: 'coral' },
  course: { name: 'route', tone: 'teal' },
  lesson: { name: 'keyboard', tone: 'mint' },
}

export default function NotificationItem({ notification, onRead, compact = false }) {
  const meta = notificationIcons[notification.kind] ?? notificationIcons.lesson

  const content = (
    <>
      <span className={`notice__icon notice__icon--${meta.tone}`}>
        <AppIcon name={meta.name} size={17} />
      </span>
      <span className="notice__body">
        <span className="notice__top">
          <strong>{notification.title}</strong>
          {!notification.read && <i className="notice__unread" aria-label="Não lida" />}
        </span>
        <span className="notice__message">{notification.message}</span>
        <span className="notice__time">{formatRelativeTime(notification.createdAt)}</span>
      </span>
    </>
  )

  const classes = `notice${notification.read ? '' : ' is-unread'}${
    compact ? ' notice--compact' : ''
  }`

  if (notification.href) {
    return (
      <Link className={classes} to={notification.href} onClick={() => onRead?.(notification.id)}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} type="button" onClick={() => onRead?.(notification.id)}>
      {content}
    </button>
  )
}
