import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from './ThemeToggle'

type Listener = () => void

/** `matchMedia` falso controlable, keyeado al literal de la query de tema. */
function fakeMatchMedia(prefersDark: boolean) {
  let current = prefersDark
  const listeners = new Set<Listener>()
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? current : false,
    media: query,
    addEventListener: (type: string, cb: Listener) => {
      if (type === 'change') listeners.add(cb)
    },
    removeEventListener: (type: string, cb: Listener) => {
      if (type === 'change') listeners.delete(cb)
    },
  })) as unknown as typeof window.matchMedia
  return {
    setDark: (value: boolean) => {
      current = value
    },
    emitChange: () => listeners.forEach((cb) => cb()),
    activeListeners: () => listeners.size,
  }
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ThemeToggle', () => {
  it('presenta un radiogroup con las opciones Claro, Oscuro y Sistema', () => {
    fakeMatchMedia(false)
    render(<ThemeToggle />)
    expect(screen.getByRole('radiogroup', { name: /tema/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Sistema' })).toBeInTheDocument()
  })

  it('sin preferencia guardada, marca "Sistema" como activo', () => {
    fakeMatchMedia(false)
    render(<ThemeToggle />)
    expect(screen.getByRole('radio', { name: 'Sistema' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'false')
  })

  it('@s7 refleja la preferencia "dark" guardada tras recargar', () => {
    localStorage.setItem('cenit-theme', 'dark')
    fakeMatchMedia(false)
    render(<ThemeToggle />)
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('@s3 elegir "Claro" fija el tema y lo persiste', async () => {
    fakeMatchMedia(true)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('radio', { name: 'Claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('cenit-theme')).toBe('light')
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'true')
  })

  it('@s4 elegir "Oscuro" fija el tema y lo persiste', async () => {
    fakeMatchMedia(false)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('radio', { name: 'Oscuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('cenit-theme')).toBe('dark')
  })

  it('@s5 elegir "Sistema" borra la preferencia y sigue al SO (claro)', async () => {
    localStorage.setItem('cenit-theme', 'dark')
    fakeMatchMedia(false)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('radio', { name: 'Sistema' }))
    expect(localStorage.getItem('cenit-theme')).toBeNull()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('@s6 en modo Sistema reacciona en vivo al cambio del SO sin recargar', () => {
    const media = fakeMatchMedia(false)
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')

    act(() => {
      media.setDark(true)
      media.emitChange()
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('@s6 fuera del modo Sistema NO reacciona al SO y limpia el listener', async () => {
    const media = fakeMatchMedia(false)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('radio', { name: 'Claro' }))
    expect(media.activeListeners()).toBe(0)

    act(() => {
      media.setDark(true)
      media.emitChange()
    })
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
