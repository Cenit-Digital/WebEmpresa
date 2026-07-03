import type { ReactNode, CSSProperties } from 'react'

/** Etiqueta (tag pill) de categoría en versalitas. */
export interface TagProps {
  children?: ReactNode
  style?: CSSProperties
}

export declare function Tag(props: TagProps): JSX.Element
