import { ClientOnly } from 'vite-react-ssg'
import { CTA_LINK, NAV_LINKS } from '../lib/nav'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import styles from './HeaderNav.module.scss'

/**
 * Navegación de la cabecera. Renderiza SIEMPRE los dos clústeres y deja que el
 * CSS `@media` decida cuál se ve: la nav de escritorio (@s2/@s6: enlaces + tema
 * + CTA "Hablamos") y la barra móvil (@s4: tema + botón "Menú"). No decide el
 * layout por JS (`matchMedia`): el prerender SSG no tiene viewport, así que
 * ramificar por `matchMedia` "pegaba" el árbol a escritorio hasta la hidratación
 * y en móvil dejaba sin hamburguesa y con desbordamiento. Ver docs/conventions.md
 * §Responsive (layout responsive por CSS, no por hidratación).
 *
 * `ThemeToggle` es client-only (localStorage/matchMedia) → va envuelto en
 * `ClientOnly` para no renderizar en el prerender SSG.
 */
export default function HeaderNav() {
  return (
    <div className={styles.cluster}>
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
      <div className={styles.mobile}>
        <ClientOnly>{() => <ThemeToggle />}</ClientOnly>
        <MobileMenu />
      </div>
    </div>
  )
}
