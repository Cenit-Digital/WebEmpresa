import type { ReactNode, CSSProperties } from 'react'

/**
 * Tarjeta de contenido de Cénit Digital (servicio / sector / paquete).
 * @startingPoint section="Core" subtitle="Tarjeta con etiqueta, título y CTA" viewport="700x220"
 */
export interface CardProps {
  /** Etiqueta de categoría opcional (pill superior). */
  tag?: ReactNode
  /** Título de la tarjeta. */
  title?: ReactNode
  /** Resalta la tarjeta (borde primary + sombra + insignia). */
  featured?: boolean
  /** Texto de la insignia cuando featured. Por defecto "Más elegido". */
  badge?: string
  /** Cuerpo de la tarjeta. */
  children?: ReactNode
  /** Zona inferior (p. ej. un Button), anclada al fondo. */
  footer?: ReactNode
  style?: CSSProperties
}

export declare function Card(props: CardProps): JSX.Element
