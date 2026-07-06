/** Datos que el formulario de contacto recoge y envía. */
export type ContactData = {
  nombre: string
  email: string
  telefono?: string
  sector?: string
  mensaje?: string
}

/** Error de validación asociado a un campo obligatorio del formulario. */
export type ContactError = {
  field: 'nombre' | 'email'
  message: string
}

/** Formato mínimo de correo: algo@algo.algo, sin espacios ni `@` de más. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valida lo mínimo del contacto: nombre no vacío y correo no vacío con formato
 * válido. Devuelve el primer error (nombre tiene prioridad) o `null` si todo
 * está correcto.
 */
export function validateContact(data: ContactData): ContactError | null {
  if (data.nombre.trim() === '') {
    return { field: 'nombre', message: 'Indica tu nombre.' }
  }
  if (data.email.trim() === '') {
    return { field: 'email', message: 'Indica tu correo electrónico.' }
  }
  if (!EMAIL_RE.test(data.email)) {
    return { field: 'email', message: 'El correo no tiene un formato válido.' }
  }
  return null
}

/**
 * Envía el contacto al endpoint serverless `/api/contact` (que a su vez usa
 * Resend). Lanza si la respuesta no es correcta para que la UI muestre error.
 */
export async function sendContactEmail(data: ContactData): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('No se pudo enviar el mensaje.')
  }
}
