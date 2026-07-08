import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MobileMenu from './MobileMenu'

/** Lee el `z-index` numérico declarado en un bloque `.selector { … }`. */
function zIndexOf(scssPath: string, selector: string): number {
  const scss = readFileSync(resolve(process.cwd(), scssPath), 'utf8')
  const match = scss.match(new RegExp(`\\.${selector}\\s*\\{[^}]*z-index:\\s*(\\d+)`))
  return match ? Number(match[1]) : Number.NaN
}

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

  it('@s5..@s8 el overlay y el panel se apilan por encima de la cabecera sticky', () => {
    // Con el panel abierto, overlay y panel deben pintar SOBRE la cabecera
    // sticky (z-index:50); si no, la cabecera oculta el título "Menú" y el ✕.
    const headerZ = zIndexOf('src/components/Header.module.scss', 'header')
    const overlayZ = zIndexOf('src/components/MobileMenu.module.scss', 'overlay')
    const panelZ = zIndexOf('src/components/MobileMenu.module.scss', 'panel')

    expect(headerZ).toBe(50)
    expect(overlayZ).toBeGreaterThan(headerZ)
    expect(panelZ).toBeGreaterThan(headerZ)
  })
})
