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

export function Home({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m3.5 10.5 8.5-7 8.5 7" />
      <path d="M5.5 9.5V20h13V9.5M9.5 20v-5.5h5V20" />
    </svg>
  )
}

export function BookOpen({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M3.5 5.5A2.5 2.5 0 0 1 6 3h4.5v17H6a2.5 2.5 0 0 0-2.5 2.5v-17Z" />
      <path d="M20.5 5.5A2.5 2.5 0 0 0 18 3h-4.5v17H18a2.5 2.5 0 0 1 2.5 2.5v-17Z" />
    </svg>
  )
}

export function Compass({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  )
}

export function Users({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h.5a5.5 5.5 0 0 1 5.5 5.5V20" />
      <path d="M16 5.3a3.5 3.5 0 0 1 0 6.4M17.5 13.3a5.5 5.5 0 0 1 3 4.9V20" />
    </svg>
  )
}

export function Settings({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7.6 7.6 0 0 0-.1-1.2l2-1.5-1.9-3.3-2.4 1a8 8 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.8a8 8 0 0 0-2 1.2l-2.4-1-1.9 3.3 2 1.5a7.6 7.6 0 0 0 0 2.4l-2 1.5 1.9 3.3 2.4-1a8 8 0 0 0 2 1.2l.4 2.8h4.4l.4-2.8a8 8 0 0 0 2-1.2l2.4 1 1.9-3.3-2-1.5c.1-.4.1-.8.1-1.2Z" />
    </svg>
  )
}

export function Bell({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5Z" />
      <path d="M9.5 20a2.7 2.7 0 0 0 5 0" />
    </svg>
  )
}

export function LogOut({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M14 4.5H19a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 19 19.5h-5" />
      <path d="M10 8.5 5.5 12l4.5 3.5M5.5 12H15" />
    </svg>
  )
}

export function Play({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  )
}

export function Lock({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2.5" />
    </svg>
  )
}

export function Calendar({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
    </svg>
  )
}

export function ChevronRight({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function ChevronLeft({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

export function ArrowLeft({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function Mail({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function Eye({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOff({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4 4.5 20 20" />
      <path d="M9.8 6.1A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.7 3.5M6.4 7.7A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1.1 0 2.1-.2 3-.5" />
      <path d="M10 10a3 3 0 0 0 4 4" />
    </svg>
  )
}

export function CheckCircle({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8 12 2.6 2.6L16.5 8.5" />
    </svg>
  )
}

export function Star({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
    </svg>
  )
}

export function Zap({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M13 3 5.5 13.5H11L10 21l8.5-11H13L13 3Z" />
    </svg>
  )
}

export function RotateCcw({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M4 9V4.5M4 9h4.5" />
      <path d="M4.7 9A8.5 8.5 0 1 1 5 15.8" />
    </svg>
  )
}

export function User({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5v-1A6.5 6.5 0 0 1 11 13h2a6.5 6.5 0 0 1 6.5 6.5v1" />
    </svg>
  )
}

export function Shield({ size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...base} {...props}>
      <path d="M12 3 5 6v5.5c0 4.6 3 7.6 7 9.5 4-1.9 7-4.9 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

