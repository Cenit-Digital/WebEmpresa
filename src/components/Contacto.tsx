import { useState, type FormEvent } from 'react'
import styles from './Contacto.module.scss'
import { sendContactEmail, validateContact, type ContactError } from '../lib/contact'

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

const SECTORS = [
  'Veterinaria',
  'Servicios de estética',
  'Clínica dental',
  'Fisioterapia',
  'Otro',
] as const

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [sector, setSector] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [error, setError] = useState<ContactError | null>(null)
  // El literal 'idle' es equivalente a '' en esta UI (mismo render: ni éxito ni
  // error, botón habilitado). Ningún test honesto puede distinguirlos, así que se
  // documenta como mutante equivalente en vez de forzar una aserción tautológica.
  // Stryker disable next-line StringLiteral
  const [status, setStatus] = useState<SubmitStatus>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Honeypot: si el campo trampa viene relleno es un bot. Simulamos éxito
    // silencioso sin enviar nada real.
    if (empresa !== '') {
      setStatus('success')
      return
    }

    const validation = validateContact({ nombre, email, telefono, sector, mensaje })
    if (validation) {
      setError(validation)
      return
    }
    setError(null)
    setStatus('sending')
    try {
      await sendContactEmail({ nombre, email, telefono, sector, mensaje })
    } catch {
      setStatus('error')
      return
    }
    setStatus('success')
    setNombre('')
    setEmail('')
    setMensaje('')
  }

  const nombreError = error?.field === 'nombre' ? error : null
  const emailError = error?.field === 'email' ? error : null

  return (
    <section id="contacto" className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Contacto</p>
          <h2 className={styles.title}>Cuéntanos qué necesita tu negocio</h2>
          <p className={styles.intro}>
            Primera consulta gratuita y sin compromiso. Te llamamos y te respondemos en menos de 24
            horas.
          </p>
          <p className={styles.phoneLine}>
            <a href="tel:+34600000000" className={styles.phone}>
              +34 600 00 00 00
            </a>
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="contacto-nombre" className={styles.label}>
              Nombre
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="contacto-nombre"
              name="nombre"
              type="text"
              required
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={nombreError ? true : undefined}
              aria-describedby={nombreError ? 'contacto-nombre-error' : undefined}
            />
            {nombreError && (
              <p id="contacto-nombre-error" className={styles.fieldError} role="alert">
                {nombreError.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="contacto-email" className={styles.label}>
              Correo electrónico
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="contacto-email"
              name="email"
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'contacto-email-error' : undefined}
            />
            {emailError && (
              <p id="contacto-email-error" className={styles.fieldError} role="alert">
                {emailError.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="contacto-telefono" className={styles.label}>
              Teléfono
            </label>
            <input
              id="contacto-telefono"
              name="telefono"
              type="tel"
              className={styles.input}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contacto-sector" className={styles.label}>
              Sector
            </label>
            <select
              id="contacto-sector"
              name="sector"
              className={styles.input}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="" disabled>
                Selecciona tu sector
              </option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="contacto-mensaje" className={styles.label}>
              ¿Qué necesitas?
            </label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              rows={4}
              className={styles.input}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>

          {/* Campo trampa (honeypot). Oculto y fuera del flujo accesible. */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="contacto-empresa">No rellenar</label>
            <input
              id="contacto-empresa"
              name="empresa"
              tabIndex={-1}
              autoComplete="off"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            Enviar consulta gratuita
          </button>

          {status === 'success' && (
            <p className={styles.success} role="status">
              Mensaje enviado. Te responderemos en menos de 24 horas.
            </p>
          )}
          {status === 'error' && (
            <p className={styles.formError} role="alert">
              No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
