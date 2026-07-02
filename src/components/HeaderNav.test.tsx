import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

beforeEach(() => {
  window.location.hash = ''
})

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

  it.each([
    ['Servicios', '#servicios'],
    ['Sectores', '#sectores'],
    ['Paquetes', '#paquetes'],
    ['Contacto', '#contacto'],
  ])('@s3 pulsar "%s" desplaza a la sección "%s"', async (label, anchor) => {
    mockMatchMedia(false)
    const user = userEvent.setup()
    render(<HeaderNav />)

    await user.click(screen.getByRole('link', { name: label }))

    expect(window.location.hash).toBe(anchor)
  })

  it('@s9 en escritorio no hay botón de menú y sí la nav de escritorio', () => {
    mockMatchMedia(false)
    render(<HeaderNav />)

    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Abrir menú' })).not.toBeInTheDocument()
  })

  it('@s5 en móvil muestra el botón de menú y oculta la nav de escritorio', () => {
    mockMatchMedia(true)
    render(<HeaderNav />)

    expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Principal' })).not.toBeInTheDocument()
  })
})
