import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Servicios from './Servicios'

const TITLES = [
  'Desarrollo web',
  'Chatbot WhatsApp',
  'Gestión de RRSS',
  'SEO local',
  'Sistema de citas',
  'Conexión ERP',
]

const TAGS = ['Presencia', 'IA', 'Marketing', 'Visibilidad', 'Operativa', 'Integración']

const FEATURES = [
  'Diseño 100% a medida y responsive',
  'Dominio, hosting y SSL incluidos',
  'Atiende y agenda 24/7',
  'Deriva a una persona cuando hace falta',
  'Calendario de contenidos mensual',
  'Informe de alcance e interacción',
  'Ficha de Google Business optimizada',
  'Informe mensual de posiciones',
  'Reservas online 24/7',
  'Recordatorios automáticos',
  'Integración con Holded, Odoo y más',
  'Stock y pedidos en tiempo real',
]

const EXAMPLES = [
  'Tienda online con reservas para una clínica veterinaria, lista en 3 semanas.',
  'El bot responde y agenda solo; deriva a una persona cuando hace falta.',
  'Calendario de contenidos + informe mensual de alcance e interacción.',
  'Apareces en el top del mapa cuando buscan tu servicio cerca.',
  'Menos llamadas y cero huecos: el cliente reserva 24/7 desde el móvil.',
  'Tu web habla con tu ERP: presupuesto y stock sin teclear nada.',
]

const DESCRIPTIONS = [
  'Webs rápidas, con SEO nativo y diseño profesional. Desde landing pages hasta tiendas y catálogos B2B, pensadas para convertir visitas en clientes. Con dominio y hosting incluidos.',
  'Asistente con IA que atiende a tus clientes 24/7, resuelve dudas, gestiona citas y captura leads mientras tú trabajas. Conectado a WhatsApp Business API.',
  'Contenido semanal, publicación y gestión de comentarios en 2 o 4 redes sociales. Creamos una línea visual coherente con tu marca y campañas de publicidad en el plan avanzado.',
  'Posicionamiento en Google Maps y búsquedas locales para que te encuentren justo cuando buscan tu servicio cerca. Ficha de Google Business optimizada e informe mensual de métricas.',
  'Reservas online, recordatorios automáticos por WhatsApp y gestión de agenda en un solo panel. Adiós a las llamadas perdidas y a los huecos sin cubrir en tu día a día.',
  'Conectamos tu web o chatbot con tu ERP (Holded, Odoo y más). Presupuestos automáticos, stock en tiempo real y pedidos que entran sin intervención manual.',
]

describe('Servicios', () => {
  it('muestra la cabecera de sección (eyebrow, H2 e intro)', () => {
    render(<Servicios />)

    expect(screen.getByText('Lo que hacemos')).toBeInTheDocument()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toBe('Servicios que transforman negocios locales')
    expect(
      screen.getByText(
        'No somos solo una agencia de diseño. Cada servicio se ve con su tarjeta, una referencia visual de cómo queda en uso, y una nota con un ejemplo real.',
      ),
    ).toBeInTheDocument()
  })

  it('la sección expone id="servicios" como destino del nav', () => {
    const { container } = render(<Servicios />)

    expect(container.querySelector('section#servicios')).not.toBeNull()
  })

  it('@s1 muestra los seis títulos en orden exacto', () => {
    render(<Servicios />)

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(TITLES)
  })

  it('@s2 muestra las seis etiquetas en orden exacto', () => {
    render(<Servicios />)

    // Cada etiqueta existe (mata mutantes de literal) y respeta el orden del DOM.
    const nodes = TAGS.map((tag) => screen.getByText(tag))
    for (let i = 1; i < nodes.length; i += 1) {
      const relation = nodes[i - 1].compareDocumentPosition(nodes[i])
      expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })

  it('@s3 cada tarjeta tiene exactamente dos características con check', () => {
    render(<Servicios />)

    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(6)
    for (const list of lists) {
      const items = within(list).getAllByRole('listitem')
      expect(items).toHaveLength(2)
      for (const item of items) {
        expect(item.querySelector('svg')).not.toBeNull()
      }
    }
  })

  it('@s3 muestra el texto exacto de las doce características', () => {
    render(<Servicios />)

    for (const feature of FEATURES) {
      expect(screen.getByText(feature)).toBeInTheDocument()
    }
  })

  it('@s4 cada tarjeta muestra un bloque "Ejemplo" con texto', () => {
    render(<Servicios />)

    expect(screen.getAllByText('Ejemplo')).toHaveLength(6)
    for (const example of EXAMPLES) {
      expect(screen.getByText(example)).toBeInTheDocument()
    }
  })

  it('@s5 el texto "Reservar" del mockup no es un control accesible', () => {
    render(<Servicios />)

    // El rótulo existe como decoración dentro del mockup...
    expect(screen.getByText('Reservar')).toBeInTheDocument()
    // ...pero no es un botón ni un enlace real.
    expect(screen.queryByRole('button', { name: 'Reservar' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Reservar' })).toBeNull()
  })

  it('muestra la descripción exacta de cada servicio', () => {
    render(<Servicios />)

    for (const description of DESCRIPTIONS) {
      expect(screen.getByText(description)).toBeInTheDocument()
    }
  })
})
