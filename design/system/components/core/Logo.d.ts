import type { CSSProperties } from 'react'

/**
 * Logotipo de Cénit Digital (icono Órbita + wordmark), adaptativo al tema.
 * @startingPoint section="Core" subtitle="Logotipo Órbita con wordmark" viewport="700x150"
 */
export interface LogoProps {
  /** Muestra el wordmark "cénit / digital" junto al icono. Por defecto true. */
  withWordmark?: boolean
  /** Tamaño del icono en px (alto = ancho). Nav = 40, footer = 38. */
  size?: number
  style?: CSSProperties
}

export declare function Logo(props: LogoProps): JSX.Element
