# Bitácora TDD — #15 `servicios_scroll_reveal`

> Un test a la vez: Rojo → Verde → Refactor. Deriva de
> `features/servicios_scroll_reveal.feature` (14 escenarios @s1..@s14) y del
> contrato `project-spec.md` #15 (D1..D7, R1..R6, CO1..CO6).

**Entorno de test:** jsdom NO define `IntersectionObserver` → el guard SSR se
cumple de base. El fake controlable se inyecta con `vi.stubGlobal` (al estilo del
`fakeMatchMedia` de `useIsMobile.test.tsx`).

**Baseline:** 180 tests verdes. **Final:** 194 tests verdes (14 nuevos),
typecheck y lint 0/0, mutación **100 %** sobre `useReveal.ts` y `Servicios.tsx`
(0 supervivientes; 57 killed + 10 timeout).

## Ficheros

- **Nuevo** `src/lib/useReveal.ts` — hook cliente SSR-safe (lógica pura, sin JSX).
- **Nuevo** `src/lib/useReveal.test.tsx` — @s1..@s6 (fake IntersectionObserver).
- **Nuevo** `src/components/Servicios.reveal.test.tsx` — @s7..@s14 (SCSS por
  contenido + integración con el `Servicios` real).
- **Tocado** `src/components/Servicios.module.scss` — animación gateada (R1..R3).
- **Tocado** `src/components/Servicios.tsx` — cablea `useReveal` (`ref={rows}`) y
  envuelve el mockup en `.mockup`. Contenido intacto.

## Ciclos (Rojo → Verde → Refactor)

### Hook `useReveal` (IntersectionObserver mockeado)

- **@s1** ROJO: import de `useReveal` inexistente (no compila). VERDE: hook que
  solo devuelve el `ref` (mínimo: @s1 solo asevera que NO arma nada).
- **@s2** ROJO: sin efecto, el contenedor no recibe `data-reveal`. VERDE:
  `useEffect` con guard `!root` (defensivo, `// Stryker disable next-line all`)
  + guard `typeof IntersectionObserver === 'undefined'` + `setAttribute('data-reveal','')`.
  El guard SSR nace aquí para no romper @s1. (@s2 asevera además `getAttribute === ''`
  → mata el mutante de valor de `setAttribute`.)
- **@s3** ROJO: no se construye observer (`io.last()` undefined). VERDE:
  `new IntersectionObserver(() => {}, { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0 })`
  + bucle `observe`. Asevera cuenta N, `rootMargin`, `threshold` y el literal
  exacto `'-40% 0px -40% 0px'`.
- **@s4** ROJO: callback vacío, la fila no gana `data-in-view`. VERDE: el callback
  `toggleAttribute('data-in-view', entry.isIntersecting)`.
- **@s5** ROJO (triangulación): debilité el toggle a `true` fijo → @s4 sigue
  verde pero @s5 (emitir `false`) falla. VERDE: generalizo a `entry.isIntersecting`
  → mata el mutante "siempre true".
- **@s6** ROJO: sin cleanup, `disconnect` no se llama. VERDE:
  `return () => observer.disconnect()`.
- REFACTOR (en verde): JSDoc del hook explicando `data-reveal`/`data-in-view` e
  hidratación sin mismatch. Sin cambio de comportamiento.

### SCSS module `Servicios.module.scss` (contenido, leyendo el fichero)

- **@s8** ROJO: no existe el bloque `@media (prefers-reduced-motion: no-preference)`
  (`block()` lanza). VERDE: estado oculto de `.card`/`.mockup`/`.example`
  (`opacity: 0` + `translate…`) gateado bajo `[data-reveal] .row:not([data-in-view])`.
- **@s7** VERDE (guard R1): tras @s8, el CSS base (quitando los bloques
  no-preference) no hornea `opacity: 0` ni `translateX/Y`. Documenta R1.
- **@s9** ROJO: no hay `transition`. VERDE: `transition` solo de `opacity` y
  `transform` (1.2s, easing suave) para las tres piezas.
- **@s10** ROJO: no hay `transition-delay`. VERDE: stagger `0s → 0.18s → 0.36s`
  (`.card` → mockup → `.example`).
- **@s11** ROJO: no existe la regla par. VERDE: inversión horizontal colgada de
  `.row:nth-child(even):not([data-in-view])` (zig-zag gratis, sin `data-dir`).
- **@s12** VERDE (guard CO5): no hay bloque `prefers-reduced-motion: reduce`; con
  el bloque no-preference quitado no queda `transition` que apagar.
