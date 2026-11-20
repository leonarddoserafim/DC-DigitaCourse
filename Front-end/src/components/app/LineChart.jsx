import { useId } from 'react'

export default function LineChart({
  data = [],
  height = 240,
  tone = 'teal',
  suffix = '',
  emptyLabel = 'Ainda não há dados suficientes para traçar este gráfico.',
  ariaLabel,
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const gradientId = `line-area-${rawId}`

  if (!data.length) {
    return (
      <div className="app-chart-empty">
        <span />
        <p>{emptyLabel}</p>
      </div>
    )
  }

  const width = 640
  const padding = { top: 26, right: 24, bottom: 34, left: 40 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const values = data.map((point) => Number(point.value) || 0)
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const domainPadding = Math.max(4, (rawMax - rawMin) * 0.2)
  const min = Math.max(0, rawMin - domainPadding)
  const max = rawMax + domainPadding || 10
  const range = max - min || 1

  const points = data.map((point, index) => ({
    x: padding.left + (index / Math.max(1, data.length - 1)) * plotWidth,
    y: padding.top + (1 - ((Number(point.value) || 0) - min) / range) * plotHeight,
    ...point,
  }))

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + plotHeight
  } L ${points[0].x} ${padding.top + plotHeight} Z`

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3
    return {
      y: padding.top + ratio * plotHeight,
      value: max - ratio * range,
    }
  })

  const labelEvery = Math.max(1, Math.ceil(data.length / 7))
  const last = points[points.length - 1]
  const average = values.reduce((total, value) => total + value, 0) / values.length
  const summary =
    ariaLabel ??
    `Gráfico com ${data.length} pontos. Primeiro valor ${data[0].value}${suffix}, último valor ${
      data[data.length - 1].value
    }${suffix}, média ${average.toFixed(1).replace('.', ',')}${suffix}.`

  return (
    <div className={`app-line-chart app-line-chart--${tone}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="app-line-chart__grid">
          {gridLines.map((line) => (
            <g key={line.y}>
              <line x1={padding.left} y1={line.y} x2={width - padding.right} y2={line.y} />
              <text x={padding.left - 10} y={line.y + 4} textAnchor="end">
                {Math.round(line.value)}
              </text>
            </g>
          ))}
        </g>

        <path className="app-line-chart__area" d={areaPath} fill={`url(#${gradientId})`} />
        <path className="app-line-chart__line" d={linePath} />

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle className="app-line-chart__dot" cx={point.x} cy={point.y} r="3.5">
              <title>
                {point.label}: {point.value}
                {suffix}
              </title>
            </circle>
            {(index === points.length - 1 || index % labelEvery === 0) && (
              <text
                className="app-line-chart__x-label"
                x={point.x}
                y={height - 10}
                textAnchor={index === points.length - 1 ? 'end' : 'middle'}
              >
                {point.label}
              </text>
            )}
          </g>
        ))}

        <g className="app-line-chart__last">
          <rect x={Math.min(width - padding.right - 64, last.x - 32)} y={last.y - 34} width="64" height="24" rx="8" />
          <text
            x={Math.min(width - padding.right - 32, last.x)}
            y={last.y - 18}
            textAnchor="middle"
          >
            {last.value}
            {suffix}
          </text>
        </g>
      </svg>
    </div>
  )
}
