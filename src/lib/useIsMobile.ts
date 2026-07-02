import { useSyncExternalStore } from 'react'

/** Punto de corte "móvil": coincide con el @media del layout. */
export const MOBILE_QUERY = '(max-width: 767px)'

/** Se suscribe a los cambios de la media query y devuelve la baja. */
export function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

/** Lectura síncrona en cliente: ¿estamos en viewport móvil? */
export function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches
}

/** En servidor (SSG/prerender) no hay viewport: asumimos escritorio. */
export function getServerSnapshot(): boolean {
  return false
}

/**
 * ¿El viewport es de móvil? Dirigido por JS (no solo `@media`) para que la
 * decisión de render sea testeable y determinista con `matchMedia` mockeado.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
