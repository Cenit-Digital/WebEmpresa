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
    expect(first).toBeTruthy()
    expect(second).toBeTruthy()
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
