import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// El <Head> real depende del contexto SSG de react-helmet-async. Se sustituye
// por un passthrough que vuelca sus hijos al DOM para poder leer el <title>.
vi.mock('vite-react-ssg', () => ({
  Head: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

import Home from './home'
import { SITE } from '../lib/site'

describe('Home — SEO', () => {
  it('@s3 el <title> es exactamente "Cénit Digital — Soluciones digitales para pymes"', () => {
    render(<Home />)

    expect(document.title).toBe('Cénit Digital — Soluciones digitales para pymes')
  })

  it('expone la meta description con el texto real del sitio', () => {
    render(<Home />)

    const meta = document.querySelector('meta[name="description"]')
    expect(meta).toHaveAttribute('content', SITE.description)
  })

  it('declara el canonical y el og:url de la home apuntando a la raíz', () => {
    render(<Home />)

    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.cenitdigital.es/',
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://www.cenitdigital.es/',
    )
  })

  it('expone las etiquetas Open Graph y Twitter de la home', () => {
    render(<Home />)

    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute('content', 'website')
    expect(document.querySelector('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Cénit Digital',
    )
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute('content', 'es_ES')
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Cénit Digital — Soluciones digitales para pymes',
    )
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      SITE.description,
    )
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary',
    )
  })

  it('incluye un JSON-LD Organization con los datos reales del sitio', () => {
    render(<Home />)

    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const data = JSON.parse(script?.textContent ?? '{}')
    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cénit Digital',
      url: 'https://www.cenitdigital.es',
      description: SITE.description,
    })
  })
})
