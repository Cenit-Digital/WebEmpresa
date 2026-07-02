import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getServerSnapshot, getSnapshot, subscribe, useIsMobile } from './useIsMobile'

type Listener = () => void

/**
 * `matchMedia` falso y controlable. `matches` solo vale `mobile` cuando la
 * query recibida coincide con el breakpoint móvil **codificado a mano**
 * (`'(max-width: 767px)'`), no con el símbolo `MOBILE_QUERY` importado. Así
 * evitamos la tautología: si producción muta la constante (p. ej. a `""`),
 * `window.matchMedia("")` no coincide con el literal, el fake devuelve `false`
 * y los tests de "móvil" fallan → el mutante muere.
 */
function fakeMatchMedia(mobile: boolean) {
  let current = mobile
  const listeners = new Set<Listener>()
  window.matchMedia = ((query: string) => ({
    matches: query === '(max-width: 767px)' ? current : false,
    media: query,
    addEventListener: (type: string, cb: Listener) => {
      if (type === 'change') listeners.add(cb)
    },
    removeEventListener: (type: string, cb: Listener) => {
      if (type === 'change') listeners.delete(cb)
    },
  })) as unknown as typeof window.matchMedia
  return {
    setMobile: (value: boolean) => {
      current = value
    },
    emitChange: () => listeners.forEach((cb) => cb()),
    activeListeners: () => listeners.size,
  }
}

function Probe() {
  return <span>{useIsMobile() ? 'movil' : 'escritorio'}</span>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsMobile', () => {
  it('@s9 getServerSnapshot es false (escritorio por defecto en SSR)', () => {
    expect(getServerSnapshot()).toBe(false)
  })

  it('@s5 getSnapshot devuelve matches de la MOBILE_QUERY (true en móvil)', () => {
    fakeMatchMedia(true)
    expect(getSnapshot()).toBe(true)
  })

  it('@s9 getSnapshot devuelve false fuera de la MOBILE_QUERY (escritorio)', () => {
    fakeMatchMedia(false)
    expect(getSnapshot()).toBe(false)
  })

  it('@s5 subscribe avisa en "change" y la baja deja de avisar', () => {
    const media = fakeMatchMedia(false)
    const onChange = vi.fn()

    const unsubscribe = subscribe(onChange)
    expect(media.activeListeners()).toBe(1)
    media.emitChange()
    expect(onChange).toHaveBeenCalledTimes(1)

    unsubscribe()
    expect(media.activeListeners()).toBe(0)
    media.emitChange()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('@s5 useIsMobile es true en viewport móvil', () => {
    fakeMatchMedia(true)
    render(<Probe />)
    expect(screen.getByText('movil')).toBeInTheDocument()
  })

  it('@s9 useIsMobile es false en escritorio y reacciona al cambio de viewport', () => {
    const media = fakeMatchMedia(false)
    render(<Probe />)
    expect(screen.getByText('escritorio')).toBeInTheDocument()

    act(() => {
      media.setMobile(true)
      media.emitChange()
    })
    expect(screen.getByText('movil')).toBeInTheDocument()
  })
})
