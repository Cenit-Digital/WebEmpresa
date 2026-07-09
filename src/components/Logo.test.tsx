import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo from './Logo'

describe('Logo', () => {
  it('@s1 el icono renderiza el símbolo "Órbita" (anillo, onda y punto) y es decorativo', () => {
    const { container } = render(<Logo />)

    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    // Anillo + punto = dos <circle>; la onda es un <path>.
    expect(svg?.querySelectorAll('circle')).toHaveLength(2)
    expect(svg?.querySelector('path')).not.toBeNull()
  })

  it('@s2 muestra el wordmark "cénit" y "digital" por defecto', () => {
    render(<Logo />)

    expect(screen.getByText('cénit')).toBeInTheDocument()
    expect(screen.getByText('digital')).toBeInTheDocument()
  })

  it('@s3 oculta el wordmark cuando withWordmark es false', () => {
    render(<Logo withWordmark={false} />)

    expect(screen.queryByText('cénit')).not.toBeInTheDocument()
    expect(screen.queryByText('digital')).not.toBeInTheDocument()
  })

  it('@s4 el tamaño del icono es configurable vía la prop size', () => {
    const { container } = render(<Logo size={38} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '38')
    expect(svg).toHaveAttribute('height', '38')
  })

  it('@s5 cada instancia genera un id de degradado distinto', () => {
    const { container } = render(
      <>
        <Logo />
        <Logo />
      </>,
    )

    const gradients = container.querySelectorAll('linearGradient')
    expect(gradients).toHaveLength(2)
    const [first, second] = Array.from(gradients).map((g) => g.getAttribute('id'))
    // El id debe ser un identificador válido "cenit-wave-<useId sin ':'>": sin
    // espacios ni caracteres raros. Si producción muta el reemplazo de ':' (a otra
    // cadena), el id contendría basura/espacios y dejaría de casar → mutante muerto.
    expect(first).toMatch(/^cenit-wave-[A-Za-z0-9_-]+$/)
    expect(second).toMatch(/^cenit-wave-[A-Za-z0-9_-]+$/)
    expect(first).not.toBe(second)
  })

  it('@s6 los colores del logo salen de tokens, no de hex fijos', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    const ring = svg?.querySelector('circle[stroke]')
    expect(ring).toHaveAttribute('stroke', 'var(--color-ring)')

    const zenith = svg?.querySelector('circle[fill="var(--color-zenith)"]')
    expect(zenith).not.toBeNull()

    const stops = svg?.querySelectorAll('stop') ?? []
    expect(stops[0]).toHaveAttribute('stop-color', 'var(--color-primary)')
    expect(stops[1]).toHaveAttribute('stop-color', 'var(--color-secondary)')
  })

  it('@s6 la onda (path) pinta su trazo con el degradado de su instancia', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    const grad = svg?.querySelector('linearGradient')
    const wave = svg?.querySelector('path')
    expect(wave).toHaveAttribute('stroke', `url(#${grad?.getAttribute('id')})`)
  })
})

// Feature #14 · logo_draw_animation — prop `animated` (D4). Estructura DOM +
// atributos de destino que consumen los @keyframes del parcial global
// `src/styles/_logo-draw.scss`. Los valores de keyframe/timing/dasharray se
// aseveran leyendo el .scss (ver src/styles/logo-draw.test.ts).
describe('Logo — animación de dibujado (#14)', () => {
  it('@s2 el Logo animado marca el anillo y la onda con sus hooks de dibujo', () => {
    const { container } = render(<Logo animated />)
    const svg = container.querySelector('svg')

    const ring = svg?.querySelector('circle[data-orbit-ring]')
    expect(ring).not.toBeNull()
    expect(ring).toHaveAttribute('data-orbit-ring', '')

    const wave = svg?.querySelector('path[data-orbit-wave]')
    expect(wave).not.toBeNull()
    expect(wave).toHaveAttribute('data-orbit-wave', '')
  })

  it('@s3 el punto del Logo animado son DOS círculos superpuestos (contorno A + relleno B)', () => {
    const { container } = render(<Logo animated />)
    const svg = container.querySelector('svg')

    // El punto cénit vive en cx="40" cy="20": exactamente dos <circle> ahí.
    const dots = svg?.querySelectorAll('circle[cx="40"][cy="20"]')
    expect(dots).toHaveLength(2)

    const outline = svg?.querySelector('circle[data-orbit-dot-outline]')
    expect(outline).not.toBeNull()
    expect(outline).toHaveAttribute('data-orbit-dot-outline', '')
    expect(outline).toHaveAttribute('fill', 'none')
    expect(outline).toHaveAttribute('stroke', 'var(--color-zenith)')

    const fill = svg?.querySelector('circle[data-orbit-dot-fill]')
    expect(fill).not.toBeNull()
    expect(fill).toHaveAttribute('data-orbit-dot-fill', '')
    expect(fill).toHaveAttribute('fill', 'var(--color-zenith)')
  })

  it('@s4 el wordmark del Logo animado lleva los hooks de máquina de escribir', () => {
    render(<Logo animated />)

    const cenit = screen.getByText('cénit')
    expect(cenit).toHaveAttribute('data-orbit-cenit', '')

    const digital = screen.getByText('digital')
    expect(digital).toHaveAttribute('data-orbit-digital', '')
  })

  it('@s5 el Logo por defecto (sin animated) no emite ningún hook de dibujo', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    // Contenedor (padre del SVG) sin activador de animación.
    expect(svg?.parentElement).not.toHaveAttribute('data-logo-anim')
    // Ningún data-orbit-* en el SVG ni en el wordmark.
    for (const hook of [
      'data-orbit-ring',
      'data-orbit-wave',
      'data-orbit-dot-outline',
      'data-orbit-dot-fill',
      'data-orbit-cenit',
      'data-orbit-digital',
    ]) {
      expect(container.querySelector(`[${hook}]`)).toBeNull()
    }
    // El punto cénit es un único <circle> relleno, sin círculo de contorno.
    const dots = svg?.querySelectorAll('circle[cx="40"][cy="20"]')
    expect(dots).toHaveLength(1)
    expect(dots?.[0]).toHaveAttribute('fill', 'var(--color-zenith)')
  })
})
