import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from './ThemeToggle'

type Listener = () => void

/**
 * `matchMedia` falso controlable, keyeado al literal EXACTO de la query de tema
 * (`'(prefers-color-scheme: dark)'`). Los listeners se registran por query y
 * `emitChange` sólo dispara los de la query de tema: así, si producción muta la
 * cadena (p. ej. a `""`), `window.matchMedia("")` registra su listener en otra
 * ranura, el cambio del SO no llega y el test de "sistema→dark" falla → mutante muerto.
 */
const DARK_QUERY = '(prefers-color-scheme: dark)'

function fakeMatchMedia(prefersDark: boolean) {
  let current = prefersDark
  const listenersByQuery = new Map<string, Set<Listener>>()
  window.matchMedia = ((query: string) => ({
    matches: query === DARK_QUERY ? current : false,
    media: query,
    addEventListener: (type: string, cb: Listener) => {
      if (type !== 'change') return
      const set = listenersByQuery.get(query) ?? new Set<Listener>()
      set.add(cb)
      listenersByQuery.set(query, set)
    },
    removeEventListener: (type: string, cb: Listener) => {
      if (type === 'change') listenersByQuery.get(query)?.delete(cb)
    },
  })) as unknown as typeof window.matchMedia
  return {
    setDark: (value: boolean) => {
      current = value
    },
    emitChange: () => listenersByQuery.get(DARK_QUERY)?.forEach((cb) => cb()),
    activeListeners: () => listenersByQuery.get(DARK_QUERY)?.size ?? 0,
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
  it('@s1 el control de tema es un único botón, no un radiogroup/radio', () => {
    fakeMatchMedia(false)
    render(<ThemeToggle />)

    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('@s4 el nombre accesible incluye el modo activo (Claro/Oscuro/Sistema)', () => {
    fakeMatchMedia(false)

    localStorage.setItem('cenit-theme', 'light')
    const { unmount: u1 } = render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Claro)')
    u1()

    localStorage.setItem('cenit-theme', 'dark')
    const { unmount: u2 } = render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Oscuro)')
    u2()

    localStorage.removeItem('cenit-theme')
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Sistema)')
  })

  it('@s3 el botón identifica su icono activo: sol (Claro), luna (Oscuro), monitor (Sistema)', () => {
    fakeMatchMedia(false)

    localStorage.setItem('cenit-theme', 'light')
    const { container: c1, unmount: u1 } = render(<ThemeToggle />)
    const sun = c1.querySelector('svg')
    expect(sun).toHaveAttribute('data-icon', 'sun')
    expect(sun).toHaveAttribute('stroke', 'currentColor')
    expect(sun?.querySelectorAll('circle')).toHaveLength(1)
    expect(sun?.querySelectorAll('line')).toHaveLength(8)
    expect(sun?.querySelector('path')).toBeNull()
    expect(sun?.querySelector('rect')).toBeNull()
    u1()

    localStorage.setItem('cenit-theme', 'dark')
    const { container: c2, unmount: u2 } = render(<ThemeToggle />)
    const moon = c2.querySelector('svg')
    expect(moon).toHaveAttribute('data-icon', 'moon')
    expect(moon?.querySelectorAll('path')).toHaveLength(1)
    expect(moon?.querySelector('circle')).toBeNull()
    expect(moon?.querySelector('rect')).toBeNull()
    expect(moon?.querySelector('line')).toBeNull()
    u2()

    localStorage.removeItem('cenit-theme')
    const { container: c3 } = render(<ThemeToggle />)
    const monitor = c3.querySelector('svg')
    expect(monitor).toHaveAttribute('data-icon', 'monitor')
    expect(monitor?.querySelectorAll('rect')).toHaveLength(1)
    expect(monitor?.querySelectorAll('line')).toHaveLength(2)
    expect(monitor?.querySelector('circle')).toBeNull()
    expect(monitor?.querySelector('path')).toBeNull()
  })

  it('@s3 el SVG del icono es decorativo (aria-hidden): fuera del árbol de accesibilidad', () => {
    fakeMatchMedia(false)
    const { container } = render(<ThemeToggle />)

    const icon = container.querySelector('[data-icon]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('@s2 cada activación cicla el modo: Claro → Oscuro → Sistema → Claro', async () => {
    fakeMatchMedia(false)
    localStorage.setItem('cenit-theme', 'light')
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAccessibleName('Cambiar tema (actual: Claro)')

    await userEvent.click(button)
    expect(button).toHaveAccessibleName('Cambiar tema (actual: Oscuro)')

    await userEvent.click(button)
    expect(button).toHaveAccessibleName('Cambiar tema (actual: Sistema)')

    await userEvent.click(button)
    expect(button).toHaveAccessibleName('Cambiar tema (actual: Claro)')
  })

  it('@s3(theme) avanzar el ciclo hasta "Claro" fija data-theme "light" y lo persiste', async () => {
    fakeMatchMedia(true)
    render(<ThemeToggle />) // arranca en "Sistema" (sin clave), SO=oscuro → data-theme dark

    await userEvent.click(screen.getByRole('button')) // Sistema → Claro
    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Claro)')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('cenit-theme')).toBe('light')
  })

  it('@s4(theme) avanzar el ciclo hasta "Oscuro" fija data-theme "dark" y lo persiste', async () => {
    fakeMatchMedia(false)
    render(<ThemeToggle />) // Sistema, SO=claro

    const button = screen.getByRole('button')
    await userEvent.click(button) // Sistema → Claro
    await userEvent.click(button) // Claro → Oscuro
    expect(button).toHaveAccessibleName('Cambiar tema (actual: Oscuro)')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('cenit-theme')).toBe('dark')
  })

  it('@s5(theme) avanzar el ciclo hasta "Sistema" borra la clave y sigue al SO (claro)', async () => {
    localStorage.setItem('cenit-theme', 'dark')
    fakeMatchMedia(false)
    render(<ThemeToggle />) // arranca en "Oscuro"

    await userEvent.click(screen.getByRole('button')) // Oscuro → Sistema
    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Sistema)')
    expect(localStorage.getItem('cenit-theme')).toBeNull()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('@s7(theme) refleja la preferencia "dark" guardada tras recargar', () => {
    localStorage.setItem('cenit-theme', 'dark')
    fakeMatchMedia(false)
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveAccessibleName('Cambiar tema (actual: Oscuro)')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('@s6(theme) en modo Sistema reacciona en vivo al cambio del SO sin recargar', () => {
    const media = fakeMatchMedia(false)
    render(<ThemeToggle />) // Sistema, SO=claro
    expect(document.documentElement.dataset.theme).toBe('light')

    act(() => {
      media.setDark(true)
      media.emitChange()
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('@s6(theme) fuera de "Sistema" NO reacciona al SO y limpia el listener', async () => {
    const media = fakeMatchMedia(false)
    render(<ThemeToggle />) // Sistema
    await userEvent.click(screen.getByRole('button')) // Sistema → Claro
    expect(media.activeListeners()).toBe(0)

    act(() => {
      media.setDark(true)
      media.emitChange()
    })
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
