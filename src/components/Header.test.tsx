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

    // Los botones de tema son client-only: esperamos su montaje antes de contar
    // hijos. Ahora hay dos (uno por clúster: nav de escritorio y barra móvil).
    await screen.findAllByRole('button', { name: /Cambiar tema/ })

    const inner = screen.getByRole('banner').firstElementChild
    expect(inner).not.toBeNull()
    // Exactamente dos grupos: el enlace de marca y el clúster de navegación.
    expect(inner?.children).toHaveLength(2)

    const brand = inner?.children[0]
    expect(brand?.tagName).toBe('A')
    expect(brand).toHaveAttribute('href', '/')

    // El segundo hijo es el clúster; la nav de escritorio vive DENTRO de él.
    const cluster = inner?.children[1]
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(cluster?.contains(nav)).toBe(true)
    // El botón de tema (escritorio) está dentro de la nav, no suelto en el clúster.
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

  // Feature #14 · la cabecera monta `<Logo animated />` (D4): el lockup activa
  // la animación de dibujado vía el atributo `data-logo-anim`.
  it('@s1 la cabecera monta el Logo en modo animado (data-logo-anim en el lockup)', () => {
    renderHeader()

    const brand = screen.getByRole('link', { name: /inicio/i })
    const lockup = brand.querySelector('[data-logo-anim]')
    expect(lockup).not.toBeNull()
    expect(lockup).toHaveAttribute('data-logo-anim', '')
  })
})
