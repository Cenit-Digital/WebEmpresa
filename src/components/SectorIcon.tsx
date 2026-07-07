type SectorIconProps = {
  /** Índice de la tarjeta; selecciona el pictograma del sector. */
  index: number
}

/**
 * Pictograma DECORATIVO (§6) de la cabecera de una tarjeta de sector
 * (`aria-hidden`, 62px, `fill:on-primary`). Fuera de `stryker.config.json
 * mutate`: sus literales de `path`/`circle` son decoración no testeable y no
 * deben generar supervivientes en `Sectores.tsx`.
 */
export default function SectorIcon({ index }: SectorIconProps) {
  const shared = {
    width: 62,
    height: 62,
    viewBox: '0 0 48 48',
    'aria-hidden': true,
    focusable: false,
  } as const

  // Veterinarias — huella.
  if (index === 0) {
    return (
      <svg {...shared} fill="var(--color-on-primary)">
        <circle cx="15" cy="18" r="4.2" />
        <circle cx="24" cy="13.5" r="4.6" />
        <circle cx="33" cy="18" r="4.2" />
        <circle cx="38" cy="27" r="3.8" />
        <circle cx="10" cy="27" r="3.8" />
        <path d="M24 22c-5.5 0-10 4.8-10 9.4 0 3.4 2.7 5.1 6 5.1 1.7 0 2.8-.7 4-.7s2.3.7 4 .7c3.3 0 6-1.7 6-5.1C34 26.8 29.5 22 24 22z" />
      </svg>
    )
  }

  // Servicios de estética — destellos.
  if (index === 1) {
    return (
      <svg
        {...shared}
        fill="none"
        stroke="var(--color-on-primary)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M24 6c2.5 7 4.5 9 11.5 11.5C28.5 20 26.5 22 24 29c-2.5-7-4.5-9-11.5-11.5C19.5 15 21.5 13 24 6z"
          fill="var(--color-on-primary)"
          stroke="none"
        />
        <path
          d="M36 30c1.2 3.3 2.1 4.2 5.4 5.4-3.3 1.2-4.2 2.1-5.4 5.4-1.2-3.3-2.1-4.2-5.4-5.4 3.3-1.2 4.2-2.1 5.4-5.4z"
          fill="var(--color-on-primary)"
          stroke="none"
        />
        <circle cx="13" cy="34" r="2.4" fill="var(--color-on-primary)" stroke="none" />
      </svg>
    )
  }

  // Clínicas dentales — diente.
  if (index === 2) {
    return (
      <svg {...shared} fill="var(--color-on-primary)">
        <path d="M24 8c-5 0-7-2-11-2C8 6 6 10 6 17c0 8 3 14 5 19 1.5 3.8 3 5 4.5 5 2 0 2.2-3 3-6 .7-2.6 1.5-4 5.5-4s4.8 1.4 5.5 4c.8 3 1 6 3 6 1.5 0 3-1.2 4.5-5 2-5 5-11 5-19 0-7-2-11-7-11-4 0-6 2-11 2z" />
      </svg>
    )
  }

  // Fisioterapeutas — figura en movimiento.
  return (
    <svg {...shared} fill="var(--color-on-primary)">
      <circle cx="24" cy="10" r="5" />
      <path d="M24 17c-3 0-5 2-5 5v9l-5 9a2.6 2.6 0 0 0 4.5 2.6L23 44h2l4.5 7.6A2.6 2.6 0 0 0 34 49l-5-9v-9c0-3-2-5-5-5z" />
      <path d="M14 22l-5 3a2.4 2.4 0 0 0 2.4 4.1L17 26M34 22l5 3a2.4 2.4 0 0 1-2.4 4.1L31 26" />
    </svg>
  )
}
