import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderNav from './HeaderNav'

/** matchMedia estático: controla si el viewport se considera móvil. */
function mockMatchMedia(mobile: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: mobile,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HeaderNav', () => {
  it('@s2 en escritorio muestra los 4 enlaces en orden y el CTA "Hablamos" → #contacto', () => {
    mockMatchMedia(false)
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

  it('@s2 en escritorio no aparece el botón de menú móvil', () => {
    mockMatchMedia(false)
    render(<HeaderNav />)

    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Menú' })).not.toBeInTheDocument()
  })

  it('@s4 en móvil se oculta la nav de escritorio y aparece el botón "Menú"', () => {
    mockMatchMedia(true)
    render(<HeaderNav />)

    expect(screen.getByRole('button', { name: 'Menú' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Principal' })).not.toBeInTheDocument()
  })
})
