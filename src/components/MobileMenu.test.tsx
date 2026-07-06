import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MobileMenu from './MobileMenu'

describe('MobileMenu', () => {
  it('@s5 el botón "Menú" abre el panel con los 4 enlaces en orden', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'Menú' })
    expect(trigger).toHaveTextContent('☰')
    await user.click(trigger)

    const panel = screen.getByRole('dialog', { name: 'Menú' })
    const labels = within(panel)
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(labels).toEqual(['Servicios', 'Sectores', 'Paquetes', 'Contacto'])
  })

  it('@s6 el botón "Cerrar" cierra el panel', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Menú' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const close = screen.getByRole('button', { name: 'Cerrar' })
    expect(close).toHaveTextContent('✕')
    await user.click(close)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('@s7 pulsar el enlace "Servicios" del panel lo cierra', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Menú' }))

    const panel = screen.getByRole('dialog')
    await user.click(within(panel).getByRole('link', { name: 'Servicios' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('@s8 pulsar el fondo oscurecido (overlay) cierra el panel', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Menú' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByTestId('mobile-menu-overlay'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
