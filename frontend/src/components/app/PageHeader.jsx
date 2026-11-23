export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="app-page-head" data-reveal>
      <div className="app-page-head__copy">
        {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="app-page-head__actions">{actions}</div>}
    </div>
  )
}
