import { useEffect, useRef } from 'react'

/** rootMargin de banda central: la fila cuenta SOLO al cruzar el centro del viewport. */
export const REVEAL_ROOT_MARGIN = '-40% 0px -40% 0px'

/**
 * Revela en scroll los hijos directos del contenedor referenciado. Arma
 * `data-reveal` en el contenedor (imperativo, en `useEffect`, no en el render:
 * sin mismatch de hidratación) y conmuta `data-in-view` en cada hijo según su
 * intersección con la banda central del viewport. Genérico vía `data-*`: no
 * conoce clases de estilo (cada sección decide su animación en su SCSS module).
 * SSR-safe: sin IntersectionObserver no arma nada (el contenido queda visible).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    // Stryker disable next-line all
    if (!root) return
    if (typeof IntersectionObserver === 'undefined') return
    const items = Array.from(root.children)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute('data-in-view', entry.isIntersecting)
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0 },
    )
    root.setAttribute('data-reveal', '')
    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [])
  return ref
}
