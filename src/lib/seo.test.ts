import { describe, expect, it } from 'vitest'
import { buildHomeTitle, buildPageTitle } from './seo'
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

describe('buildHomeTitle', () => {
  it('@s3 (layout) devuelve "<nombre> — <tagline>" en ese orden', () => {
    expect(buildHomeTitle()).toBe('Cénit Digital — Soluciones digitales para pymes')
  })

  it('@s3 (layout) se compone del nombre y la tagline del sitio', () => {
    expect(buildHomeTitle()).toBe(`${SITE.name} — ${SITE.tagline}`)
  })
})
