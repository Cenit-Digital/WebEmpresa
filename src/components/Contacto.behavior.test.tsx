import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Contacto from './Contacto'
import { sendContactEmail } from '../lib/contact'

// Mockeamos SOLO el envío real (sendContactEmail); la validación pura
// (validateContact) se mantiene real para ejercitar el comportamiento completo.
vi.mock('../lib/contact', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/contact')>()
  return { ...actual, sendContactEmail: vi.fn() }
})

const send = vi.mocked(sendContactEmail)

/** Promesa controlable para observar estados durante un envío pendiente. */
function deferred() {
  let resolve!: () => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

beforeEach(() => {
  send.mockReset()
  send.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Contacto (comportamiento)', () => {
  it('@s1 con el nombre vacío marca error en "Nombre" y no envía', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@cenit.dev')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    const nombre = screen.getByLabelText(/Nombre/)
    expect(nombre).toHaveAttribute('aria-invalid', 'true')
    const errorId = nombre.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId as string)?.textContent?.length).toBeGreaterThan(0)
    // El error es del NOMBRE: el campo Correo NO debe quedar marcado como inválido
    // ni mostrar su mensaje (evita que un error se pinte en todos los campos).
    const email = screen.getByLabelText(/Correo electrónico/)
    expect(email).not.toHaveAttribute('aria-invalid')
    expect(email).not.toHaveAttribute('aria-describedby')
    expect(send).not.toHaveBeenCalled()
  })

  it('@s2 con el correo vacío marca error en "Correo electrónico" y no envía', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    const email = screen.getByLabelText(/Correo electrónico/)
    expect(email).toHaveAttribute('aria-invalid', 'true')
    const errorId = email.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId as string)?.textContent?.length).toBeGreaterThan(0)
    expect(send).not.toHaveBeenCalled()
  })

  it('@s3 con el correo "hola@@mal" muestra error de formato y no envía', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo electrónico/), 'hola@@mal')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    const email = screen.getByLabelText(/Correo electrónico/)
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('El correo no tiene un formato válido.')).toBeInTheDocument()
    expect(send).not.toHaveBeenCalled()
  })

  it('@s4 con datos válidos llama a sendContactEmail con el formulario y muestra éxito', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@cenit.dev')
    await user.type(screen.getByLabelText('Teléfono'), '600123123')
    await user.selectOptions(screen.getByLabelText('Sector'), 'Veterinaria')
    await user.type(screen.getByLabelText('¿Qué necesitas?'), 'Quiero una web')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    expect(send).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledWith({
      nombre: 'Ana',
      email: 'ana@cenit.dev',
      telefono: '600123123',
      sector: 'Veterinaria',
      mensaje: 'Quiero una web',
    })
    expect(await screen.findByRole('status')).toBeInTheDocument()
  })

  it('@s5 el botón queda deshabilitado mientras el envío está pendiente', async () => {
    const user = userEvent.setup()
    const pending = deferred()
    send.mockReturnValue(pending.promise)
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@cenit.dev')
    const button = screen.getByRole('button', { name: 'Enviar consulta gratuita' })
    await user.click(button)

    // Durante la promesa pendiente el botón no permite reenviar.
    expect(button).toBeDisabled()

    pending.resolve()
    await waitFor(() => expect(button).toBeEnabled())
  })

  it('@s6 tras el éxito, Nombre, Correo y ¿Qué necesitas? quedan vacíos', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    const nombre = screen.getByLabelText(/Nombre/)
    const email = screen.getByLabelText(/Correo electrónico/)
    const mensaje = screen.getByLabelText('¿Qué necesitas?')
    await user.type(nombre, 'Ana')
    await user.type(email, 'ana@cenit.dev')
    await user.type(mensaje, 'Quiero una web')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    await screen.findByRole('status')
    expect(nombre).toHaveValue('')
    expect(email).toHaveValue('')
    expect(mensaje).toHaveValue('')
  })

  it('@s7 si el envío falla, muestra error y conserva lo escrito', async () => {
    const user = userEvent.setup()
    send.mockRejectedValue(new Error('boom'))
    render(<Contacto />)

    const nombre = screen.getByLabelText(/Nombre/)
    const email = screen.getByLabelText(/Correo electrónico/)
    const mensaje = screen.getByLabelText('¿Qué necesitas?')
    await user.type(nombre, 'Ana')
    await user.type(email, 'ana@cenit.dev')
    await user.type(mensaje, 'Quiero una web')
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    // Los datos introducidos siguen presentes.
    expect(nombre).toHaveValue('Ana')
    expect(email).toHaveValue('ana@cenit.dev')
    expect(mensaje).toHaveValue('Quiero una web')
  })

  it('@s8 si el honeypot está relleno, no envía y simula éxito silencioso', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@cenit.dev')
    // Un bot rellena el campo trampa (fuera del flujo accesible).
    fireEvent.change(screen.getByLabelText('No rellenar'), { target: { value: 'bot' } })
    await user.click(screen.getByRole('button', { name: 'Enviar consulta gratuita' }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(send).not.toHaveBeenCalled()
  })
})
