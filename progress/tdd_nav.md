# TDD — feature #2 `nav` (Navegación de la cabecera, WEB-4)

Contrato: `features/nav.feature` (@s1..@s9), aprobado por Pablo en la puerta.
Nota de la puerta: el panel móvil lista los **cuatro** enlaces en orden de
escritorio (Servicios, Sectores, Paquetes, Contacto).

## Diseño (para testeabilidad y mutación)

- `src/lib/nav.ts` — datos puros: `NAV_LINKS` (4) + `CTA_LINK` ("Hablamos" →
  `#contacto`). Sin JSX. Los componentes lo consumen.
- `src/lib/useIsMobile.ts` — responsive dirigido por JS con
  `useSyncExternalStore` sobre `window.matchMedia(MOBILE_QUERY)`. Expone
  `subscribe` / `getSnapshot` / `getServerSnapshot` para test directo y
  mutación 100%.
- `src/components/MobileMenu.tsx` — panel con Radix `Dialog` (abrir/cerrar ✕/
  cerrar al pulsar enlace/cerrar en fondo).
- `src/components/HeaderNav.tsx` — conmuta desktop nav ↔ MobileMenu según
  `useIsMobile()`.
- `src/components/Header.tsx` — reescrito: marca (@s1), sticky (@s4),
  `<HeaderNav/>`, y **preserva** `ThemeToggle` (isla ClientOnly, feature #3).
  Deja de importar `ContactDialog` (superado por el contrato de nav).

Glob `mutate`: `nav.ts`, `useIsMobile.ts`, `HeaderNav.tsx`, `MobileMenu.tsx`
(+ se conserva `seo.ts` de la feature 1). `Header.tsx` queda fuera del glob:
tras la reescritura es composición estática (sin lógica condicional); la isla
`ClientOnly(ThemeToggle)` generaría mutantes intestables aquí y ThemeToggle es
de otra feature (no se testea en nav).

## Bitácora de ciclos (Rojo → Verde → Refactor)

Spike previo (desechado): confirmé que en este entorno los CSS Modules
resuelven a clases hasheadas (`_header_xxxxx`, contienen el nombre local) y que
jsdom actualiza `window.location.hash` al pulsar un `<a href="#…">`. Con eso
diseñé las aserciones de @s3/@s7 (hash) y @s4 (sin depender de layout).

1. **@s2 (datos)** — `src/lib/nav.test.ts` rojo (módulo inexistente) →
   `src/lib/nav.ts` con `NAV_LINKS` (4) + `CTA_LINK`. Verde.
2. **useIsMobile · getServerSnapshot** — rojo (import) → `getServerSnapshot()`
   `=> false`. Verde. (Reduje el módulo a lo probado tras un exceso inicial de
   producción, para que cada trozo naciera de un rojo.)
3. **useIsMobile · getSnapshot** — rojo (`getSnapshot` no existía) → lee
   `matchMedia(MOBILE_QUERY).matches`. Verde. Fake de `matchMedia` con
   `matches` sólo si la query coincide (mata el literal de la query).
4. **useIsMobile · subscribe** — rojo → alta/baja en `'change'`. Verde
   (test verifica alta, aviso y que la baja deja de avisar).
5. **useIsMobile · hook** — rojo → `useSyncExternalStore(subscribe, getSnapshot,
   getServerSnapshot)`. Verde (probe reacciona al cambio de viewport).
6. **@s5 panel abre + 4 enlaces** — `MobileMenu.test.tsx` rojo → `MobileMenu`
   (Radix `Dialog`: trigger "☰"/aria "Abrir menú", panel "Menú", 4 enlaces de
   `NAV_LINKS`). Verde. Reduje el componente al mínimo de @s5 tras un exceso
   inicial (había añadido ✕/overlay/close antes de sus tests).
7. **@s6 cerrar con ✕** — rojo (sin botón "Cerrar menú") → `Dialog.Close` "✕".
   Verde.
8. **@s7 enlace cierra + navega** — rojo (el panel seguía abierto) → envolver
   cada enlace en `Dialog.Close asChild`. Verde (hash `#paquetes`).
9. **@s8 fondo cierra** — rojo (sin overlay) → `Dialog.Overlay`
   (`data-testid`). Verde.
10. **@s2 nav escritorio** — `HeaderNav.test.tsx` rojo → `HeaderNav` con nav de
    escritorio (4 enlaces + CTA) desde `nav.ts`. Verde.
11. **@s3 desplazamiento** — `it.each` de los 4 ejemplos; el mecanismo de ancla
    del ciclo 10 ya lo satisface (test de caracterización). Verde.
12. **@s9 escritorio oculta menú** — verde con impl. actual (aún sin conmutar).
13. **@s5 móvil muestra menú** — rojo (no había botón de menú en móvil) →
    introducir la rama `useIsMobile() ? <MobileMenu/> : <nav/>`. Verde.
14. **@s1 logo → "/"** y **@s4 sticky** — `Header.test.tsx`. Ambos verdes contra
    el Header de la feature 1 (comportamiento preexistente: marca y
    `position: sticky`). Tests de caracterización que bloquean la regresión;
    no exigieron producción nueva.
15. **Reescritura de `Header`** (refactor en verde): monta `<HeaderNav/>`, deja
    de importar `ContactDialog`, **preserva** `ThemeToggle` (isla ClientOnly);
    limpio el `.nav` muerto de `Header.module.scss`. Suite completa en verde.

16. **Ciclo extra (mutación) — matar superviviente en `useIsMobile.ts:4`** —
    El `mutation_tester` reportó 1 superviviente (score 97.37% < `break: 100`):
    StringLiteral `MOBILE_QUERY = '(max-width: 767px)'` → `""`. Causa raíz:
    **tautología** en el fake de `useIsMobile.test.tsx`, que comparaba
    `query === MOBILE_QUERY` (símbolo importado); al mutar la constante, tanto
    producción como la expectativa del test se movían en bloque y `matches`
    seguía coincidiendo. Arreglo: anclar el fake al **literal codificado**
    `query === '(max-width: 767px)'` (y actualizar el comentario, ahora
    verdadero). Verifiqué que el test muerde: con `MOBILE_QUERY = ''` en el
    fuente, la suite se pone roja en `@s5 getSnapshot … (true en móvil)`,
    `@s5 useIsMobile es true en viewport móvil` y `@s9 … reacciona al cambio`;
    restauré el literal → verde (26 tests). Así el mutante `MOBILE_QUERY = ""`
    queda muerto (`matchMedia("")` → fake `false` → tests de móvil fallan).

## Nota de interpretación del contrato

El CTA "Hablamos" se implementa como enlace (`<a href="#contacto">`) con estilo
de botón: el contrato pide "botón … apuntando a #contacto" y un anclaje
in-page es semánticamente un enlace. Se testea por `role="link"` con nombre
"Hablamos" y `href="#contacto"`.

## Trazabilidad @s → test

- **@s1** (logo → "/") → `Header.test.tsx` › `@s1 el logotipo "CÉNIT DIGITAL"
  enlaza a "/"`.
- **@s2** (nav escritorio + CTA) → `lib/nav.test.ts` › `@s2 NAV_LINKS …` y
  `@s2 CTA_LINK …`; `HeaderNav.test.tsx` › `@s2 en escritorio muestra los 4
  enlaces … y el CTA "Hablamos" → #contacto`.
- **@s3** (cada enlace desplaza) → `HeaderNav.test.tsx` › `it.each … @s3 pulsar
  "%s" desplaza a la sección "%s"` (Servicios/Sectores/Paquetes/Contacto).
- **@s4** (cabecera sticky) → `Header.test.tsx` › `@s4 la cabecera es fija …
  (sticky)` (clase aplicada + `position: sticky; top: 0` en el módulo).
- **@s5** (menú abre + 4 enlaces) → `MobileMenu.test.tsx` › `@s5 el botón de
  menú abre el panel con los 4 enlaces en orden`; `HeaderNav.test.tsx` › `@s5
  en móvil muestra el botón de menú y oculta la nav de escritorio`; base de
  responsive en `lib/useIsMobile.test.tsx` (`@s5 getSnapshot …`, `@s5 subscribe
  …`, `@s5 useIsMobile es true en viewport móvil`).
- **@s6** (✕ cierra) → `MobileMenu.test.tsx` › `@s6 el botón "✕" cierra el
  panel`.
- **@s7** (enlace cierra + navega) → `MobileMenu.test.tsx` › `@s7 pulsar un
  enlace del panel lo cierra y navega a su sección`.
- **@s8** (fondo cierra) → `MobileMenu.test.tsx` › `@s8 pulsar el fondo
  oscurecido cierra el panel`.
- **@s9** (menú sólo en móvil / escritorio ve la nav) → `HeaderNav.test.tsx` ›
  `@s9 en escritorio no hay botón de menú y sí la nav de escritorio`; base en
  `lib/useIsMobile.test.tsx` (`@s9 getServerSnapshot …`, `@s9 getSnapshot …`,
  `@s9 useIsMobile es false … reacciona al cambio`).

## Estado

`pnpm typecheck`, `pnpm lint`, `pnpm test` en verde (26 tests, 0 warnings).
Glob `mutate` de Stryker ampliado a `nav.ts`, `useIsMobile.ts`, `HeaderNav.tsx`,
`MobileMenu.tsx` (conserva `seo.ts`). `Header.tsx` queda fuera del glob
(composición estática; la isla `ClientOnly(ThemeToggle)` de otra feature
generaría mutantes intestables aquí). Mutación pendiente del `mutation_tester`.
