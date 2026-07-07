import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// El <Head> real depende del contexto SSG de react-helmet-async. Se sustituye
// por un passthrough que vuelca sus hijos al DOM para poder leer el <title>.
vi.mock('vite-react-ssg', () => ({
  Head: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

import LegalNotice from './aviso-legal'

describe('LegalNotice — SEO', () => {
  it('@s4 el <title> es exactamente "Aviso legal — Cénit Digital"', () => {
    render(<LegalNotice />)

    expect(document.title).toBe('Aviso legal — Cénit Digital')
  })

  it('tiene su propia description, canonical y og:url de ruta (no los de la home)', () => {
    render(<LegalNotice />)

    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Aviso legal de Cénit Digital.',
    )
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.cenitdigital.es/aviso-legal',
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://www.cenitdigital.es/aviso-legal',
    )
  })
})
