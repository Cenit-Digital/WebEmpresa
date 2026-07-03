import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, getStoredMode, resolveTheme, systemPrefersDark } from './theme'

type Listener = () => void

/**
 * `matchMedia` falso y controlable para `prefers-color-scheme`. `matches` solo
 * vale `dark` cuando la query recibida es exactamente el literal
 * `'(prefers-color-scheme: dark)'` (no un símbolo importado), evitando la
 * tautología: si producción muta el literal, la query deja de coincidir, el
 * fake devuelve `false` y el mutante muere.
 */
function fakePrefersDark(dark: boolean) {
  let current = dark
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

describe('resolveTheme', () => {
  it('@s1 en modo "system" con el SO en oscuro resuelve a "dark"', () => {
    expect(resolveTheme('system', true)).toBe('dark')
  })

  it('@s2 en modo "system" con el SO en claro resuelve a "light"', () => {
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('@s3 en modo "light" resuelve a "light" ignorando la preferencia del SO', () => {
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('@s4 en modo "dark" resuelve a "dark" ignorando la preferencia del SO', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('getStoredMode', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('@s1 sin la clave "cenit-theme" devuelve "system"', () => {
    expect(getStoredMode()).toBe('system')
  })

  it('@s7 con la clave "dark" guardada devuelve "dark"', () => {
    localStorage.setItem('cenit-theme', 'dark')
    expect(getStoredMode()).toBe('dark')
  })

  it('@s3 con la clave "light" guardada devuelve "light"', () => {
    localStorage.setItem('cenit-theme', 'light')
    expect(getStoredMode()).toBe('light')
  })

  it('@s5 con un valor no válido en la clave devuelve "system"', () => {
    localStorage.setItem('cenit-theme', 'nope')
    expect(getStoredMode()).toBe('system')
  })
})

describe('applyTheme', () => {
  it('@s1 escribe el tema "dark" en data-theme de <html>', () => {
    document.documentElement.removeAttribute('data-theme')
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('@s2 escribe el tema "light" en data-theme de <html>', () => {
    document.documentElement.removeAttribute('data-theme')
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})

describe('systemPrefersDark', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('@s1 es true cuando el SO prefiere esquema oscuro', () => {
    fakePrefersDark(true)
    expect(systemPrefersDark()).toBe(true)
  })

  it('@s2 es false cuando el SO prefiere esquema claro', () => {
    fakePrefersDark(false)
    expect(systemPrefersDark()).toBe(false)
  })
})
