import { SITE } from './site'

/**
 * Construye el título para la etiqueta <title> de una página.
 *
 * - Sin argumento: solo el nombre del sitio.
 * - Con argumento no vacío: "<página> — <sitio>".
 */
export function buildPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return SITE.name
  }
  return `${pageTitle} — ${SITE.name}`
}

/**
 * Título de la home: "<sitio> — <tagline>".
 *
 * Orden inverso al de las páginas interiores (el nombre va primero) para que la
 * marca encabece el resultado de búsqueda de la portada.
 */
export function buildHomeTitle(): string {
  return `${SITE.name} — ${SITE.tagline}`
}
