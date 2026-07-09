import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Servicios from './Servicios'

// Feature #15 · servicios_scroll_reveal — contenido del SCSS module de la
// animación de revelado. jsdom no interpola `transition` ni conoce el layout,
// así que el contrato testeable del CSS es su CONTENIDO: se lee el .scss y se
// aseveran las reglas (mismo idioma que `logo-draw.test.ts`).
function read(relPath: string): string {
  return readFileSync(resolve(process.cwd(), relPath), 'utf8')
}

const SCSS = 'src/components/Servicios.module.scss'

/**
 * Devuelve el cuerpo (entre llaves balanceadas) del primer bloque cuyo
 * encabezado casa `headerRe`. Aísla el contenido de un `@media { … }` anidado.
 */
function block(scss: string, headerRe: RegExp): string {
  const start = scss.search(headerRe)
  if (start === -1) throw new Error(`Bloque no encontrado: ${headerRe}`)
  const open = scss.indexOf('{', start)
  let depth = 0
  for (let i = open; i < scss.length; i += 1) {
    if (scss[i] === '{') depth += 1
    else if (scss[i] === '}') {
      depth -= 1
      if (depth === 0) return scss.slice(open + 1, i)
    }
  }
  throw new Error(`Llave sin cerrar tras ${headerRe}`)
}

