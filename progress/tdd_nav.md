# TDD — feature #2 `nav` (Navegación de la cabecera, WEB-4)

Contrato **vigente**: `features/nav.feature` (@s1..@s8), reabierto y aprobado en
la puerta humana. Sustituye al contrato anterior (@s1..@s9, botón "Abrir menú",
cierre "Cerrar menú"/"✕", CTA "botón", escenario extra de desplazamiento por
ancla). Esta sesión **re-alinea** la implementación existente al nuevo contrato:
se reutilizan los componentes y se adaptan nombres accesibles y aserciones.

## Diseño (para testeabilidad y mutación)

- `src/lib/nav.ts` — datos puros: `NAV_LINKS` (Servicios/Sectores/Paquetes/
  Contacto, en orden) + `CTA_LINK` ("Hablamos" → `#contacto`). Sin JSX. Los
  componentes de escritorio y móvil los consumen (misma lista, mismo orden).
- `src/lib/useIsMobile.ts` — responsive dirigido por JS con
  `useSyncExternalStore` sobre `window.matchMedia(MOBILE_QUERY)`
  (`'(max-width: 767px)'`; 375px cae en móvil). Expone `subscribe` /
  `getSnapshot` / `getServerSnapshot` para test directo y mutación.
- `src/components/MobileMenu.tsx` — panel con Radix `Dialog`: trigger con
  nombre accesible **"Menú"** (@s4/@s5), cierre por botón **"Cerrar"** (@s6),
  cierre al pulsar un enlace (@s7) y cierre por overlay (@s8).
- `src/components/HeaderNav.tsx` — conmuta nav de escritorio ↔ `MobileMenu`
  según `useIsMobile()`: en móvil la nav "Principal" no se monta (@s4), en
  escritorio no aparece el botón "Menú" (@s2).
