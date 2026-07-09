import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HeaderNav from './HeaderNav'

// La cabecera ya NO ramifica el render por `matchMedia`: pinta SIEMPRE los dos
// clústeres (nav de escritorio + barra móvil) y decide cuál se ve por CSS
// `@media`. Aun así `ThemeToggle` lee `matchMedia` en un Effect, de ahí este
// mock por defecto (viewport de escritorio) para que su montaje no reviente.
function mockMatchMedia(mobile: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: mobile,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

// Cuerpo del primer bloque `selector { … }` dentro de un fragmento de SCSS.
function ruleBody(scss: string, selector: string): string {
  const match = scss.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`bloque ${selector} { … } no encontrado`)
  return match[1]
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  mockMatchMedia(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HeaderNav', () => {
  it('@s2 la nav de escritorio muestra los 4 enlaces en orden y el CTA "Hablamos" → #contacto', () => {
    render(<HeaderNav />)

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const links = within(nav)
      .getAllByRole('link')
      .map((link) => [link.textContent, link.getAttribute('href')])
    expect(links).toEqual([
      ['Servicios', '#servicios'],
      ['Sectores', '#sectores'],
      ['Paquetes', '#paquetes'],
      ['Contacto', '#contacto'],
      ['Hablamos', '#contacto'],
    ])
  })

  it('@s6 la nav ordena: enlaces → botón de tema → "Hablamos" (tema entre Contacto y Hablamos)', async () => {
    render(<HeaderNav />)

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    // El botón de tema es client-only (ClientOnly): esperamos su montaje. Hay dos
    // botones de tema en el header (uno por clúster) → acotamos con `within(nav)`.
    await within(nav).findByRole('button', { name: /Cambiar tema/ })

    const order = Array.from(nav.querySelectorAll('a, button')).map((el) =>
      el.tagName === 'BUTTON' ? 'TEMA' : el.textContent,
    )
    expect(order).toEqual(['Servicios', 'Sectores', 'Paquetes', 'Contacto', 'TEMA', 'Hablamos'])
  })

  it('@s4 la barra móvil expone el botón "Menú" (siempre presente en el árbol)', () => {
    render(<HeaderNav />)

    // Ambos clústeres coexisten en el DOM; CSS decide la visibilidad.
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menú' })).toBeInTheDocument()
  })

  it('@s4 el CSS invierte la visibilidad en ≤767px: nav oculta y barra móvil visible (sin JS)', () => {
    // jsdom no hace layout: el contrato responsive es el CONTENIDO del módulo.
    // El SSG hornea ambos clústeres; el @media decide cuál se ve desde el primer
    // pintado, sin depender de la hidratación (causa raíz del bug de móvil).
    const scss = readFileSync(
      resolve(process.cwd(), 'src/components/HeaderNav.module.scss'),
      'utf8',
    )
    const mediaIndex = scss.indexOf('@media (max-width: 767px)')
    expect(mediaIndex).toBeGreaterThan(-1)

    const base = scss.slice(0, mediaIndex)
    const media = scss.slice(mediaIndex)

    // Escritorio (base): la nav se ve; la barra móvil está oculta.
    expect(ruleBody(base, '.nav')).toMatch(/display:\s*flex/)
    expect(ruleBody(base, '.mobile')).toMatch(/display:\s*none/)

    // Móvil (@media ≤767px): se invierte → nav oculta, barra móvil visible.
    expect(ruleBody(media, '.nav')).toMatch(/display:\s*none/)
    expect(ruleBody(media, '.mobile')).toMatch(/display:\s*flex/)
  })

  it('@s4 anti-regresión: el botón de tema sigue junto a "Menú" en el clúster móvil', async () => {
    render(<HeaderNav />)

    // Dos botones de tema (uno por clúster), ambos client-only: esperamos montaje.
    const themeButtons = await screen.findAllByRole('button', { name: /Cambiar tema/ })
    expect(themeButtons).toHaveLength(2)

    const menuButton = screen.getByRole('button', { name: 'Menú' })
    const mobileCluster = menuButton.parentElement
    if (!mobileCluster) throw new Error('clúster móvil no encontrado')
    // El tema convive con "Menú" en el mismo clúster (no se pierde en móvil).
    expect(within(mobileCluster).getByRole('button', { name: /Cambiar tema/ })).toBeInTheDocument()
  })
})
