import { Spark } from './Icons'

export default function Toast({ toast }) {
  if (!toast) return null

  return (
    <div className="toast" key={toast.id} aria-hidden="true">
      <span className="toast__icon">
        <Spark size={18} />
      </span>
      <div className="toast__content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
    </div>
  )
}
