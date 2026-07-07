// Vercel Function (proyecto no-Next, formato `export default { fetch }`).
// Recibe el POST de `src/lib/contact.ts` (sendContactEmail) y envía el correo
// con Resend. Requiere la variable de entorno RESEND_API_KEY (privada, nunca en
// el cliente) y un dominio remitente verificado en Resend.
//
// Env opcionales: CONTACT_TO (destino, por defecto hola@cenitdigital.es) y
// RESEND_FROM (remitente verificado).
//
// Antiabuso (frontera de confianza): honeypot server-side, validación de formato
// y longitud, saneado CRLF y rate limiting por IP con @vercel/firewall. El rate
// limit requiere una regla "contact-form" en el Firewall de Vercel (dashboard);
// si no existe, checkRateLimit es un no-op seguro. Ver README §Formulario y
// progress/security_review.md.
//
// NOTA: este archivo NO forma parte del build SSG ni del typecheck del arnés
// (tsconfig solo incluye `src/`); Vercel lo compila y sirve por separado.
import { Resend } from 'resend'
import { checkRateLimit } from '@vercel/firewall'

type Payload = {
  nombre?: string
  email?: string
  telefono?: string
  sector?: string
  mensaje?: string
  empresa?: string // honeypot: los humanos lo dejan vacío
}

// Topes de longitud: acotan el abuso de payload aunque se salte el cliente.
const MAX = { nombre: 120, email: 320, telefono: 40, sector: 60, mensaje: 5000 }
// Mismo formato mínimo de correo que el cliente (src/lib/contact.ts).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Defensa en profundidad: quita CR/LF por si algún día se migra a SMTP crudo.
const stripCrlf = (s: string): string => s.replace(/[\r\n]+/g, ' ').trim()

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'Método no permitido' }, { status: 405 })
    }

    // Rate limit por IP (evita que un bucle de POSTs queme cuota de Resend).
    const { rateLimited } = await checkRateLimit('contact-form', { request })
    if (rateLimited) {
      return Response.json({ ok: false, error: 'Demasiadas solicitudes' }, { status: 429 })
    }

    let body: Payload
    try {
      body = (await request.json()) as Payload
    } catch {
      return Response.json({ ok: false, error: 'Cuerpo no válido' }, { status: 400 })
    }

    // Honeypot server-side: si el campo trampa viene relleno, éxito silencioso.
    if (typeof body.empresa === 'string' && body.empresa.trim() !== '') {
      return Response.json({ ok: true })
    }

    const nombre = stripCrlf(body.nombre ?? '')
    const email = stripCrlf(body.email ?? '')
    const telefono = (body.telefono ?? '').trim()
    const sector = (body.sector ?? '').trim()
    const mensaje = (body.mensaje ?? '').trim()

    if (nombre === '' || email === '') {
      return Response.json({ ok: false, error: 'Faltan campos obligatorios' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: 'Correo no válido' }, { status: 400 })
    }
    if (
      nombre.length > MAX.nombre ||
      email.length > MAX.email ||
      telefono.length > MAX.telefono ||
      sector.length > MAX.sector ||
      mensaje.length > MAX.mensaje
    ) {
      return Response.json({ ok: false, error: 'Campos demasiado largos' }, { status: 400 })
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
        `Teléfono: ${telefono || '—'}`,
        `Sector: ${sector || '—'}`,
        '',
        '¿Qué necesita?',
        mensaje || '—',
      ].join('\n'),
    })

    if (error) {
      return Response.json({ ok: false, error: 'No se pudo enviar' }, { status: 502 })
    }
    return Response.json({ ok: true })
  },
}
