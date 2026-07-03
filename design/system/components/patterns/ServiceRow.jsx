import React from 'react'

function useIsMobile(bp = 880) {
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

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" style={{ flex: 'none' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/**
 * Fila de servicio en zigzag: tarjeta (etiqueta, título, descripción, dos
 * características con check) + panel de mockup + nota "Ejemplo". Con reverse
 * el mockup va a la izquierda. En móvil (≤880px) apila a una columna.
 */
export function ServiceRow({ tag, title, desc, features = [], example, mockup, reverse = false }) {
  const isMobile = useIsMobile(880)
  const cols = isMobile ? '1fr' : reverse ? '1.15fr 1.05fr' : '1.05fr 1.15fr'

  const card = (
    <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '36px 32px', boxShadow: 'var(--shadow)' }}>
      {tag && <span style={{ display: 'inline-block', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-tag-ink)', background: 'var(--color-tag-bg)', padding: '6px 13px', borderRadius: 'var(--radius-pill)' }}>{tag}</span>}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--color-text)', margin: '15px 0 12px', lineHeight: 1.08 }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15.5px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '18px' }}>{desc}</p>
      {features.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', borderTop: '1px solid var(--color-border)', paddingTop: '18px' }}>
          {features.map((f, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'var(--color-text)' }}><Check />{f}</span>
          ))}
        </div>
      )}
    </div>
  )

  const media = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'linear-gradient(160deg, var(--color-bg-2), var(--color-surface))', boxShadow: 'var(--shadow)' }}>
        {mockup}
      </div>
      {example && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-tag-ink)' }}>Ejemplo</span>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.55, marginTop: '5px' }}>{example}</p>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '30px', alignItems: 'center' }}>
      {reverse && !isMobile ? (<>{media}{card}</>) : (<>{card}{media}</>)}
    </div>
  )
}
