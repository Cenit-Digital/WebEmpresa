// Vercel Function (proyecto no-Next, formato `export default { fetch }`).
// Recibe el POST de `src/lib/contact.ts` (sendContactEmail) y envía el correo
// con Resend. Requiere la variable de entorno RESEND_API_KEY (privada, nunca en
// el cliente) y un dominio remitente verificado en Resend.
//
// Env opcionales: CONTACT_TO (destino, por defecto hola@cenitdigital.es) y
// RESEND_FROM (remitente verificado).
//
// NOTA: este archivo NO forma parte del build SSG ni del typecheck (tsconfig
// solo incluye `src/`); Vercel lo compila y sirve por separado en /api/contact.
import { Resend } from 'resend'

type Payload = {
  nombre?: string
  email?: string
  telefono?: string
  sector?: string
  mensaje?: string
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'Método no permitido' }, { status: 405 })
    }

    let body: Payload
    try {
      body = (await request.json()) as Payload
    } catch {
      return Response.json({ ok: false, error: 'Cuerpo no válido' }, { status: 400 })
    }

    const nombre = body.nombre?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    if (nombre === '' || email === '') {
      return Response.json({ ok: false, error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return Response.json({ ok: false, error: 'Servicio no configurado' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const to = process.env.CONTACT_TO ?? 'hola@cenitdigital.es'
    const from = process.env.RESEND_FROM ?? 'Cénit Digital <web@cenitdigital.es>'

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nueva consulta desde la web — ${nombre}`,
      text: [
        `Nombre: ${nombre}`,
        `Correo: ${email}`,
        `Teléfono: ${body.telefono?.trim() || '—'}`,
        `Sector: ${body.sector?.trim() || '—'}`,
        '',
        '¿Qué necesita?',
        body.mensaje?.trim() || '—',
      ].join('\n'),
    })

    if (error) {
      return Response.json({ ok: false, error: 'No se pudo enviar' }, { status: 502 })
    }
    return Response.json({ ok: true })
  },
}
