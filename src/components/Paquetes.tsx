import CheckIcon from './CheckIcon'
import styles from './Paquetes.module.scss'

type Paquete = {
  name: string
  tagline: string
  features: readonly string[]
  featured?: boolean
}

const PAQUETES: readonly Paquete[] = [
  {
    name: 'Presencia Digital',
    tagline: 'Lo esencial para existir online y que te encuentren.',
    features: [
      'Web hasta 6 páginas',
      'Dominio .es incluido',
      'Hosting y SSL',
      'SEO básico on-page',
      'Ficha Google Business',
    ],
  },
  {
    name: 'Presencia Activa',
    tagline: 'Presencia + marketing para crecer cada mes.',
    features: [
      'Todo Presencia Digital',
      'RRSS (2 redes, semanal)',
      'Email marketing mensual',
      'Gestión de reputación',
      'SEO local avanzado',
    ],
    featured: true,
  },
  {
    name: 'Negocio Conectado',
    tagline: 'Automatiza la operativa de punta a punta.',
    features: [
      'Todo Presencia Activa',
      'Chatbot WhatsApp IA',
      'Sistema de citas online',
      'Dashboard de métricas',
      'Automatización de procesos',
    ],
  },
]

const BADGE = 'Más elegido'

export default function Paquetes() {
  return (
    <section id="paquetes" className={styles.packages}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Paquetes</p>
        <h2 className={styles.title}>
          Elige tu <em className={styles.highlight}>paquete</em>
        </h2>
        <p className={styles.intro}>
          Tres niveles según lo que necesite tu negocio. Te preparamos un presupuesto a medida, sin
          entrada y sin sorpresas.
        </p>

        <div className={styles.grid}>
          {PAQUETES.map((paquete) => (
            <article key={paquete.name} className={styles.card}>
              {paquete.featured && <span className={styles.badge}>{BADGE}</span>}
              <h3 className={styles.cardTitle}>{paquete.name}</h3>
              <p className={styles.tagline}>{paquete.tagline}</p>
              <ul className={styles.features}>
                {paquete.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contacto" className={styles.cta}>
                Solicitar presupuesto
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
