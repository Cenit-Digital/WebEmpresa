import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// El <Head> real depende del contexto SSG de react-helmet-async. Se sustituye
// por un passthrough que vuelca sus hijos al DOM para poder leer el <title>.
vi.mock('vite-react-ssg', () => ({
  Head: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

import Home from './home'

describe('Home — SEO', () => {
  it('@s3 el <title> es exactamente "Cénit Digital — Soluciones digitales para pymes"', () => {
    render(<Home />)

    expect(document.title).toBe('Cénit Digital — Soluciones digitales para pymes')
  })
})
