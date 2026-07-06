import styles from './CheckIcon.module.scss'

/**
 * Check decorativo de las características de servicio (§6: stroke:primary).
 * Fuera de `stryker.config.json mutate`: sus literales svg no son testeables.
 */
export default function CheckIcon() {
  return (
    <svg
      className={styles.check}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
