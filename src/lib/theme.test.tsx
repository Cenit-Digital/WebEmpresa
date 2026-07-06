import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyInitialTheme,
  applyTheme,
  getStoredMode,
  initialThemeAttribute,
  resolveTheme,
  setMode,
  systemPrefersDark,
} from './theme'

type Listener = () => void

/**
 * `matchMedia` falso keyeado al literal `'(prefers-color-scheme: dark)'` (no a un
 * símbolo importado) para evitar tautologías: si producción muta la query, el
 * fake devuelve `false` y el test muere. `emitChange` dispara los listeners.
 */
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
  vi.restoreAllMocks()
})

describe('theme', () => {
  describe('systemPrefersDark', () => {
    it('true cuando el sistema prefiere oscuro', () => {
      fakeMatchMedia(true)
      expect(systemPrefersDark()).toBe(true)
    })

    it('false cuando el sistema prefiere claro', () => {
      fakeMatchMedia(false)
      expect(systemPrefersDark()).toBe(false)
    })
  })

  describe('applyTheme', () => {
    it('escribe "dark" en data-theme', () => {
      applyTheme('dark')
      expect(document.documentElement.dataset.theme).toBe('dark')
    })

    it('escribe "light" en data-theme', () => {
      applyTheme('light')
      expect(document.documentElement.dataset.theme).toBe('light')
    })
  })

  describe('getStoredMode', () => {
    it('"light" persistido -> "light"', () => {
      localStorage.setItem('cenit-theme', 'light')
      expect(getStoredMode()).toBe('light')
    })

    it('"dark" persistido -> "dark"', () => {
      localStorage.setItem('cenit-theme', 'dark')
      expect(getStoredMode()).toBe('dark')
    })

    it('sin clave -> "system"', () => {
      expect(getStoredMode()).toBe('system')
    })

    it('valor inválido -> "system" (valor distinto de "system" para evitar tautología)', () => {
      localStorage.setItem('cenit-theme', 'auto')
      expect(getStoredMode()).toBe('system')
    })

    it('si localStorage lanza -> "system"', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('bloqueado')
      })
      expect(getStoredMode()).toBe('system')
    })
  })

  describe('resolveTheme', () => {
    it('"light" -> "light" (ignora prefers)', () => {
      expect(resolveTheme('light', true)).toBe('light')
    })

    it('"dark" -> "dark" (ignora prefers)', () => {
      expect(resolveTheme('dark', false)).toBe('dark')
    })

    it('"system" + prefers dark -> "dark"', () => {
      expect(resolveTheme('system', true)).toBe('dark')
    })

    it('"system" + prefers claro -> "light"', () => {
      expect(resolveTheme('system', false)).toBe('light')
    })
  })

  describe('applyInitialTheme', () => {
    it('@s1 sin clave y sistema oscuro -> data-theme "dark"', () => {
      fakeMatchMedia(true)
      applyInitialTheme()
      expect(document.documentElement.dataset.theme).toBe('dark')
    })

    it('@s2 sin clave y sistema claro -> data-theme "light"', () => {
      fakeMatchMedia(false)
      applyInitialTheme()
      expect(document.documentElement.dataset.theme).toBe('light')
    })

    it('@s7 preferencia "dark" guardada -> data-theme "dark" (sobrevive recarga)', () => {
      localStorage.setItem('cenit-theme', 'dark')
      fakeMatchMedia(false)
      applyInitialTheme()
      expect(document.documentElement.dataset.theme).toBe('dark')
    })
  })

  describe('setMode', () => {
    it('@s3 "light": persiste "light" y aplica data-theme "light"', () => {
      fakeMatchMedia(true)
      setMode('light')
      expect(localStorage.getItem('cenit-theme')).toBe('light')
      expect(document.documentElement.dataset.theme).toBe('light')
    })

    it('@s4 "dark": persiste "dark" y aplica data-theme "dark"', () => {
      fakeMatchMedia(false)
      setMode('dark')
      expect(localStorage.getItem('cenit-theme')).toBe('dark')
      expect(document.documentElement.dataset.theme).toBe('dark')
    })

    it('@s5 "system": borra la clave y aplica el tema del sistema (claro)', () => {
      localStorage.setItem('cenit-theme', 'dark')
      fakeMatchMedia(false)
      setMode('system')
      expect(localStorage.getItem('cenit-theme')).toBeNull()
      expect(document.documentElement.dataset.theme).toBe('light')
    })

    it('@s5 "system": sin clave aplica el tema del sistema (oscuro)', () => {
      localStorage.setItem('cenit-theme', 'light')
      fakeMatchMedia(true)
      setMode('system')
      expect(localStorage.getItem('cenit-theme')).toBeNull()
      expect(document.documentElement.dataset.theme).toBe('dark')
    })

    it('si localStorage lanza al escribir, aun así aplica el tema', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('bloqueado')
      })
      fakeMatchMedia(false)
      setMode('dark')
      expect(document.documentElement.dataset.theme).toBe('dark')
    })
  })

  describe('initialThemeAttribute (@s8 anti-FOUC, réplica pura del script inline)', () => {
    it('"dark" guardado -> "dark"', () => {
      expect(initialThemeAttribute('dark', false)).toBe('dark')
    })

    it('"light" guardado -> "light"', () => {
      expect(initialThemeAttribute('light', true)).toBe('light')
    })

    it('sin clave + sistema oscuro -> "dark"', () => {
      expect(initialThemeAttribute(null, true)).toBe('dark')
    })

    it('sin clave + sistema claro -> "light"', () => {
      expect(initialThemeAttribute(null, false)).toBe('light')
    })

    it('valor inválido + sistema oscuro -> "dark" (nunca escribe basura)', () => {
      expect(initialThemeAttribute('system', true)).toBe('dark')
    })

    it('el script inline del index.html fija data-theme antes del <script type="module">', () => {
      const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
      const inlineIdx = html.indexOf('documentElement.dataset.theme')
      const moduleIdx = html.indexOf('type="module"')
      expect(inlineIdx).toBeGreaterThan(-1)
      expect(moduleIdx).toBeGreaterThan(-1)
      expect(inlineIdx).toBeLessThan(moduleIdx)
    })
  })
})
