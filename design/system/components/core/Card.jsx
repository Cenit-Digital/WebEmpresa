import React from 'react'

/**
 * Tarjeta de contenido de Cénit Digital. Base de las tarjetas de servicio,
 * sector y paquete. Si featured=true, resalta con borde primary, sombra e
 * insignia "Más elegido". Colores desde tokens.
 */
export function Card({ tag, title, featured = false, badge = 'Más elegido', children, footer, style, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-card-bg)',
        border: `1px solid ${featured ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius)',
        boxShadow: featured ? 'var(--shadow)' : 'none',
        padding: '32px 28px',
        ...style,
      }}
      {...rest}
    >
      {featured && (
        <span
          style={{
            position: 'absolute',
            top: '-13px',
            left: '28px',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '5px 13px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {badge}
        </span>
      )}
      {tag && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-tag-ink)',
            background: 'var(--color-tag-bg)',
            padding: '6px 13px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {tag}
        </span>
      )}
      {title && (
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '25px',
            lineHeight: 1.08,
            color: 'var(--color-text)',
            margin: tag ? '15px 0 8px' : '0 0 8px',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.65 }}>
        {children}
      </div>
      {footer && <div style={{ marginTop: 'auto', paddingTop: '20px' }}>{footer}</div>}
    </div>
  )
}
