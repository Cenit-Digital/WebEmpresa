import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

describe('Footer', () => {
  it('@s1 el copyright muestra "© " + año actual + "Cénit Digital" (año dinámico)', () => {
    const year = new Date().getFullYear()
    renderFooter()

    expect(
      screen.getByText(`© ${year} Cénit Digital. Todos los derechos reservados.`),
    ).toBeInTheDocument()
  })

  it('§6 muestra la marca "Órbita" (logo) a 38px en el pie', () => {
    const { container } = renderFooter()

    const mark = container.querySelector('svg')
    expect(mark).toHaveAttribute('width', '38')
    expect(mark).toHaveAttribute('height', '38')
    expect(screen.getByText('cénit')).toBeInTheDocument()
  })

  it('@s2 el enlace "Aviso legal" apunta a /aviso-legal dentro del nav "Pie"', () => {
    renderFooter()

    const nav = screen.getByRole('navigation', { name: 'Pie' })
    const legal = screen.getByRole('link', { name: 'Aviso legal' })
    expect(nav).toContainElement(legal)
    expect(legal).toHaveAttribute('href', '/aviso-legal')
  })

  it('@s3 el enlace de correo apunta a mailto:hola@cenitdigital.es', () => {
    renderFooter()

    const mail = screen.getByRole('link', { name: 'hola@cenitdigital.es' })
    expect(mail).toHaveAttribute('href', 'mailto:hola@cenitdigital.es')
  })

  it('@s4 no existen enlaces "Privacidad" ni "Cookies"', () => {
    renderFooter()

    expect(screen.queryByRole('link', { name: /privacidad/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /cookies/i })).not.toBeInTheDocument()
  })

  // Feature #14 · el logo del pie NO se anima (fuera de alcance): monta `<Logo />`
  // sin la prop `animated`, así que no debe emitir ningún hook de dibujo.
  it('@s5 el Logo del pie permanece estático (no-regresión de la animación #14)', () => {
    const { container } = renderFooter()
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()

    // El contenedor del logo (padre del SVG) no tiene el activador de animación.
    expect(svg?.parentElement).not.toHaveAttribute('data-logo-anim')

    // Ningún data-orbit-* en el logo del pie.
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

    // El punto cénit sigue siendo un único <circle> relleno, sin contorno.
    const dots = svg?.querySelectorAll('circle[cx="40"][cy="20"]')
    expect(dots).toHaveLength(1)
    expect(dots?.[0]).toHaveAttribute('fill', 'var(--color-zenith)')
  })
})
