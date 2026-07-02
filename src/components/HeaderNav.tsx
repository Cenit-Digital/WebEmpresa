import { CTA_LINK, NAV_LINKS } from '../lib/nav'
import { useIsMobile } from '../lib/useIsMobile'
import MobileMenu from './MobileMenu'
import styles from './HeaderNav.module.scss'

/**
 * Navegación de la cabecera. En móvil (@s5) muestra el botón de menú que abre
 * el panel; en escritorio (@s2, @s9) muestra los enlaces del contrato y el CTA
 * "Hablamos". La decisión la toma `useIsMobile` (testeable con matchMedia).
 */
export default function HeaderNav() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <MobileMenu />
  }

  return (
    <nav className={styles.nav} aria-label="Principal">
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
      <a className={styles.cta} href={CTA_LINK.href}>
        {CTA_LINK.label}
      </a>
    </nav>
  )
}
