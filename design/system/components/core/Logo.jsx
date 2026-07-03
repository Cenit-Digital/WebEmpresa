import React from 'react'

/**
 * Logotipo de Cénit Digital — icono "Órbita" (anillo + onda + punto) con
 * wordmark opcional. Colores desde tokens, así que se adapta a claro/oscuro.
 */
export function Logo({ withWordmark = true, size = 40, style, ...rest }) {
  const raw = typeof React.useId === 'function' ? React.useId() : 'cenit'
  const gradId = 'cenit-wave-' + String(raw).replace(/:/g, '')
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', ...style }} {...rest}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block', flex: 'none' }}
      >
        <defs>
          <linearGradient id={gradId} x1="12" y1="40" x2="68" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-ring)" strokeWidth="1.8" strokeOpacity="0.5" />
        <path
          d="M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="40" cy="20" r="3.8" fill="var(--color-zenith)" />
      </svg>
      {withWordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '23px',
              letterSpacing: '1.5px',
              color: 'var(--color-logo-ink)',
            }}
          >
            cénit
          </span>
          <span
            style={{
              marginTop: '3px',
              fontFamily: 'var(--font-sans)',
              fontSize: '8px',
              letterSpacing: '5px',
              textTransform: 'lowercase',
              color: 'var(--color-logo-sub)',
            }}
          >
            digital
          </span>
        </span>
      )}
    </span>
  )
}
