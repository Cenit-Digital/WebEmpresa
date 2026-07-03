import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Header', () => {
  it('@s1 el logotipo enlaza a "/" (inicio)', () => {
    renderHeader()

    const brand = screen.getByRole('link', { name: /inicio/i })
    expect(brand).toHaveAttribute('href', '/')
    expect(brand).toHaveAccessibleName(/cénit digital/i)
  })

  it('@s4 la cabecera es fija en la parte superior de la ventana (sticky)', () => {
    renderHeader()

    const header = screen.getByRole('banner')
    expect(header.className).toContain('header')

    // jsdom no hace layout; verificamos la propiedad de estilo de forma robusta.
    const scss = readFileSync(resolve(process.cwd(), 'src/components/Header.module.scss'), 'utf8')
    expect(scss).toMatch(/position:\s*sticky/)
    expect(scss).toMatch(/top:\s*0/)
  })
})
