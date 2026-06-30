import { describe, expect, it } from 'vitest'
import { buildPageTitle } from './seo'
import { SITE } from './site'

describe('buildPageTitle', () => {
  it('@s1 sin argumento devuelve solo el nombre del sitio', () => {
    expect(buildPageTitle()).toBe(SITE.name)
  })

  it('@s2 con título de página devuelve "<página> — <sitio>"', () => {
    expect(buildPageTitle('Servicios')).toBe(`Servicios — ${SITE.name}`)
  })

  it('@s3 con cadena vacía devuelve solo el nombre del sitio', () => {
    expect(buildPageTitle('')).toBe(SITE.name)
  })
})