- **@s13** ROJO: `.services` sin `overflow-x`. VERDE: `overflow-x: clip` +
  bloque `@media (…no-preference) and (max-width: 880px)` con `translateY`
  (fallback vertical, 0 scroll horizontal).

### Integración (componente real)

- **@s14** ROJO: `.rows` no recibe `data-reveal` (ref sin cablear). VERDE: se
  importa/usa `useReveal`, `ref={rows}` en `.rows` y se envuelve el mockup en
  `<div className={styles.mockup}>`. Asevera: (1) 6 títulos/tags/ejemplos
  intactos, (2) `data-reveal` en `.rows` (mata el mutante que quite el ref),
  (3) 6 filas observadas, (4) wrapper con clase `/mockup/` (mata el mutante que
  borre `styles.mockup`), (5) emitir intersección → `data-in-view`.

## Trazabilidad (@s → test)

| @s   | Test |
| ---- | ---- |
| @s1  | `src/lib/useReveal.test.tsx` › `@s1 sin IntersectionObserver no arma nada…` |
| @s2  | `src/lib/useReveal.test.tsx` › `@s2 arma el contenedor con data-reveal…` |
| @s3  | `src/lib/useReveal.test.tsx` › `@s3 observa cada hija con la banda central…` |
| @s4  | `src/lib/useReveal.test.tsx` › `@s4 conmuta data-in-view al entrar…` |
| @s5  | `src/lib/useReveal.test.tsx` › `@s5 bidireccional: pierde y recupera…` |
| @s6  | `src/lib/useReveal.test.tsx` › `@s6 desconecta el observer al desmontar…` |
| @s7  | `src/components/Servicios.reveal.test.tsx` › `@s7 R1: el estado base es el final visible…` |
| @s8  | `src/components/Servicios.reveal.test.tsx` › `@s8 el estado oculto vive bajo data-reveal…` |
| @s9  | `src/components/Servicios.reveal.test.tsx` › `@s9 solo se animan opacity y transform…` |
| @s10 | `src/components/Servicios.reveal.test.tsx` › `@s10 stagger: los delays crecen…` |
| @s11 | `src/components/Servicios.reveal.test.tsx` › `@s11 la inversión horizontal cuelga de :nth-child(even)…` |
| @s12 | `src/components/Servicios.reveal.test.tsx` › `@s12 prefers-reduced-motion: reduce no oculta ni anima…` |
| @s13 | `src/components/Servicios.reveal.test.tsx` › `@s13 .services usa overflow-x: clip…` |
| @s14 | `src/components/Servicios.reveal.test.tsx` › `@s14 contenido intacto + cableado del reveal…` |

## Notas de mutación (100 %)

- `REVEAL_ROOT_MARGIN` literal + `rootMargin`/`threshold` del observer → @s3.
- `setAttribute('data-reveal','')` presencia **y** valor vacío → @s2.
- `toggleAttribute('data-in-view', entry.isIntersecting)` (flip/removal) → @s4/@s5.
- Bucle `observe` (cuenta) → @s3; `disconnect()` → @s6; guard SSR → @s1.
- `ref={rows}` y wrapper `.mockup` en `Servicios.tsx` → @s14 (puntos 2 y 4).
- `if (!root) return`: defensivo no observable → `// Stryker disable next-line all`
  (mismo recurso que `Logo.tsx`).

## Refinamiento de temporización (2026-07-09, sobre PR #6)

Pablo pidió "más tiempo" en la animación y eligió el objetivo **cinematográfico**.
Cambio SOLO de valores en `Servicios.module.scss` (contrato @s1..@s14 intacto):

- Duración de la transición **1.2s → 2.8s** (opacity + transform; mismo easing
  `cubic-bezier(0.22, 1, 0.36, 1)`).
- Stagger **0.18s/0.36s → 0.4s/0.8s** (`.card` 0s → mockup 0.4s → `.example` 0.8s);
  revelado total de la fila ~3.6s.

Se **reforzó @s10** (Rojo con los valores viejos → Verde tras el cambio): ahora
PINEA la duración `2.8s` (opacity y transform, y `not 1.2s`) y los delays exactos
`0.4s`/`0.8s`, además de mantener el orden creciente. Así la duración queda como
contrato testeado (antes no lo estaba). Mutación **N/A** (solo SCSS + test de
contenido; no se toca ningún `.tsx`/`.ts` de la lista `mutate` de Stryker).
