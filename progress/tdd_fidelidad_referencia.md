# Bitácora TDD — #13 `fidelidad_referencia`

> Un test a la vez, Rojo → Verde → Refactor. Todas las medidas/paths salen de
> la referencia (`project-spec.md` #13, verbatim). No se inventa nada.

**Feature:** #13 `fidelidad_referencia` (in_progress).
**Escenarios propios:** `features/fidelidad_referencia.feature` @s1–@s9.
**Parche de presentación:** `features/theme_selector.feature` @s3–@s5 (modelo de CICLO). @s1,@s2,@s6,@s7,@s8 NO cambian.

## Bitácora de ciclos

### Bloque 1 — `nextMode` puro en `src/lib/theme.ts` (soporte del ciclo)

- C1 ROJO: `nextMode('light')` en `theme.test.tsx` → `nextMode is not a function`.
  VERDE: `nextMode` con constante `'dark'` (Ley 3, fake mínimo).
- C2 ROJO: `nextMode('dark') === 'system'` falla (devolvía `'dark'`).
  VERDE: `if light → dark; else → system`.
- C3 ROJO: `nextMode('system') === 'light'` falla.
  VERDE + REFACTOR: `MODE_CYCLE: Record<ThemeMode,ThemeMode>` (light→dark, dark→system,
  system→light) y `nextMode = MODE_CYCLE[mode]`. Cada entrada es un valor distinto
  afirmado → muerde toda mutación del mapa.
- Resto de `theme.ts` INTACTO (comportamiento @s1,@s2,@s6,@s7,@s8 de theme_selector sin cambios).

### Bloque 2 — `ThemeToggle` (píldora radiogroup → botón único que cicla)

Reescrito `ThemeToggle.test.tsx` conservando el helper `fakeMatchMedia` con el
truco `DARK_QUERY` (query exacta) para no perder la mutación del listener de @s6.

- T1 ROJO (fidelidad @s1): `getAllByRole('button')` no encuentra ninguno (producción era
  radiogroup con `role=radio`). VERDE: `ThemeToggle` pasa a un único `<button>`,
  conservando `useState(getStoredMode)` + el `useEffect` (apply + listener en `system`).
  SCSS: `.button` 38×38, borde, radius 10, hover `--color-primary`, `:focus-visible`.
- T2 ROJO (fidelidad @s4): el nombre accesible era estático `Cambiar tema`; se exige que
  incluya el modo. VERDE: `MODE_LABEL` + `aria-label="Cambiar tema (actual: <Label>)"`
  (afirmación EXACTA → muerde prefijo y etiqueta).
- T3 ROJO (fidelidad @s3): no había SVG con `data-icon`. VERDE: `ThemeIcon` con SVGs
  inline verbatim (sol/luna/monitor), `data-icon` = nombre del icono; `MODE_ICON`
  mapea modo→icono. Atributos INLINE (no spread) para clonar la referencia y que
  Stryker no muerda literales de objeto plano (patrón `Logo`, JSX-attr exentos).
  Test afirma `data-icon` + recuento de formas (circle/line/path/rect) → muerde el
  `if (icon === …)` de selección.
- T4 ROJO (fidelidad @s2): sin `onClick`, tres clics no cambian el modo. VERDE: `onClick`
  = `setModeState(nextMode(mode))` (solo estado); el nombre cicla Claro→Oscuro→Sistema→Claro.
- T5 ROJO (theme_selector @s3): tras un clic a "Claro" el `data-theme` pasa a light (vía
  efecto) pero `localStorage` seguía null. VERDE: el `onClick` también llama `setMode(next)`
  → persiste. (data-theme ya lo aplicaba el efecto; el rojo cayó exacto en la persistencia.)
- Caracterización (comportamiento PRESERVADO de WEB-4, re-expresado vía ciclo; verde por
  diseño, cubren mutación del efecto + `DARK_QUERY`):
  - @s4(theme): ciclo hasta Oscuro → data-theme dark + localStorage dark.
  - @s5(theme): ciclo hasta Sistema (con clave `dark`, SO claro) → borra clave, sigue al SO.
  - @s7(theme): clave `dark` guardada → arranca en Oscuro, data-theme dark.
  - @s6(theme): en Sistema reacciona en vivo al cambio del SO (`emitChange`).
  - @s6(theme): fuera de Sistema `activeListeners()===0` y no reacciona (limpieza del listener).

`ThemeToggle.test.tsx`: 10 tests verdes.

### Bloque 3 — Cabecera a 2 grupos (`HeaderNav` + `Header`)

- HN-1 ROJO (fidelidad @s6): `HeaderNav` de escritorio no tenía botón de tema; el orden
  del clúster no incluía "TEMA" entre Contacto y Hablamos. VERDE: se inserta
  `<ClientOnly>{() => <ThemeToggle />}</ClientOnly>` ENTRE los enlaces y el CTA. El test
  recorre `nav.querySelectorAll('a, button')` y afirma el orden exacto
  `[Servicios, Sectores, Paquetes, Contacto, TEMA, Hablamos]`. El botón de tema es
  client-only → el test lo espera con `findByRole`.
  - No-regresión: @s2 (5 enlaces en orden, el tema NO es `link`) y @s4 (móvil: "Menú",
    sin nav "Principal") siguen verdes.
- Anti-regresión móvil (casos límite del contrato) ROJO→VERDE: revertí el móvil a
  `<MobileMenu/>` para forzar el rojo del test `@móvil` (el tema debe seguir visible junto
  a "Menú"); VERDE restaurando `<div class=mobile><ClientOnly>ThemeToggle</ClientOnly>
  <MobileMenu/></div>`. Así no se regresa la visibilidad del tema en móvil (antes la daba
  el toggle suelto de `Header`).
- H-1 ROJO (fidelidad @s5): `Header.inner` tenía TRES hijos (marca, nav, toggle suelto) →
  el test afirma `inner.children` de longitud 2. VERDE: se elimina el
  `<ClientOnly><ThemeToggle/></ClientOnly>` suelto de `Header`; quedan marca + `HeaderNav`.
  El test comprueba además: hijo[0] = `<a href="/">`, hijo[1] = `nav` "Principal", y el
  botón de tema DENTRO del nav. `Header.module.scss` `.inner` (space-between) INTACTO
  (con 2 grupos → logo izq / clúster der, sin hueco central).
- `nav.ts` INTACTO (NAV_LINKS, CTA "Hablamos").

### Bloque 4 — Arco del hero (`Hero` + `Hero.module.scss`)

- HERO-1 ROJO (fidelidad @s7): el hero no tenía primer hijo decorativo. VERDE: se añade
  `<div data-hero-arc aria-hidden="true" class={styles.arc} />` como PRIMER hijo (antes de
  `.inner`). Test: `hero.firstElementChild` tiene `data-hero-arc`, `aria-hidden="true"` y
  `tabIndex === -1` (no enfocable). (Nota: inicialmente metí el SVG completo en este verde;
  lo revertí a `div` vacío para no adelantar @s8 y respetar la Ley 3.)
- HERO-2 ROJO (fidelidad @s8): el arco no tenía SVG. VERDE: SVG verbatim de la referencia
  (círculo de contorno `r=30`, onda `path`, punto `r=3`), colores por `var(--color-accent)`.
  Test: 2 `circle` + 1 `path`, y `path[stroke] === "var(--color-accent)"`.
- HERO-3 ROJO (fidelidad @s9): `.hero` no tenía `overflow:hidden`. VERDE: se añade
  `overflow: hidden` a `.hero` y la regla `.arc` (position absolute, right/top/width/height,
  opacity .45, z-index 1, pointer-events none) + `@media (max-width:820px)` (opacity .1,
  right -160, top -130). Test lee `Hero.module.scss` y afirma `overflow:hidden` DENTRO de la
  regla `.hero` (regex acotado). `.inner` conserva `z-index:2` (texto por encima).
- Copy del hero INTACTO (eyebrow, H1, subtítulo, 2 CTA, 4 stats).

### Verificación de mutación (Stryker, break=100)

Primera corrida scoped a los 4 ficheros: 98.98% con UN superviviente:
`ThemeToggle.tsx:25 MODE_ICON.system:'monitor' → ''`. Causa: `data-icon` estaba hardcodeado
por rama; con `icon=''` caía a la rama por defecto (monitor) y producía la MISMA salida →
el valor del mapa no era observable. Fix (refactor en verde): `data-icon={icon}` en las tres
ramas → el valor del mapa se refleja en el DOM; las afirmaciones @s3 (`data-icon` por modo)
ya lo matan. Re-corrida: **ThemeToggle.tsx 100% (35/35)**. En la corrida combinada:
theme.ts 100% (54/54), HeaderNav.tsx 100%, Hero.tsx 100%.

## Trazabilidad `@s → test`

### `features/fidelidad_referencia.feature`
- @s1 (botón único, no radiogroup/radio) → `ThemeToggle.test.tsx` "@s1 el control de tema es un único botón…".
- @s2 (cada activación cicla) → `ThemeToggle.test.tsx` "@s2 cada activación cicla el modo…".
- @s3 (icono por modo) → `ThemeToggle.test.tsx` "@s3 el botón identifica su icono activo…".
- @s4 (nombre accesible con el modo) → `ThemeToggle.test.tsx` "@s4 el nombre accesible incluye el modo…".
- @s5 (cabecera 2 grupos, tema en el clúster) → `Header.test.tsx` "@s5 la cabecera tiene dos grupos…".
- @s6 (orden del clúster: enlaces→tema→Hablamos) → `HeaderNav.test.tsx` "@s6 el clúster ordena…".
- @s7 (arco = primer hijo, aria-hidden, no enfocable) → `Hero.test.tsx` "@s7 el arco decorativo es el primer hijo…".
- @s8 (SVG: círculo, onda, punto) → `Hero.test.tsx` "@s8 el SVG del arco contiene…".
- @s9 (`.hero` overflow:hidden) → `Hero.test.tsx` "@s9 el ".hero" recorta el arco…".

### `features/theme_selector.feature` (parche de presentación → modelo de CICLO)
- @s3 (ciclo→Claro fija+persiste light) → `ThemeToggle.test.tsx` "@s3(theme) avanzar el ciclo hasta "Claro"…" + `theme.test.tsx` setMode @s3.
- @s4 (ciclo→Oscuro fija+persiste dark) → `ThemeToggle.test.tsx` "@s4(theme) avanzar el ciclo hasta "Oscuro"…" + `theme.test.tsx` setMode @s4.
- @s5 (ciclo→Sistema borra clave, sigue al SO) → `ThemeToggle.test.tsx` "@s5(theme) avanzar el ciclo hasta "Sistema"…" + `theme.test.tsx` setMode @s5.
- @s1,@s2 (sin clave sigue al SO) → `theme.test.tsx` applyInitialTheme @s1/@s2 (SIN CAMBIOS).
- @s6 (reacción en vivo en Sistema) → `ThemeToggle.test.tsx` "@s6(theme) …reacciona en vivo…" + "…limpia el listener" (truco `DARK_QUERY` conservado).
- @s7 (sobrevive recarga) → `ThemeToggle.test.tsx` "@s7(theme) refleja la preferencia "dark"…" + `theme.test.tsx` applyInitialTheme @s7.
- @s8 (anti-FOUC) → `theme.test.tsx` initialThemeAttribute (@s8) (SIN CAMBIOS).
- Soporte del ciclo: `nextMode` puro → `theme.test.tsx` "nextMode (ciclo…)" ×3.

### Móvil (casos límite del contrato — anti-regresión)
- Visibilidad del tema en móvil → `HeaderNav.test.tsx` "@móvil conserva el botón de tema visible junto a "Menú"".

### Bloque 5 — Pulido a11y (auditoría: 1 mejora)

- A11Y-1 ROJO: test nuevo en `ThemeToggle.test.tsx` afirma que el `<svg>[data-icon]` del
  icono tiene `aria-hidden="true"` (icono decorativo, el botón ya tiene nombre accesible).
  VERDE: `aria-hidden="true"` en los TRES `<svg>` de `ThemeIcon` (luna/sol/monitor). Nada más
  cambia (medidas, paths, `data-icon` intactos; borde en reposo verbatim NO se toca).
  Mata el mutante StringLiteral `"true"` → `ThemeToggle.tsx` sigue 100% (35/35).

## Estado final

- `pnpm verify` VERDE: typecheck 0 · lint 0 warnings · **158 tests** passed.
- `pnpm build` (SSG) VERDE (index.html + aviso-legal prerenderizados; `ThemeToggle` client-only
  no rompe el prerender).
- Mutación scoped (break=100): ThemeToggle.tsx 100%, theme.ts 100%, HeaderNav.tsx 100%, Hero.tsx 100%.
- `stryker.config.json`: los 4 ficheros tocados ya estaban en `mutate`; no hay ficheros NUEVOS que añadir.
- NO marco `done` (pendiente de `judge` + `mutation_tester`).
</content>
