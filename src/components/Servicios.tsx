import { useReveal } from '../lib/useReveal'
import CheckIcon from './CheckIcon'
import ServiceMockup from './ServiceMockup'
import styles from './Servicios.module.scss'

type Service = {
  tag: string
  title: string
  description: string
  features: readonly [string, string]
  example: string
}

const SERVICES: readonly Service[] = [
  {
    tag: 'Presencia',
    title: 'Desarrollo web',
    description:
      'Webs rápidas, con SEO nativo y diseño profesional. Desde landing pages hasta tiendas y catálogos B2B, pensadas para convertir visitas en clientes. Con dominio y hosting incluidos.',
    features: ['Diseño 100% a medida y responsive', 'Dominio, hosting y SSL incluidos'],
    example: 'Tienda online con reservas para una clínica veterinaria, lista en 3 semanas.',
  },
  {
    tag: 'IA',
    title: 'Chatbot WhatsApp',
    description:
      'Asistente con IA que atiende a tus clientes 24/7, resuelve dudas, gestiona citas y captura leads mientras tú trabajas. Conectado a WhatsApp Business API.',
    features: ['Atiende y agenda 24/7', 'Deriva a una persona cuando hace falta'],
    example: 'El bot responde y agenda solo; deriva a una persona cuando hace falta.',
  },
  {
    tag: 'Marketing',
    title: 'Gestión de RRSS',
    description:
      'Contenido semanal, publicación y gestión de comentarios en 2 o 4 redes sociales. Creamos una línea visual coherente con tu marca y campañas de publicidad en el plan avanzado.',
    features: ['Calendario de contenidos mensual', 'Informe de alcance e interacción'],
    example: 'Calendario de contenidos + informe mensual de alcance e interacción.',
  },
  {
    tag: 'Visibilidad',
    title: 'SEO local',
    description:
      'Posicionamiento en Google Maps y búsquedas locales para que te encuentren justo cuando buscan tu servicio cerca. Ficha de Google Business optimizada e informe mensual de métricas.',
    features: ['Ficha de Google Business optimizada', 'Informe mensual de posiciones'],
    example: 'Apareces en el top del mapa cuando buscan tu servicio cerca.',
  },
  {
    tag: 'Operativa',
    title: 'Sistema de citas',
    description:
      'Reservas online, recordatorios automáticos por WhatsApp y gestión de agenda en un solo panel. Adiós a las llamadas perdidas y a los huecos sin cubrir en tu día a día.',
    features: ['Reservas online 24/7', 'Recordatorios automáticos'],
    example: 'Menos llamadas y cero huecos: el cliente reserva 24/7 desde el móvil.',
  },
  {
    tag: 'Integración',
    title: 'Conexión ERP',
    description:
      'Conectamos tu web o chatbot con tu ERP (Holded, Odoo y más). Presupuestos automáticos, stock en tiempo real y pedidos que entran sin intervención manual.',
    features: ['Integración con Holded, Odoo y más', 'Stock y pedidos en tiempo real'],
    example: 'Tu web habla con tu ERP: presupuesto y stock sin teclear nada.',
  },
]

export default function Servicios() {
  // Revelado en scroll (#15): arma data-reveal en .rows y conmuta data-in-view
  // por fila. SSR-safe: sin IntersectionObserver el contenido queda visible.
  const rows = useReveal<HTMLDivElement>()

  return (
    <section id="servicios" className={styles.services}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Lo que hacemos</p>
        <h2 className={styles.title}>
          Servicios que <em className={styles.highlight}>transforman</em> negocios locales
        </h2>
        <p className={styles.intro}>
          No somos solo una agencia de diseño. Cada servicio se ve con su tarjeta, una referencia
          visual de cómo queda en uso, y una nota con un ejemplo real.
        </p>

        <div className={styles.rows} ref={rows}>
          {SERVICES.map((service, index) => (
            <article key={service.title} className={styles.row}>
              <div className={styles.card}>
                <span className={styles.tag}>{service.tag}</span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.description}>{service.description}</p>
                <ul className={styles.features}>
                  {service.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.aside}>
                <div className={styles.mockup}>
                  <ServiceMockup index={index} />
                </div>
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>Ejemplo</span>
                  <p className={styles.exampleText}>{service.example}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
