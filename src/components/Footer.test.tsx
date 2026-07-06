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
})
