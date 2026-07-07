import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendContactEmail, validateContact } from './contact'

const base = { nombre: 'Ana', email: 'ana@cenit.dev' }

describe('validateContact', () => {
  it('@s1 con el nombre vacío devuelve un error en el campo "nombre"', () => {
    const error = validateContact({ ...base, nombre: '' })

    expect(error).not.toBeNull()
    expect(error?.field).toBe('nombre')
    expect(error?.message.length).toBeGreaterThan(0)
  })

  it('@s1 trata como vacío un nombre compuesto solo de espacios', () => {
    const error = validateContact({ ...base, nombre: '   ' })

    expect(error?.field).toBe('nombre')
  })

  it('@s2 con el correo vacío devuelve un error en el campo "email"', () => {
    const error = validateContact({ ...base, email: '' })

    expect(error?.field).toBe('email')
    expect(error?.message.length).toBeGreaterThan(0)
  })

  it('@s2 trata como vacío un correo compuesto solo de espacios', () => {
    const error = validateContact({ ...base, email: '   ' })

    expect(error?.field).toBe('email')
    // Mismo mensaje que el correo vacío (no llega a la validación de formato).
    expect(error?.message).toBe(validateContact({ ...base, email: '' })?.message)
  })

  it('@s3 con un correo de formato inválido devuelve un error en "email"', () => {
    const error = validateContact({ ...base, email: 'hola@@mal' })

    expect(error?.field).toBe('email')
    expect(error?.message.length).toBeGreaterThan(0)
  })

  it('@s3 el mensaje de formato inválido difiere del de correo vacío', () => {
    const vacio = validateContact({ ...base, email: '' })
    const invalido = validateContact({ ...base, email: 'hola@@mal' })

    expect(invalido?.message).not.toBe(vacio?.message)
  })

  it('@s3 rechaza un correo con basura ANTES de la dirección (ancla ^)', () => {
    // Sin el ancla inicial "^", "x hola@mal.com" colaría como válido.
    const error = validateContact({ ...base, email: 'x hola@mal.com' })

    expect(error?.field).toBe('email')
    expect(error?.message).toBe(validateContact({ ...base, email: 'hola@@mal' })?.message)
  })

  it('@s3 rechaza un correo con basura DESPUÉS de la dirección (ancla $)', () => {
    // Sin el ancla final "$", "hola@mal.com xxx" colaría como válido.
    const error = validateContact({ ...base, email: 'hola@mal.com xxx' })

    expect(error?.field).toBe('email')
    expect(error?.message).toBe(validateContact({ ...base, email: 'hola@@mal' })?.message)
  })

  it('@s4 con nombre y correo válidos no devuelve error (null)', () => {
    expect(validateContact(base)).toBeNull()
  })

  it('prioriza el error de nombre sobre el de correo cuando ambos fallan', () => {
    const error = validateContact({ nombre: '', email: '' })

    expect(error?.field).toBe('nombre')
  })
})

describe('sendContactEmail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('@s4 hace POST a /api/contact con los datos serializados en JSON', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }))

    const data = { ...base, telefono: '600', sector: 'Otro', mensaje: 'Hola' }
    await sendContactEmail(data)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  })

  it('@s4 resuelve sin lanzar cuando la respuesta es ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))

    await expect(sendContactEmail(base)).resolves.toBeUndefined()
  })

  it('@s7 lanza un error cuando la respuesta no es ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(sendContactEmail(base)).rejects.toThrow()
  })

  it('@s7 el error lanzado lleva el mensaje exacto de fallo de envío', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    // Mensaje literal: mata el mutante que lo vacía a "".
    await expect(sendContactEmail(base)).rejects.toThrow('No se pudo enviar el mensaje.')
  })
})
