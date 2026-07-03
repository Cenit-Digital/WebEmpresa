import React from 'react'

/**
 * Botón de acción de Cénit Digital.
 * Variantes: primary (relleno), secondary (contorno), ghost (neutro).
 * Renderiza <a> si recibe href, si no <button>. Colores desde tokens.
 */
export function Button({ variant = 'primary', size = 'md', href, children, style, ...rest }) {
  const base = {
    display: 'inline-block',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: size === 'sm' ? '14px' : '15px',
    lineHeight: 1.1,
    padding: size === 'sm' ? '10px 21px' : '14px 28px',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid transparent',
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'filter .15s ease, transform .15s ease, border-color .15s ease',
  }
  const variants = {
    primary: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-primary)' },
    secondary: { background: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
    ghost: { background: 'transparent', color: 'var(--color-text)', borderColor: 'var(--color-border)' },
  }
  const merged = { ...base, ...(variants[variant] || variants.primary), ...style }
  const Tag = href ? 'a' : 'button'
  return (
    <Tag href={href} style={merged} {...rest}>
      {children}
    </Tag>
  )
}
