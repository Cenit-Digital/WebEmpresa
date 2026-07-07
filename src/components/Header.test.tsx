import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './Header'

function mockMatchMedia(mobile: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: mobile,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

function renderHeader() {
  mockMatchMedia(false)
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Header', () => {
  it('@s5 la cabecera tiene dos grupos (logo + clúster) y el tema vive dentro del clúster', async () => {
    renderHeader()

    // El botón de tema es client-only: esperamos su montaje antes de contar hijos.
    await screen.findAllByRole('button', { name: /Cambiar tema/ })

    const inner = screen.getByRole('banner').firstElementChild
    expect(inner).not.toBeNull()
    // Exactamente dos grupos: el enlace de marca y el clúster de navegación.
    expect(inner?.children).toHaveLength(2)

    const brand = inner?.children[0]
    expect(brand?.tagName).toBe('A')
    expect(brand).toHaveAttribute('href', '/')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(inner?.children[1]).toBe(nav)
    // El botón de tema está DENTRO del clúster, no suelto como tercer hijo.
    expect(within(nav).getByRole('button', { name: /Cambiar tema/ })).toBeInTheDocument()
  })
  it('@s1 el logotipo enlaza a "/" (inicio)', () => {
    renderHeader()

    const brand = screen.getByRole('link', { name: /inicio/i })
    expect(brand).toHaveAttribute('href', '/')
    expect(brand).toHaveAccessibleName(/cénit digital/i)
  })

  it('@s3 la cabecera es fija en la parte superior de la ventana (position: sticky; top: 0)', () => {
    renderHeader()

    const header = screen.getByRole('banner')
    expect(header.className).toContain('header')

    // jsdom no hace layout; verificamos la propiedad de estilo de forma robusta.
    const scss = readFileSync(resolve(process.cwd(), 'src/components/Header.module.scss'), 'utf8')
    expect(scss).toMatch(/position:\s*sticky/)
    expect(scss).toMatch(/top:\s*0/)
  })
})
