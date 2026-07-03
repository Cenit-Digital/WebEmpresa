import React from 'react'

/**
 * Etiqueta (tag pill) de categoría — versalitas sobre fondo tintado.
 * Se usa en las tarjetas de servicio ("Presencia", "IA", "Marketing"…).
 */
export function Tag({ children, style, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-tag-ink)',
        background: 'var(--color-tag-bg)',
        padding: '6px 13px',
        borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
