import type { ReactNode, CSSProperties } from 'react'

/**
 * Botón de acción de Cénit Digital (primary / secondary / ghost).
 * @startingPoint section="Core" subtitle="Botón de acción con variantes" viewport="700x150"
 */
export interface ButtonProps {
  /** Estilo visual. Por defecto "primary". */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Tamaño. "sm" para navegación, "md" para CTAs. Por defecto "md". */
  size?: 'sm' | 'md'
  /** Si se indica, el botón se renderiza como enlace <a> a esta URL. */
  href?: string
  children?: ReactNode
  style?: CSSProperties
}

export declare function Button(props: ButtonProps): JSX.Element
