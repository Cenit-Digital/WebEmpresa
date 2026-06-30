import styles from './Logo.module.scss'

type LogoProps = {
  withWordmark?: boolean
}

export default function Logo({ withWordmark = true }: LogoProps) {
  return (
    <span className={styles.logo}>
      <svg
        className={styles.mark}
        viewBox="0 0 64 64"
        width="32"
        height="32"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse
          cx="32"
          cy="34"
          rx="20"
          ry="11"
          fill="none"
          stroke="var(--color-brand-mint)"
          strokeWidth="2.5"
          transform="rotate(-24 32 34)"
        />
        <line
          x1="32"
          y1="12"
          x2="32"
          y2="52"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeDasharray="2 4"
          strokeLinecap="round"
        />
        <circle cx="32" cy="14" r="5" fill="var(--color-brand)" />
        <circle cx="48" cy="28" r="3.2" fill="var(--color-brand-mint)" />
      </svg>
      {withWordmark && <span className={styles.wordmark}>CÉNIT DIGITAL</span>}
    </span>
  )
}
