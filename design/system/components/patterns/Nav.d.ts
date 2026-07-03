import type { CSSProperties } from 'react'

interface NavLink {
  label: string
  href: string
}

/** Cabecera sticky de Cénit Digital con menú móvil. */
export interface NavProps {
  /** Enlaces del menú. Por defecto: Servicios, Sectores, Paquetes, Contacto. */
  links?: NavLink[]
  /** Texto del botón CTA. Por defecto "Hablamos". */
  ctaLabel?: string
  /** Destino del CTA. Por defecto "#contacto". */
  ctaHref?: string
  /** Callback del toggle de tema. Si se omite, alterna data-theme en <html>. */
  onToggleTheme?: () => void
}

export declare function Nav(props: NavProps): JSX.Element
