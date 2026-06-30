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
