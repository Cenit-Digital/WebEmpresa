import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Contacto from './Contacto'

describe('Contacto', () => {
  it('@s1 la intro contiene la promesa de respuesta en menos de 24 horas', () => {
    render(<Contacto />)

    expect(
      screen.getByText(
        'Primera consulta gratuita y sin compromiso. Te llamamos y te respondemos en menos de 24 horas.',
      ),
    ).toBeInTheDocument()
  })

  it('@s2 ofrece el teléfono como enlace de llamada cuyo href empieza por "tel:"', () => {
    render(<Contacto />)

    const phone = screen.getByRole('link', { name: '+34 600 00 00 00' })
    expect(phone).toHaveAttribute('href', 'tel:+34600000000')
    expect(phone.getAttribute('href')).toMatch(/^tel:/)
  })

  it('@s3 el formulario muestra sus cinco campos con etiqueta asociada', () => {
    render(<Contacto />)

    expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo electrónico/)).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Sector')).toBeInTheDocument()
    expect(screen.getByLabelText('¿Qué necesitas?')).toBeInTheDocument()
  })

  it('@s4 "Nombre" y "Correo electrónico" están marcados como obligatorios', () => {
    render(<Contacto />)

    expect(screen.getByLabelText(/Nombre/)).toBeRequired()
    expect(screen.getByLabelText(/Correo electrónico/)).toBeRequired()
    // Los opcionales no lo están.
    expect(screen.getByLabelText('Teléfono')).not.toBeRequired()
    expect(screen.getByLabelText('¿Qué necesitas?')).not.toBeRequired()
  })

  it('@s4 los campos obligatorios muestran un asterisco en su etiqueta', () => {
    render(<Contacto />)

    const nombre = screen.getByText('Nombre').closest('label')
    const correo = screen.getByText('Correo electrónico').closest('label')
    expect(nombre?.textContent).toContain('*')
    expect(correo?.textContent).toContain('*')
  })

  it('@s5 el desplegable "Sector" ofrece las opciones esperadas y un placeholder', () => {
    render(<Contacto />)

    const select = screen.getByLabelText('Sector')
    const options = within(select)
      .getAllByRole('option')
      .map((o) => o.textContent)
    expect(options).toEqual([
      'Selecciona tu sector',
      'Veterinaria',
      'Servicios de estética',
      'Clínica dental',
      'Fisioterapia',
      'Otro',
    ])
  })

  it('@s6 el botón de envío muestra el texto "Enviar consulta gratuita"', () => {
    render(<Contacto />)

    const button = screen.getByRole('button', { name: 'Enviar consulta gratuita' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('muestra la cabecera de sección (eyebrow y H2) y expone id="contacto"', () => {
    const { container } = render(<Contacto />)

    expect(screen.getByText('Contacto')).toBeInTheDocument()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toBe('Cuéntanos qué necesita tu negocio')
    expect(container.querySelector('section#contacto')).not.toBeNull()
  })

  it('los campos reales exponen name y type coherentes con su etiqueta', () => {
    render(<Contacto />)

    const nombre = screen.getByLabelText(/Nombre/)
    expect(nombre).toHaveAttribute('name', 'nombre')
    expect(nombre).toHaveAttribute('type', 'text')

    const email = screen.getByLabelText(/Correo electrónico/)
    expect(email).toHaveAttribute('name', 'email')
    expect(email).toHaveAttribute('type', 'email')

    const telefono = screen.getByLabelText('Teléfono')
    expect(telefono).toHaveAttribute('name', 'telefono')
    expect(telefono).toHaveAttribute('type', 'tel')

    const sector = screen.getByLabelText('Sector')
    expect(sector).toHaveAttribute('name', 'sector')
    expect(sector.tagName).toBe('SELECT')

    const mensaje = screen.getByLabelText('¿Qué necesitas?')
    expect(mensaje).toHaveAttribute('name', 'mensaje')
    expect(mensaje.tagName).toBe('TEXTAREA')
  })

  it('el asterisco de obligatorio queda fuera del nombre accesible del campo', () => {
    render(<Contacto />)

    expect(screen.getByLabelText(/Nombre/)).toHaveAccessibleName('Nombre')
    expect(screen.getByLabelText(/Correo electrónico/)).toHaveAccessibleName('Correo electrónico')
  })

  it('el placeholder de Sector es una opción deshabilitada con valor vacío', () => {
    render(<Contacto />)

    const select = screen.getByLabelText('Sector')
    const placeholder = within(select).getByRole('option', { name: 'Selecciona tu sector' })
    expect(placeholder).toBeDisabled()
    expect(placeholder).toHaveValue('')
  })

  it('el desplegable "Sector" arranca sin selección real: el placeholder está activo', () => {
    render(<Contacto />)

    const select = screen.getByLabelText('Sector') as HTMLSelectElement
    const placeholder = within(select).getByRole('option', {
      name: 'Selecciona tu sector',
    }) as HTMLOptionElement
    // Estado inicial vacío: el placeholder (value="") es la opción seleccionada.
    expect(placeholder.selected).toBe(true)
    expect(select.value).toBe('')
  })

  it('en el estado inicial no muestra el mensaje de error de envío', () => {
    render(<Contacto />)

    expect(
      screen.queryByText('No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.'),
    ).not.toBeInTheDocument()
  })

  it('incluye un honeypot oculto "empresa" fuera del flujo accesible para #11', () => {
    render(<Contacto />)

    const honeypot = screen.getByLabelText('No rellenar')
    expect(honeypot).toHaveAttribute('name', 'empresa')
    expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(honeypot).toHaveAttribute('autocomplete', 'off')
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
    // No debe contar como uno de los campos obligatorios reales.
    expect(honeypot).not.toBeRequired()
  })

  it('el formulario evita la recarga al enviarse (preventDefault, sin lógica de envío)', () => {
    const { container } = render(<Contacto />)

    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    // fireEvent.submit devuelve false cuando el handler llamó a preventDefault.
    const notPrevented = fireEvent.submit(form as HTMLFormElement)
    expect(notPrevented).toBe(false)
  })
})
