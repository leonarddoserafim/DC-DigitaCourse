const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export function ArrowUpRight({ size = 18, strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowRight({ size = 18, strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowDown({ size = 18, strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M12 4v15M6 13l6 6 6-6" />
    </svg>
  )
}

export function ArrowUp({ size = 18, strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M12 20V5M6 11l6-6 6 6" />
    </svg>
  )
}

export function Spark({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M12 3.5c.65 4.3 2.2 5.85 6.5 6.5-4.3.65-5.85 2.2-6.5 6.5-.65-4.3-2.2-5.85-6.5-6.5 4.3-.65 5.85-2.2 6.5-6.5Z" />
      <path d="M19 16.5c.25 1.7.8 2.25 2.5 2.5-1.7.25-2.25.8-2.5 2.5-.25-1.7-.8-2.25-2.5-2.5 1.7-.25 2.25-.8 2.5-2.5Z" />
    </svg>
  )
}

export function Keyboard({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M19 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M19 13.5h.01M8 16h8" />
    </svg>
  )
}

export function Gauge({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4.5 18a8.5 8.5 0 1 1 15 0" />
      <path d="M12 14.5 16 10" />
      <circle cx="12" cy="14.5" r="1.7" />
      <path d="M4.5 18h15" />
    </svg>
  )
}

export function Clock({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function Trophy({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v3.5M8.5 20h7M10 20v-3.5h4V20" />
    </svg>
  )
}

export function Route({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="5.5" r="2.5" />
      <path d="M8 18.5h3a3 3 0 0 0 3-3v-7a3 3 0 0 1 3-3h-1.5" strokeDasharray="2.5 3" />
    </svg>
  )
}

export function Chart({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4 4v16h16" />
      <path d="m7.5 15 3.5-4 3 2.5 4-5.5" />
    </svg>
  )
}

export function Check({ size = 18, strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  )
}

export function Menu({ size = 22, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function Close({ size = 22, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function Flame({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M12.5 21c4 0 6.5-2.7 6.5-6.2 0-3.6-2.1-5.7-4.7-8.2-.5 2.2-1.6 3.4-2.8 4.2.2-3.4-1.2-6.2-2.5-7.3.1 3.5-1.8 5.5-3.3 7.5A7.4 7.4 0 0 0 4 15.4C4 18.4 6.9 21 10.5 21h2Z" />
      <path d="M9.5 16.2c0-1.5.8-2.4 2-3.5.2 1.2.7 1.8 1.4 2.2.5.3.8.8.8 1.5 0 1.1-1 2-2.1 2s-2.1-.9-2.1-2.2Z" />
    </svg>
  )
}

export function Target({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Browser({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 8.5h18M6.5 6.5h.01M9 6.5h.01" />
    </svg>
  )
}
