import { describe, expect, it } from 'vitest'
import { CTA_LINK, NAV_LINKS } from './nav'

describe('nav', () => {
  it('@s2 NAV_LINKS son Servicios/Sectores/Paquetes/Contacto en orden, con sus anclas', () => {
    expect(NAV_LINKS).toEqual([
      { label: 'Servicios', href: '#servicios' },
      { label: 'Sectores', href: '#sectores' },
      { label: 'Paquetes', href: '#paquetes' },
      { label: 'Contacto', href: '#contacto' },
    ])
  })

  it('@s2 CTA_LINK es "Hablamos" y apunta a #contacto', () => {
    expect(CTA_LINK).toEqual({ label: 'Hablamos', href: '#contacto' })
  })
})
