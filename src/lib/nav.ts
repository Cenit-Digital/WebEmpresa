/**
 * Definición de la navegación de la cabecera (contrato features/nav.feature).
 * Datos puros: los componentes (desktop y panel móvil) los consumen.
 */
export type NavLink = {
  label: string
  href: string
}

/** Enlaces principales, en el orden del contrato (@s2, @s5). */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sectores', href: '#sectores' },
  { label: 'Paquetes', href: '#paquetes' },
  { label: 'Contacto', href: '#contacto' },
]

/** Botón de llamada a la acción de la cabecera (@s2). */
export const CTA_LINK: NavLink = { label: 'Hablamos', href: '#contacto' }