const NO_PREFERENCE = /@media \(prefers-reduced-motion: no-preference\)\s*\{/

type IOEntry = { target: Element; isIntersecting: boolean }

/**
 * IntersectionObserver falso y controlable (mismo idioma que el fake de
 * `useReveal.test.tsx`): registra los elementos observados y permite EMITIR
 * intersecciones para comprobar el cableado real de `Servicios`.
 */
function fakeIntersectionObserver() {
  const instances: FakeIO[] = []

  class FakeIO {
    readonly observed = new Set<Element>()
    constructor(readonly callback: IntersectionObserverCallback) {
      instances.push(this)
    }
    observe(el: Element) {
      this.observed.add(el)
    }
    disconnect() {
      this.observed.clear()
    }
    emit(entries: IOEntry[]) {
      this.callback(
        entries.map((e) => e as unknown as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      )
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeIO)
  return { last: () => instances[instances.length - 1] }
}

const TITLES = [
  'Desarrollo web',
  'Chatbot WhatsApp',
  'Gestión de RRSS',
  'SEO local',
  'Sistema de citas',
  'Conexión ERP',
]

const TAGS = ['Presencia', 'IA', 'Marketing', 'Visibilidad', 'Operativa', 'Integración']

const EXAMPLES = [
  'Tienda online con reservas para una clínica veterinaria, lista en 3 semanas.',
  'El bot responde y agenda solo; deriva a una persona cuando hace falta.',
  'Calendario de contenidos + informe mensual de alcance e interacción.',
  'Apareces en el top del mapa cuando buscan tu servicio cerca.',
  'Menos llamadas y cero huecos: el cliente reserva 24/7 desde el móvil.',
  'Tu web habla con tu ERP: presupuesto y stock sin teclear nada.',
]

afterEach(() => {
  vi.unstubAllGlobals()
})

/**
 * Elimina TODOS los bloques `@media (prefers-reduced-motion: no-preference)…`
 * (el simple y el `and (max-width: 880px)`) para quedarnos con el CSS BASE: el
 * que aplica sin JS, en el prerender SSG y con `prefers-reduced-motion: reduce`.
 */
function stripNoPreference(scss: string): string {
  let out = scss
  for (;;) {
    const start = out.search(/@media \(prefers-reduced-motion: no-preference\)/)
    if (start === -1) return out
    const open = out.indexOf('{', start)
    let depth = 0
    let end = out.length
    for (let i = open; i < out.length; i += 1) {
      if (out[i] === '{') depth += 1
      else if (out[i] === '}') {
        depth -= 1
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    out = out.slice(0, start) + out.slice(end + 1)
  }
}

describe('Servicios.module.scss — #15 (contenido de la animación de revelado)', () => {
  it('@s7 R1: el estado base es el final visible (el oculto no se hornea en base)', () => {
    const base = stripNoPreference(read(SCSS))

    // Ni opacidad 0 ni transforms de desplazamiento horneados fuera del gateado.
    expect(base).not.toMatch(/opacity:\s*0\s*;/)
    expect(base).not.toMatch(/translateX\(/)
    expect(base).not.toMatch(/translateY\(/)
  })

  it('@s8 el estado oculto vive bajo data-reveal + :not([data-in-view]) dentro de no-preference', () => {
    const gated = block(read(SCSS), NO_PREFERENCE)

    for (const piece of ['card', 'mockup', 'example']) {
      expect(gated).toMatch(
        new RegExp(
          `\\[data-reveal\\]\\s+\\.row:not\\(\\[data-in-view\\]\\)\\s+\\.${piece}\\s*\\{[^}]*opacity:\\s*0\\s*;`,
        ),
      )
      expect(gated).toMatch(
        new RegExp(
          `\\[data-reveal\\]\\s+\\.row:not\\(\\[data-in-view\\]\\)\\s+\\.${piece}\\s*\\{[^}]*transform:\\s*translate`,
        ),
      )
    }
  })

  it('@s9 solo se animan opacity y transform (sin propiedades de reflow)', () => {
    const gated = block(read(SCSS), NO_PREFERENCE)
    const transitions = [...gated.matchAll(/transition:\s*([^;]+);/g)].map((m) => m[1])

    expect(transitions.length).toBeGreaterThan(0)
    for (const value of transitions) {
      // Los easings llevan comas/números propios: se descartan antes de mirar props.
      const props = value.replace(/cubic-bezier\([^)]*\)/g, '')
      expect(props).toMatch(/\bopacity\b/)
      expect(props).toMatch(/\btransform\b/)
      expect(props).not.toMatch(/\b(top|left|right|bottom|margin|width|height|padding)\b/)
    }
  })

  it('@s10 stagger + timing: duración 2.8s y delays escalonados 0s/0.4s/0.8s', () => {
    const gated = block(read(SCSS), NO_PREFERENCE)
    const delayOf = (piece: string): number => {
      const m = gated.match(
        new RegExp(`\\.row\\s+\\.${piece}\\s*\\{[^}]*transition-delay:\\s*([\\d.]+)s`),
      )
      if (!m) throw new Error(`transition-delay de ${piece} no encontrado`)
      return Number(m[1])
    }

    // Duración pineada: 2.8s para opacity y transform, y ya no la vieja 1.2s.
    const transitionMatch = gated.match(/transition:\s*([^;]+);/)
    if (!transitionMatch) throw new Error('transition de las piezas no encontrada')
    const transition = transitionMatch[1]
    expect(transition).toMatch(/opacity\s+2\.8s/)
    expect(transition).toMatch(/transform\s+2\.8s/)
    expect(transition).not.toMatch(/1\.2s/)

    // Stagger pineado: card 0s -> mockup 0.4s -> example 0.8s.
    expect(delayOf('card')).toBe(0)
    expect(delayOf('mockup')).toBe(0.4)
    expect(delayOf('example')).toBe(0.8)

    // Y el escalonado crece en el orden .card -> mockup -> .example.
    expect(delayOf('card')).toBeLessThan(delayOf('mockup'))
    expect(delayOf('mockup')).toBeLessThan(delayOf('example'))
  })

  it('@s11 la inversión horizontal cuelga de :nth-child(even), sin data-dir ni JS', () => {
    const scss = read(SCSS)
    const gated = block(scss, NO_PREFERENCE)

    for (const piece of ['card', 'mockup']) {
      expect(gated).toMatch(
        new RegExp(
          `\\.row:nth-child\\(even\\):not\\(\\[data-in-view\\]\\)\\s+\\.${piece}\\s*\\{[^}]*translateX\\(`,
        ),
      )
    }
    // Nada de dirección calculada en JS: ni en el SCSS ni en el componente.
    expect(scss).not.toMatch(/data-dir/)
    expect(read('src/components/Servicios.tsx')).not.toMatch(/data-dir/)
  })

  it('@s12 prefers-reduced-motion: reduce no oculta ni anima (todo cuelga de no-preference)', () => {
    const scss = read(SCSS)

    // El oculto y las transiciones solo existen bajo no-preference: con reduce
    // no hay bloque que apagar ni transición que revertir (contenido visible).
    expect(scss).not.toMatch(/prefers-reduced-motion:\s*reduce/)
    expect(stripNoPreference(scss)).not.toMatch(/transition:/)
  })

  it('@s13 .services usa overflow-x: clip y el breakpoint móvil desplaza en vertical', () => {
    const scss = read(SCSS)

    // Blindaje del 0-scroll-horizontal ante transforms transitorias.
    expect(block(scss, /\.services\s*\{/)).toMatch(/overflow-x:\s*clip/)

    // En móvil (1 columna) no hay izquierda/derecha: todo sube (translateY),
    // sin translateX amplio que provoque scroll lateral.
    const mobile = block(
      scss,
      /@media \(prefers-reduced-motion: no-preference\) and \(max-width: 880px\)\s*\{/,
    )
    expect(mobile).toMatch(/translateY\(/)
    expect(mobile).not.toMatch(/translateX\(/)
  })

  it('@s14 contenido intacto + cableado del reveal (ref, 6 filas observadas, wrapper mockup)', () => {
    const io = fakeIntersectionObserver()
    const { container } = render(<Servicios />)

    // (1) Contenido intacto: los 6 servicios (título, etiqueta y ejemplo) siguen.
    for (const title of TITLES) expect(screen.getByText(title)).toBeInTheDocument()
    for (const tag of TAGS) expect(screen.getByText(tag)).toBeInTheDocument()
    for (const example of EXAMPLES) expect(screen.getByText(example)).toBeInTheDocument()

    // (2) El contenedor .rows gana data-reveal: prueba que ref={rows} está cableado.
    const rows = container.querySelector('[class*="rows"]')
    expect(rows).not.toBeNull()
    expect(rows?.hasAttribute('data-reveal')).toBe(true)

    // (3) Se observaron las 6 filas.
    expect(io.last().observed.size).toBe(6)

    // (4) El mockup está envuelto en un elemento con clase que casa /mockup/.
    const mockupWrapper = container.querySelector('[class*="mockup"]')
    expect(mockupWrapper).not.toBeNull()
    expect(mockupWrapper?.querySelector('[aria-hidden="true"]')).not.toBeNull()

    // (5) Emitir intersección en una fila -> gana data-in-view.
    const firstRow = rows?.children[0] as Element
    io.last().emit([{ target: firstRow, isIntersecting: true }])
    expect(firstRow.hasAttribute('data-in-view')).toBe(true)
  })
})
