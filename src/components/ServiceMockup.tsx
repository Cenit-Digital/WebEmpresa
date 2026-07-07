import styles from './ServiceMockup.module.scss'

type ServiceMockupProps = {
  /** Índice de la tarjeta; la primera (Desarrollo web) muestra la píldora demo. */
  index: number
}

/**
 * Mockup ilustrativo y DECORATIVO de una fila de servicio (`aria-hidden`).
 * Fuera de `stryker.config.json mutate`: sus rótulos (p. ej. "Reservar") son
 * decoración no testeable y no deben generar supervivientes.
 */
export default function ServiceMockup({ index }: ServiceMockupProps) {
  return (
    <div className={styles.mockup} aria-hidden="true">
      <div className={styles.chrome}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.omnibox} />
      </div>
      <div className={styles.body}>
        <div className={styles.lines}>
          <span className={styles.lineStrong} />
          <span className={styles.line} />
          <span className={styles.lineShort} />
          {index === 0 ? <span className={styles.pill}>Reservar</span> : null}
        </div>
        <div className={styles.thumb} />
      </div>
    </div>
  )
}
