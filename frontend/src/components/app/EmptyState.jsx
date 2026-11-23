import AppIcon from '../AppIcon'

export default function EmptyState({ icon = 'spark', title, description, action }) {
  return (
    <div className="app-empty">
      <span className="app-empty__icon">
        <AppIcon name={icon} size={24} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action && <div className="app-empty__action">{action}</div>}
    </div>
  )
}
