import AppIcon from '../AppIcon'

export default function StatCard({
  icon = 'chart',
  label,
  value,
  suffix,
  hint,
  delta = null,
  tone = 'mint',
}) {
  const numericDelta = Number(delta)
  const hasDelta = delta !== null && Number.isFinite(numericDelta)

  return (
    <article className={`stat-card stat-card--${tone}`} data-reveal>
      <div className="stat-card__top">
        <span className="stat-card__icon">
          <AppIcon name={icon} size={19} />
        </span>
        {hasDelta && (
          <span
            className={`stat-card__delta${
              numericDelta < 0 ? ' is-negative' : numericDelta === 0 ? ' is-neutral' : ''
            }`}
          >
            {numericDelta > 0 ? '+' : ''}
            {numericDelta.toLocaleString('pt-BR', {
              maximumFractionDigits: 1,
            })}
            {suffix === '%' ? ' p.p.' : ''}
          </span>
        )}
      </div>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">
        {value}
        {suffix && <small>{suffix}</small>}
      </strong>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </article>
  )
}
