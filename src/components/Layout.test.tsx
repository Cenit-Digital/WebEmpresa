import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

// El <Head> de vite-react-ssg depende del contexto de react-helmet-async, ajeno
// al comportamiento de foco que verifican estos escenarios. Se neutraliza.
vi.mock('vite-react-ssg', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vite-react-ssg')>()
  return {
    ...actual,
    Head: () => null,
  }
})

import Layout from './Layout'

/** matchMedia estático: el Header interior lo consulta para el viewport móvil. */
function mockMatchMedia(mobile: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: mobile,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

function renderLayout() {
  mockMatchMedia(false)
  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  )
}

describe('Layout — accesibilidad', () => {
  it('@s1 el primer elemento enfocable es el enlace "Saltar al contenido"', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.tab()

    const skip = screen.getByRole('link', { name: 'Saltar al contenido' })
    expect(document.activeElement).toBe(skip)
  })

  it('@s2 activar el enlace de salto mueve el foco al destino #contenido', async () => {
    const user = userEvent.setup()
    renderLayout()

    const skip = screen.getByRole('link', { name: 'Saltar al contenido' })
    skip.focus()
    await user.keyboard('{Enter}')

    const main = document.getElementById('contenido')
    expect(document.activeElement).toBe(main)
  })

  it('@s2 activar el enlace no lanza si #contenido no existe (?. defensivo)', () => {
    renderLayout()

    // Se retira el id destino (sin desmontar el nodo, para no corromper el árbol
    // de React): `getElementById('contenido')` pasa a devolver null. El
    // encadenamiento opcional debe evitar llamar a focus() sobre null.
    const main = document.getElementById('contenido')
    if (main) main.id = 'contenido-ausente'
    const skip = screen.getByRole('link', { name: 'Saltar al contenido' })

    // React no propaga la excepción del handler de forma síncrona: la reporta
    // como evento 'error' de window. Sin el `?.`, focus() sobre null lanzaría y
    // dispararía este listener.
    const onError = vi.fn()
    window.addEventListener('error', onError)
    fireEvent.click(skip)
    window.removeEventListener('error', onError)

    expect(onError).not.toHaveBeenCalled()
  })
})
