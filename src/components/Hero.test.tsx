import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('@s7 el arco decorativo es el primer hijo del hero, aria-hidden y no enfocable', () => {
    const { container } = render(<Hero />)

    const hero = container.querySelector('section')
    const arc = hero?.firstElementChild
    expect(arc).toHaveAttribute('data-hero-arc')
    expect(arc).toHaveAttribute('aria-hidden', 'true')
    // Un <div> no es enfocable por defecto (tabIndex -1); el arco no entra en el orden de tabulación.
    expect((arc as HTMLElement).tabIndex).toBe(-1)
  })

  it('@s8 el SVG del arco contiene círculo de contorno, onda (path) y punto (círculo)', () => {
    const { container } = render(<Hero />)

    const arc = container.querySelector('[data-hero-arc]')
    const svg = arc?.querySelector('svg')
    expect(svg).not.toBeNull()
    // Actualizado por #14: el punto se desdobla en contorno + relleno para el
    // trazo animado, así que el arco tiene 3 <circle> (anillo + contorno + relleno).
    expect(svg?.querySelectorAll('circle')).toHaveLength(3)
    expect(svg?.querySelectorAll('path')).toHaveLength(1)
    // El color sale del token de acento, no de un hex fijo.
    expect(svg?.querySelector('path')).toHaveAttribute('stroke', 'var(--color-accent)')
  })

  it('@s9 el ".hero" recorta el arco con overflow:hidden (evita scroll horizontal)', () => {
    // jsdom no hace layout: verificamos la propiedad sobre el .module.scss (patrón sticky).
    const scss = readFileSync(resolve(process.cwd(), 'src/components/Hero.module.scss'), 'utf8')
    // El overflow:hidden debe vivir DENTRO de la regla del .hero, no en otra cualquiera.
    expect(scss).toMatch(/\.hero\s*\{[^}]*overflow:\s*hidden[^}]*\}/)
  })
  it('@s1 muestra el eyebrow de contexto', () => {
    render(<Hero />)

    expect(screen.getByText('Soluciones digitales para pymes')).toBeInTheDocument()
  })

  it('@s2 muestra el titular principal como H1 con el texto exacto', () => {
    render(<Hero />)

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toBe('Llevamos tu negocio al punto más alto de su presencia digital.')
  })

  it('@s3 muestra el subtítulo con la propuesta de valor', () => {
    render(<Hero />)

    expect(screen.getByText(/todo bajo una cuota mensual, sin entrada/)).toBeInTheDocument()
  })

  it('@s4 el CTA primario apunta a #paquetes', () => {
    render(<Hero />)

    const cta = screen.getByRole('link', { name: 'Ver paquetes' })
    expect(cta).toHaveAttribute('href', '#paquetes')
  })

  it('@s5 el CTA secundario apunta a #contacto', () => {
    render(<Hero />)

    const cta = screen.getByRole('link', { name: 'Hablar con nosotros' })
    expect(cta).toHaveAttribute('href', '#contacto')
  })

  it('@s6 muestra las cuatro parejas valor/etiqueta', () => {
    render(<Hero />)

    const pairs: Array<[string, string]> = [
      ['24h', 'tiempo de respuesta'],
      ['+30', 'pymes confían'],
      ['100%', 'diseño a medida'],
      ['5★', 'valoración media'],
    ]

    for (const [value, label] of pairs) {
      const valueNode = screen.getByText(value)
      const labelNode = screen.getByText(label)
      // El valor y su etiqueta viven en la misma tarjeta de estadística.
      expect(valueNode.parentElement).toBe(labelNode.parentElement)
    }
  })
})

// Feature #14 · el arco decorativo del hero va SIEMPRE animado (sin prop): lleva
// los mismos hooks de dibujo que el Logo, en un único color --color-accent.
describe('Hero — arco animado (#14)', () => {
  it('@s6 el arco del hero está siempre animado y conserva su accesibilidad', () => {
    const { container } = render(<Hero />)

    const arc = container.querySelector('[data-hero-arc]')
    expect(arc).not.toBeNull()
    expect(arc).toHaveAttribute('aria-hidden', 'true')
    // Un <div> no es enfocable por defecto (tabIndex -1): fuera del orden de tabulación.
    expect((arc as HTMLElement).tabIndex).toBe(-1)

    const svg = arc?.querySelector('svg')
    expect(svg?.querySelector('circle[data-orbit-ring]')).not.toBeNull()
    expect(svg?.querySelector('path[data-orbit-wave]')).not.toBeNull()
    expect(svg?.querySelector('circle[data-orbit-dot-outline]')).not.toBeNull()
    expect(svg?.querySelector('circle[data-orbit-dot-fill]')).not.toBeNull()
  })

  it('@s7 el arco del hero usa un único color --color-accent, sin gradiente', () => {
    const { container } = render(<Hero />)
    const svg = container.querySelector('[data-hero-arc] svg')

    expect(svg?.querySelector('[data-orbit-ring]')).toHaveAttribute('stroke', 'var(--color-accent)')
    expect(svg?.querySelector('[data-orbit-wave]')).toHaveAttribute('stroke', 'var(--color-accent)')
    expect(svg?.querySelector('[data-orbit-dot-outline]')).toHaveAttribute(
      'stroke',
      'var(--color-accent)',
    )
    expect(svg?.querySelector('[data-orbit-dot-fill]')).toHaveAttribute(
      'fill',
      'var(--color-accent)',
    )

    // Color único: nada de <linearGradient> dentro del arco (a diferencia del nav).
    expect(svg?.querySelector('linearGradient')).toBeNull()
  })
})
