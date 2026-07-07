import { ClientOnly } from 'vite-react-ssg'
import { CTA_LINK, NAV_LINKS } from '../lib/nav'
import { useIsMobile } from '../lib/useIsMobile'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import styles from './HeaderNav.module.scss'

/**
 * Navegación de la cabecera. En móvil (@s4) oculta la nav de escritorio y
 * muestra el botón de tema + el botón "Menú" que abre el panel; en escritorio
 * (@s6) muestra los enlaces del contrato, el botón de tema y el CTA "Hablamos"
 * en ese orden. `ThemeToggle` es client-only (localStorage/matchMedia) → va
 * envuelto en `ClientOnly` para no renderizar en el prerender SSG.
 */
export default function HeaderNav() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className={styles.mobile}>
        <ClientOnly>{() => <ThemeToggle />}</ClientOnly>
        <MobileMenu />
      </div>
    )
  }

  return (
    <nav className={styles.nav} aria-label="Principal">
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
      <ClientOnly>{() => <ThemeToggle />}</ClientOnly>
      <a className={styles.cta} href={CTA_LINK.href}>
        {CTA_LINK.label}
      </a>
    </nav>
  )
}
