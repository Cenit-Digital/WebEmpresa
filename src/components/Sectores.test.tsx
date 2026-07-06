import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Sectores from './Sectores'

const NAMES = ['Veterinarias', 'Servicios de estética', 'Clínicas dentales', 'Fisioterapeutas']

const DESCRIPTIONS = [
  'Webs y reservas para clínicas veterinarias: fichas de servicios, citas online y recordatorios para que ningún paciente se quede sin revisión.',
  'Presencia digital para centros de estética y belleza: catálogo de tratamientos, reservas online y campañas que llenan la agenda.',
  'Captación de pacientes para clínicas dentales: SEO local, reseñas y un sistema de citas que reduce las ausencias de última hora.',
  'Webs para fisioterapeutas y osteópatas: explica tus terapias, posiciónate en tu zona y deja que tus pacientes reserven solos.',
]

const NOTE = 'Selección inicial — abierta a debate según el plan comercial.'

describe('Sectores', () => {
  it('muestra la cabecera de sección (eyebrow, H2 e intro)', () => {
    render(<Sectores />)

    expect(screen.getByText('A quién ayudamos')).toBeInTheDocument()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toBe('Sectores con los que trabajamos')
    expect(
      screen.getByText(
        'Nos especializamos en pocos sectores para conocerlos a fondo. Hablamos el idioma de tu negocio y sabemos qué necesita tu cliente.',
      ),
    ).toBeInTheDocument()
  })

  it('la sección expone id="sectores" como destino del nav', () => {
    const { container } = render(<Sectores />)

    expect(container.querySelector('section#sectores')).not.toBeNull()
  })

  it('@s1 muestra los cuatro nombres en orden exacto', () => {
    render(<Sectores />)

    const names = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names).toEqual(NAMES)
  })

  it('@s2 cada tarjeta muestra un párrafo de descripción no vacío', () => {
    render(<Sectores />)

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(NAMES.length)
    for (const card of cards) {
      const paragraph = within(card).getByText((_, node) => node?.tagName === 'P')
      expect(paragraph.textContent?.trim().length ?? 0).toBeGreaterThan(0)
    }
  })

  it('muestra la descripción exacta de cada sector', () => {
    render(<Sectores />)

    for (const description of DESCRIPTIONS) {
      expect(screen.getByText(description)).toBeInTheDocument()
    }
  })

  it('@s3 muestra la nota de selección inicial bajo la rejilla', () => {
    render(<Sectores />)

    expect(screen.getByText(NOTE)).toBeInTheDocument()
  })
})
