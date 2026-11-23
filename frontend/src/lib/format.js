const numberFormatter = new Intl.NumberFormat('pt-BR')

export function formatNumber(value, digits = 0) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '0'
  if (digits === 0) return numberFormatter.format(Math.round(numeric))
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numeric)
}

export function formatDecimal(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0)
}

export function formatMinutesFromSeconds(seconds) {
  const totalMinutes = Math.round((Number(seconds) || 0) / 60)
  if (totalMinutes < 1) return 'menos de 1 min'
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes ? `${hours}h ${minutes}min` : `${hours}h`
}

export function formatClock(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const minutes = Math.floor(total / 60)
  const remaining = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export function formatDate(value, options = {}) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    ...options,
  }).format(date)
}

export function formatFullDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatRelativeTime(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'agora'

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absolute = Math.abs(diffSeconds)
  const formatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

  if (absolute < 60) return 'agora'
  if (absolute < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute')
  if (absolute < 86400) return formatter.format(Math.round(diffSeconds / 3600), 'hour')
  if (absolute < 604800) return formatter.format(Math.round(diffSeconds / 86400), 'day')
  if (absolute < 2592000) return formatter.format(Math.round(diffSeconds / 604800), 'week')
  return formatter.format(Math.round(diffSeconds / 2592000), 'month')
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
