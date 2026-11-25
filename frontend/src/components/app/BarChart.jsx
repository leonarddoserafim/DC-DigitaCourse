export default function BarChart({ data = [], goal = 10, ariaLabel }) {
  const max = Math.max(goal, ...data.map((item) => item.minutes), 1)
  const total = data.reduce((sum, item) => sum + item.minutes, 0)

  return (
    <div
      className="app-bar-chart"
      role="img"
      aria-label={
        ariaLabel ?? `Atividade dos últimos sete dias: ${Math.round(total)} minutos no total.`
      }
    >
      {data.map((item) => {
        const height = Math.max(item.minutes > 0 ? 6 : 0, (item.minutes / max) * 100)
        return (
          <div className={`app-bar-chart__col${item.today ? ' is-today' : ''}`} key={item.key}>
            <span className="app-bar-chart__value">
              {item.minutes > 0 ? Math.round(item.minutes) : ''}
            </span>
            <div className="app-bar-chart__track">
              <span
                className="app-bar-chart__bar"
                style={{ height: `${height}%` }}
                title={`${item.label}: ${Math.round(item.minutes)} min`}
              />
            </div>
            <span className="app-bar-chart__label">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
