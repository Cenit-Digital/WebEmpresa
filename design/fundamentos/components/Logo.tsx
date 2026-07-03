import { useId } from 'react'
import styles from './Logo.module.scss'

type LogoProps = {
  /** Muestra el wordmark "cénit / digital" junto al icono. */
  withWordmark?: boolean
  /** Tamaño del icono en px (alto = ancho). Nav = 40, footer = 38. */
  size?: number
}

/**
 * Logotipo de Cénit Digital — icono "Órbita": anillo + onda degradada
 * (primary → secondary) + punto cénit. Todos los colores salen de los tokens
 * de tema (var(--color-…)), así que el logo se adapta solo a claro/oscuro.
 * Fuente de verdad: "Cenit Digital - Web (final)" (Claude Design).
 */
export default function Logo({ withWordmark = true, size = 40 }: LogoProps) {
  // id único por instancia para el degradado (evita colisiones nav/footer).
  const gradId = `cenit-wave-${useId().replace(/:/g, '')}`

  return (
    <span className={styles.logo}>
      <svg
        className={styles.mark}
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="12"
            y1="40"
            x2="68"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
        {/* Anillo de la órbita */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="var(--color-ring)"
          strokeWidth="1.8"
          strokeOpacity="0.5"
        />
        {/* Onda (trayectoria) con degradado marca */}
        <path
          d="M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Punto cénit */}
        <circle cx="40" cy="20" r="3.8" fill="var(--color-zenith)" />
      </svg>

      {withWordmark && (
        <span className={styles.wordmark}>
          <span className={styles.name}>cénit</span>
          <span className={styles.sub}>digital</span>
        </span>
      )}
    </span>
  )
}
