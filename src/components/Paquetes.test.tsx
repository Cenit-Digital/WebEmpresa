import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Paquetes from './Paquetes'

const NAMES = ['Presencia Digital', 'Presencia Activa', 'Negocio Conectado']

const TAGLINES = [
  'Lo esencial para existir online y que te encuentren.',
  'Presencia + marketing para crecer cada mes.',
  'Automatiza la operativa de punta a punta.',
]

const FEATURES = [
  'Web hasta 6 páginas',
  'Dominio .es incluido',
  'Hosting y SSL',
  'SEO básico on-page',
  'Ficha Google Business',
  'Todo Presencia Digital',
  'RRSS (2 redes, semanal)',
  'Email marketing mensual',
  'Gestión de reputación',
  'SEO local avanzado',
  'Todo Presencia Activa',
  'Chatbot WhatsApp IA',
  'Sistema de citas online',
  'Dashboard de métricas',
  'Automatización de procesos',
]

describe('Paquetes', () => {
  it('muestra la cabecera de sección (eyebrow, H2 e intro)', () => {
    render(<Paquetes />)

    expect(screen.getByText('Paquetes')).toBeInTheDocument()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toBe('Elige tu paquete')
    expect(
      screen.getByText(
        'Tres niveles según lo que necesite tu negocio. Te preparamos un presupuesto a medida, sin entrada y sin sorpresas.',
      ),
    ).toBeInTheDocument()
  })

  it('la sección expone id="paquetes" como destino del nav', () => {
    const { container } = render(<Paquetes />)

    expect(container.querySelector('section#paquetes')).not.toBeNull()
  })

  it('@s1 muestra los tres paquetes en orden exacto', () => {
    render(<Paquetes />)

    const names = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names).toEqual(NAMES)
  })

  it('@s2 la insignia "Más elegido" aparece una vez y es de "Presencia Activa"', () => {
    render(<Paquetes />)

    const badges = screen.getAllByText('Más elegido')
    expect(badges).toHaveLength(1)

    // La insignia pertenece a la tarjeta cuyo H3 es "Presencia Activa".
    const card = badges[0].closest('article')
    expect(card).not.toBeNull()
    expect(within(card as HTMLElement).getByRole('heading', { level: 3 }).textContent).toBe(
      'Presencia Activa',
    )
  })

  it('@s3 cada tarjeta tiene su tagline y una lista de características no vacía', () => {
    render(<Paquetes />)

    const cards = screen.getAllByRole('heading', { level: 3 }).map((h) => h.closest('article'))
    expect(cards).toHaveLength(3)

    cards.forEach((card, index) => {
      const scope = within(card as HTMLElement)
      // Tagline exacto de esta tarjeta.
      expect(scope.getByText(TAGLINES[index])).toBeInTheDocument()
      // Lista de características no vacía.
      const items = scope.getAllByRole('listitem')
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) {
        expect(item.querySelector('svg')).not.toBeNull()
      }
    })
  })

  it('@s3 muestra el texto exacto de las quince características', () => {
    render(<Paquetes />)

    for (const feature of FEATURES) {
      expect(screen.getByText(feature)).toBeInTheDocument()
    }
  })

  it('@s4 cada tarjeta lleva un enlace "Solicitar presupuesto" a "#contacto"', () => {
    render(<Paquetes />)

    const ctas = screen.getAllByRole('link', { name: 'Solicitar presupuesto' })
    expect(ctas).toHaveLength(3)
    for (const cta of ctas) {
      expect(cta).toHaveAttribute('href', '#contacto')
    }
  })

  it('@s5 no aparece ningún símbolo de precio (€ ni /mes)', () => {
    const { container } = render(<Paquetes />)

    expect(container.textContent).not.toContain('€')
    expect(container.textContent).not.toContain('/mes')
  })
})
