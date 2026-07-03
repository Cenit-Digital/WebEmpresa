import type { ReactNode } from 'react'

/** Fila de servicio en zigzag (tarjeta + mockup + nota "Ejemplo"). */
export interface ServiceRowProps {
  /** Etiqueta de categoría (pill). */
  tag?: ReactNode
  /** Título del servicio. */
  title?: ReactNode
  /** Descripción. */
  desc?: ReactNode
  /** Dos características (se listan con check). */
  features?: ReactNode[]
  /** Texto de la nota "Ejemplo" bajo el mockup. */
  example?: ReactNode
  /** Mockup ilustrativo (cualquier nodo). Ocupa el panel 16:10. */
  mockup?: ReactNode
  /** Invierte el orden (mockup a la izquierda). Para el zigzag. */
  reverse?: boolean
}

export declare function ServiceRow(props: ServiceRowProps): JSX.Element
