import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
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
