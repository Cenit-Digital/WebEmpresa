import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import MobileMenu from './MobileMenu'

describe('MobileMenu', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('@s5 el botón de menú abre el panel con los 4 enlaces en orden', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'Abrir menú' })
    expect(trigger).toHaveTextContent('☰')
    await user.click(trigger)

    const panel = screen.getByRole('dialog', { name: 'Menú' })
    const labels = within(panel)
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(labels).toEqual(['Servicios', 'Sectores', 'Paquetes', 'Contacto'])
  })

  it('@s6 el botón "✕" cierra el panel', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const close = screen.getByRole('button', { name: 'Cerrar menú' })
    expect(close).toHaveTextContent('✕')
    await user.click(close)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('@s7 pulsar un enlace del panel lo cierra y navega a su sección', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))

    const panel = screen.getByRole('dialog')
    await user.click(within(panel).getByRole('link', { name: 'Paquetes' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.location.hash).toBe('#paquetes')
  })

  it('@s8 pulsar el fondo oscurecido cierra el panel', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)
    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByTestId('mobile-menu-overlay'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