- `src/components/Header.tsx` — marca enlazada a "/" (@s1), cabecera sticky
  (@s3), `<HeaderNav/>`, y **preserva** `ThemeToggle` (isla `ClientOnly`,
  feature #3) y el `Logo` "Órbita" (feature #12).

## Delta respecto al contrato anterior (qué cambió en esta re-alineación)

| Escenario | Antes | Ahora (contrato @s1..@s8) |
| --------- | ----- | ------------------------- |
| Sticky    | `@s4` | **`@s3`** (position: sticky; top: 0) |
| Móvil     | `@s5` botón "Abrir menú" | **`@s4`** botón nombre accesible **"Menú"** + nav de escritorio no visible |
| Abrir     | `@s5` "Abrir menú" | **`@s5`** botón **"Menú"** abre panel, 4 enlaces en orden |
| Cerrar    | `@s6` "Cerrar menú" ("✕") | **`@s6`** botón nombre accesible **"Cerrar"** |
| Enlace    | `@s7` cierra **y navega** (`#paquetes`) | **`@s7`** pulsar "Servicios" **cierra** (el contrato ya no exige el hash) |
| Overlay   | `@s8` | **`@s8`** (sin cambios funcionales) |
| Desktop-only / desplazamiento por ancla (`@s3`, `@s9` antiguos) | escenarios propios | **eliminados** del contrato; sus tests se retiran o se re-etiquetan a `@s2`/`@s4` |

Producción tocada: `MobileMenu.tsx` (aria-labels `Abrir menú`→`Menú`,
`Cerrar menú`→`Cerrar`). El CTA "Hablamos" ya era un `<a href="#contacto">`
(enlace), que es justo lo que pide el nuevo `@s2` ("existe un enlace").

## Bitácora de ciclos (Rojo → Verde → Refactor)

Cada ciclo: se re-escribe/re-etiqueta el test al nuevo `@s` (Rojo cuando la
aserción diverge de la producción vigente) y se adapta el mínimo de producción.

1. **@s1 (logo → "/")** — `Header.test.tsx` verifica que la marca es un enlace
   con `href="/"` y nombre accesible "Cénit Digital … inicio". Verde contra el
   `Header` existente (comportamiento preservado; no exige producción nueva).
2. **@s2 (datos de nav)** — `lib/nav.test.ts`: `NAV_LINKS` (4, en orden) y
   `CTA_LINK` ("Hablamos"/`#contacto`). Verde (datos ya conformes).
3. **@s2 (nav de escritorio)** — `HeaderNav.test.tsx`: la nav "Principal" lista
   los 4 enlaces con sus anclas **y** el CTA "Hablamos" → `#contacto`, en ese
   orden; y **no** aparece el botón "Menú". Verde.
4. **@s3 (cabecera sticky)** — `Header.test.tsx` re-etiquetado de `@s4`→`@s3`.
   jsdom no hace layout: se lee `Header.module.scss` con `readFileSync` y se
   asertan `position: sticky` y `top: 0` (patrón del repo). Verde.
5. **@s4 (móvil oculta escritorio + botón "Menú")** — `HeaderNav.test.tsx`
   re-etiquetado de `@s5`→`@s4`: con `matchMedia` móvil, existe el botón nombre
   accesible **"Menú"** y la nav "Principal" **no** está en el documento. Rojo
   contra el `aria-label="Abrir menú"` anterior → se renombra a **"Menú"** en
   `MobileMenu.tsx`. Verde. Base responsive en `lib/useIsMobile.test.tsx`
   (`@s4 getSnapshot true`, `@s4 subscribe`, `@s4 useIsMobile true`).
6. **@s5 (abrir panel + 4 enlaces en orden)** — `MobileMenu.test.tsx`: pulsar
   **"Menú"** abre el `dialog` con `['Servicios','Sectores','Paquetes',
   'Contacto']`. Rojo por el nombre del trigger → Verde con `aria-label="Menú"`.
7. **@s6 (cerrar con "Cerrar")** — `MobileMenu.test.tsx`: el botón nombre
   accesible **"Cerrar"** cierra el panel. Rojo contra `"Cerrar menú"` anterior
   → se renombra el `Dialog.Close` a `aria-label="Cerrar"`. Verde.
8. **@s7 (enlace cierra el panel)** — `MobileMenu.test.tsx`: pulsar el enlace
   "Servicios" del panel quita el `dialog` del documento. El nuevo contrato ya
   **no** exige comprobar el hash; se retira esa aserción. Verde (cada enlace va
   envuelto en `Dialog.Close asChild`).
9. **@s8 (fondo cierra el panel)** — `MobileMenu.test.tsx`: pulsar el overlay
   (`data-testid="mobile-menu-overlay"`) quita el `dialog` del documento. Verde.
10. **Refactor en verde** — se retiran del suite los tests del contrato anterior
    sin escenario vigente (desplazamiento por ancla `@s3` antiguo, `@s9`
    escritorio-oculta-menú), plegando "no aparece el botón Menú" dentro de
    `@s2`. Se re-etiquetan los tests de `useIsMobile` (`@s9`→`@s2` para
    escritorio, `@s5`→`@s4` para móvil). Suite completa en verde.

## Nota de interpretación del contrato

- El CTA "Hablamos" se implementa como enlace (`<a href="#contacto">`) con
  estilo de botón: el nuevo `@s2` pide literalmente "existe un **enlace**
  'Hablamos'". Se testea por `role="link"` con nombre "Hablamos" y
  `href="#contacto"`.
- `@s3` exige `top` = `0px`. En SCSS se escribe `top: 0`, que computa a `0px`.
  Al no hacer jsdom layout, se asserta sobre la fuente del módulo (patrón del
  repo), no sobre `getComputedStyle`.
- `@s4` habla de 375px; el corte real es `matchMedia('(max-width: 767px)')`, que
  incluye 375px. La decisión se dirige por JS para ser determinista en test.

## Trazabilidad @s → test

- **@s1** (logo → "/") → `Header.test.tsx` › `@s1 el logotipo enlaza a "/"
  (inicio)`.
- **@s2** (nav escritorio + CTA) → `lib/nav.test.ts` › `@s2 NAV_LINKS …` y
  `@s2 CTA_LINK …`; `HeaderNav.test.tsx` › `@s2 en escritorio muestra los 4
  enlaces … y el CTA "Hablamos" → #contacto` y `@s2 en escritorio no aparece el
  botón de menú móvil`; base en `lib/useIsMobile.test.tsx`
  (`@s2 getServerSnapshot …`, `@s2 getSnapshot … escritorio`).
- **@s3** (cabecera sticky) → `Header.test.tsx` › `@s3 la cabecera es fija …
  (position: sticky; top: 0)`.
- **@s4** (móvil oculta escritorio + botón "Menú") → `HeaderNav.test.tsx` ›
  `@s4 en móvil se oculta la nav de escritorio y aparece el botón "Menú"`; base
  en `lib/useIsMobile.test.tsx` (`@s4 getSnapshot … móvil`, `@s4 subscribe …`,
  `@s4 useIsMobile es true …`, `@s4 useIsMobile es false … reacciona al cambio`).
- **@s5** (abrir panel + 4 enlaces en orden) → `MobileMenu.test.tsx` › `@s5 el
  botón "Menú" abre el panel con los 4 enlaces en orden`.
- **@s6** (cerrar con "Cerrar") → `MobileMenu.test.tsx` › `@s6 el botón "Cerrar"
  cierra el panel`.
- **@s7** (enlace cierra el panel) → `MobileMenu.test.tsx` › `@s7 pulsar el
  enlace "Servicios" del panel lo cierra`.
- **@s8** (fondo cierra el panel) → `MobileMenu.test.tsx` › `@s8 pulsar el fondo
  oscurecido (overlay) cierra el panel`.

## Stryker (mutación)

Glob `mutate` incluye la lógica mutable de la feature: `src/lib/nav.ts`,
`src/lib/useIsMobile.ts`, `src/components/HeaderNav.tsx`,
`src/components/MobileMenu.tsx`. No hay archivos nuevos que añadir en esta
re-alineación. `Header.tsx` queda fuera del glob (composición estática; la isla
`ClientOnly(ThemeToggle)`, de otra feature, generaría mutantes intestables).

## Refactor en verde (fidelidad al Design System §6/§7)

- `Header.module.scss`: la franja de nav usa **`--color-band`** y borde inferior
  **`--color-band-border`** (antes `--color-bg`/`--color-border`), fiel a §6.
  Conserva `position: sticky; top: 0` (exigido por @s3).
- `HeaderNav.module.scss`: CTA "Hablamos" primario → `color:
  var(--color-on-primary)` y `border-radius: var(--radius-pill)` (elimina el
  `#fff` y el `999px` sueltos; colores sólo vía `var(--color-…)`).

## Estado

`pnpm typecheck` (0), `pnpm lint` (0 warnings), `pnpm test` **64 verdes**
(baseline 68 − 4 tests del antiguo `@s3` de desplazamiento por ancla, fuera del
contrato nuevo; los `href` siguen cubiertos por `@s2`), `pnpm build` (SSG) verde.

Mutación *scoped* sobre `HeaderNav.tsx`, `MobileMenu.tsx`, `nav.ts`,
`useIsMobile.ts`: **100.00%** (28 killed + 4 timeout, 0 survived) — `break: 100`
satisfecho. `stryker.config.json` no tocado (ya mutaba estos ficheros).

Los 8 escenarios del nuevo contrato están cubiertos y mapeados arriba. No se
marca `done`: pendiente del `judge` y del `mutation_tester` global.
