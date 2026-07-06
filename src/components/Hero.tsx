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
