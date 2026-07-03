import React from 'react'
import { Logo } from '../core/Logo.jsx'

function useIsMobile(bp = 820) {
  const [m, setM] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(`(max-width:${bp}px)`)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [bp])
  return m
}

/**
 * Cabecera de Cénit Digital: logo + enlaces + toggle de tema + CTA.
 * En móvil (≤820px) colapsa a hamburguesa con panel deslizante que se cierra
 * al pulsar un enlace, el aspa o el fondo. Colores desde tokens.
 */
export function Nav({ links, ctaLabel = 'Hablamos', ctaHref = '#contacto', onToggleTheme }) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile(820)
  const items = links || [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Sectores', href: '#sectores' },
    { label: 'Paquetes', href: '#paquetes' },
    { label: 'Contacto', href: '#contacto' },
  ]
  const toggleTheme =
    onToggleTheme ||
    (() => {
      const el = document.documentElement
      el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark'
    })
  const linkStyle = { fontFamily: 'var(--font-sans)', fontSize: '14.5px', fontWeight: 500, color: 'var(--color-text-soft)', textDecoration: 'none' }
  const iconBtn = { width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-band-border)', background: 'transparent', borderRadius: '10px', cursor: 'pointer', color: 'var(--color-text)' }
  const themeIcon = (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" /><line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" /><line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
    </svg>
  )

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--color-band)', borderBottom: '1px solid var(--color-band-border)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px var(--gutter)' }}>
        <a href="#top" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Cénit Digital, ir a inicio">
          <Logo />
        </a>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {items.map((it) => (
              <a key={it.href} href={it.href} style={linkStyle}>{it.label}</a>
            ))}
            <button type="button" onClick={toggleTheme} aria-label="Cambiar tema" style={iconBtn}>{themeIcon}</button>
            <a href={ctaHref} style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--color-on-primary)', background: 'var(--color-primary)', padding: '10px 21px', borderRadius: 'var(--radius-pill)', textDecoration: 'none' }}>{ctaLabel}</a>
          </div>
        )}

        {isMobile && (
          <button type="button" onClick={() => setOpen(true)} aria-label="Menú" style={{ width: '42px', height: '42px', border: '1px solid var(--color-band-border)', background: 'transparent', borderRadius: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
            <span style={{ width: '18px', height: '2px', background: 'var(--color-text)', borderRadius: '2px' }} />
            <span style={{ width: '18px', height: '2px', background: 'var(--color-text)', borderRadius: '2px' }} />
            <span style={{ width: '18px', height: '2px', background: 'var(--color-text)', borderRadius: '2px' }} />
          </button>
        )}
      </div>

      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, width: '78%', maxWidth: '320px', height: '100%', background: 'var(--color-band)', borderLeft: '1px solid var(--color-band-border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-text)', fontSize: '15px' }}>✕</button>
            </div>
            {items.map((it) => (
              <a key={it.href} href={it.href} onClick={() => setOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text)', padding: '12px 6px', borderBottom: '1px solid var(--color-band-border)', textDecoration: 'none' }}>{it.label}</a>
            ))}
            <button type="button" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '13px 16px', cursor: 'pointer', color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600 }}>{themeIcon}<span>Cambiar tema</span></button>
          </div>
        </div>
      )}
    </nav>
  )
}
