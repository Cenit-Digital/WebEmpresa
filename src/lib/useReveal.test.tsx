import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { REVEAL_ROOT_MARGIN, useReveal } from './useReveal'

type IOEntry = { target: Element; isIntersecting: boolean }

/**
 * IntersectionObserver falso y controlable, al estilo del `fakeMatchMedia` de
 * `useIsMobile.test.tsx`. Captura las `options` (rootMargin/threshold), los
 * elementos observados y el callback; permite EMITIR entradas como haría el
 * navegador al cruzar la banda; y cuenta `disconnect()`. NO depende de
 * constantes de producción (evita tautologías): los tests comparan el
 * `rootMargin` recibido contra el símbolo `REVEAL_ROOT_MARGIN` importado, de
 * modo que mutarlo en producción rompe el test y mata al mutante.
 */
function fakeIntersectionObserver() {
  const instances: FakeIO[] = []

  class FakeIO {
    readonly observed = new Set<Element>()
    disconnectCount = 0
    constructor(
      readonly callback: IntersectionObserverCallback,
      readonly options?: IntersectionObserverInit,
    ) {
      instances.push(this)
    }
    observe(el: Element) {
      this.observed.add(el)
    }
    disconnect() {
      this.disconnectCount += 1
      this.observed.clear()
    }
    /** Invoca el callback con entradas mínimas (solo target + isIntersecting). */
    emit(entries: IOEntry[]) {
      this.callback(
        entries.map((e) => e as unknown as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      )
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeIO)
  return {
    last: () => instances[instances.length - 1],
    instances: () => instances,
  }
}

/**
 * Contenedor de prueba: monta N hijos y les cablea el `ref` del hook, como
 * `.rows` cablea a `useReveal` en Servicios. `data-testid` en el contenedor y
 * en cada hijo para poder aseverar sus atributos.
 */
function Probe({ count = 3 }: { count?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="container">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} data-testid="child" />
      ))}
    </div>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useReveal', () => {
  it('@s1 sin IntersectionObserver no arma nada y el contenido queda visible', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    const { getByTestId, getAllByTestId } = render(<Probe count={3} />)

    expect(getByTestId('container').hasAttribute('data-reveal')).toBe(false)
    for (const child of getAllByTestId('child')) {
      expect(child.hasAttribute('data-in-view')).toBe(false)
    }
  })

  it('@s2 arma el contenedor con data-reveal (atributo de presencia) tras el montaje', () => {
    fakeIntersectionObserver()

    const { getByTestId } = render(<Probe count={3} />)

    const container = getByTestId('container')
    expect(container.hasAttribute('data-reveal')).toBe(true)
    // Atributo booleano/de presencia: valor vacío (así lo consume `[data-reveal]`).
    expect(container.getAttribute('data-reveal')).toBe('')
  })

  it('@s3 observa cada hija con la banda central (rootMargin + threshold 0)', () => {
    const io = fakeIntersectionObserver()

    render(<Probe count={4} />)

    const observer = io.last()
    expect(observer.observed.size).toBe(4)
    expect(observer.options?.rootMargin).toBe(REVEAL_ROOT_MARGIN)
    expect(observer.options?.threshold).toBe(0)
    // Valor literal exacto: mutar la constante rompe este assert (mata el mutante).
    expect(REVEAL_ROOT_MARGIN).toBe('-40% 0px -40% 0px')
  })

  it('@s4 conmuta data-in-view al entrar en la banda central', () => {
    const io = fakeIntersectionObserver()
    const { getAllByTestId } = render(<Probe count={3} />)
    const [first] = getAllByTestId('child')

    io.last().emit([{ target: first, isIntersecting: true }])

    expect(first.hasAttribute('data-in-view')).toBe(true)
  })

  it('@s5 bidireccional: pierde data-in-view al salir y lo recupera al re-entrar', () => {
    const io = fakeIntersectionObserver()
    const { getAllByTestId } = render(<Probe count={3} />)
    const [first] = getAllByTestId('child')
    const observer = io.last()

    observer.emit([{ target: first, isIntersecting: true }])
    expect(first.hasAttribute('data-in-view')).toBe(true)

    observer.emit([{ target: first, isIntersecting: false }])
    expect(first.hasAttribute('data-in-view')).toBe(false)

    observer.emit([{ target: first, isIntersecting: true }])
    expect(first.hasAttribute('data-in-view')).toBe(true)
  })

  it('@s6 desconecta el observer al desmontar y no deja observaciones vivas', () => {
    const io = fakeIntersectionObserver()
    const { unmount } = render(<Probe count={3} />)
    const observer = io.last()
    expect(observer.disconnectCount).toBe(0)

    unmount()

    expect(observer.disconnectCount).toBe(1)
    expect(observer.observed.size).toBe(0)
  })
})
