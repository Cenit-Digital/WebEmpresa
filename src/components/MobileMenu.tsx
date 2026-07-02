import { Dialog } from 'radix-ui'
import { NAV_LINKS } from '../lib/nav'
import styles from './MobileMenu.module.scss'

/**
 * Panel de navegación móvil (contrato @s5..@s8). Usa la primitiva `Dialog` de
 * Radix: overlay, cierre por fondo (@s8) y accesibilidad "de fábrica". Los
 * enlaces salen de `NAV_LINKS` (misma lista y orden que el nav de escritorio).
 */
export default function MobileMenu() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.trigger} aria-label="Abrir menú">
        ☰
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} data-testid="mobile-menu-overlay" />
        <Dialog.Content className={styles.panel} aria-describedby={undefined}>
          <Dialog.Title className={styles.title}>Menú</Dialog.Title>
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Dialog.Close asChild key={link.href}>
                <a href={link.href}>{link.label}</a>
              </Dialog.Close>
            ))}
          </nav>
          <Dialog.Close className={styles.close} aria-label="Cerrar menú">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
