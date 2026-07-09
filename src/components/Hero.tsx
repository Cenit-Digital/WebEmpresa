import styles from './Hero.module.scss'

const STATS = [
  { value: '24h', label: 'tiempo de respuesta' },
  { value: '+30', label: 'pymes confían' },
  { value: '100%', label: 'diseño a medida' },
  { value: '5★', label: 'valoración media' },
] as const

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div data-hero-arc aria-hidden="true" className={styles.arc}>
        <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeOpacity=".5"
            data-orbit-ring=""
          />
          <path
            d="M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.4"
            strokeLinecap="round"
            data-orbit-wave=""
          />
          {/* Punto cénit: contorno (A) que se traza + relleno (B) que hace "pop". */}
          <circle
            cx="40"
            cy="20"
            r="3"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.3"
            data-orbit-dot-outline=""
          />
          <circle cx="40" cy="20" r="3" fill="var(--color-accent)" data-orbit-dot-fill="" />
        </svg>
      </div>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Soluciones digitales para pymes</p>
        <h1 className={styles.title}>
          Llevamos tu negocio al punto más alto de su presencia digital.
        </h1>
        <p className={styles.lead}>
          Web, automatización con IA, marketing y sistemas de citas — todo bajo una cuota mensual,
          sin entrada.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#paquetes">
            Ver paquetes
          </a>
          <a className={styles.secondary} href="#contacto">
            Hablar con nosotros
          </a>
        </div>
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
