import type { CSSProperties } from 'react'

/** Campo de formulario (etiqueta + control) de Cénit Digital. */
export interface FieldProps {
  /** Texto de la etiqueta. */
  label?: string
  /** Tipo de control. Por defecto "input". */
  as?: 'input' | 'textarea' | 'select'
  /** type del <input> (text, email, tel…). Ignorado si as≠input. */
  type?: string
  /** Marca el campo como obligatorio (asterisco + required). */
  required?: boolean
  placeholder?: string
  /** Opciones del <select> (solo si as="select"). */
  options?: string[]
  style?: CSSProperties
}

export declare function Field(props: FieldProps): JSX.Element
