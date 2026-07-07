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
    // Anillo de contorno + punto = dos <circle>; la onda es un <path>.
    expect(svg?.querySelectorAll('circle')).toHaveLength(2)
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
